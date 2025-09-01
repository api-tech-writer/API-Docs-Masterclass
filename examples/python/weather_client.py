#!/usr/bin/env python3
"""
Global Weather API Python Client
=================================
A comprehensive Python client for interacting with the Global Weather API.

Requirements:
    pip install requests python-dotenv backoff

Usage:
    from weather_client import WeatherClient
    
    client = WeatherClient('your_api_key')
    weather = client.get_current_weather('London')
    print(f"Temperature: {weather['current']['temperature']}°C")
"""

import os
import json
import time
import logging
import hashlib
import hmac
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
from urllib.parse import urljoin, urlencode

import requests
import backoff
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WeatherUnits(Enum):
    """Temperature units enumeration."""
    METRIC = "metric"
    IMPERIAL = "imperial"
    KELVIN = "kelvin"


class WeatherSeverity(Enum):
    """Weather alert severity levels."""
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"
    EXTREME = "extreme"


@dataclass
class WeatherConfig:
    """Configuration for Weather API client."""
    api_key: str
    base_url: str = "https://api.globalweather.com/v1"
    timeout: int = 30
    max_retries: int = 3
    verify_ssl: bool = True
    debug: bool = False


class WeatherAPIError(Exception):
    """Base exception for Weather API errors."""
    pass


class AuthenticationError(WeatherAPIError):
    """Raised when authentication fails."""
    pass


class RateLimitError(WeatherAPIError):
    """Raised when rate limit is exceeded."""
    def __init__(self, message: str, retry_after: Optional[int] = None):
        super().__init__(message)
        self.retry_after = retry_after


class WeatherClient:
    """
    Client for interacting with the Global Weather API.
    
    Attributes:
        config: Configuration object for the client
        session: Requests session for connection pooling
    """
    
    def __init__(self, api_key: Optional[str] = None, **kwargs):
        """
        Initialize the Weather API client.
        
        Args:
            api_key: API key for authentication (optional if in env)
            **kwargs: Additional configuration options
        """
        self.config = WeatherConfig(
            api_key=api_key or os.getenv('WEATHER_API_KEY'),
            **kwargs
        )
        
        if not self.config.api_key:
            raise ValueError("API key is required")
        
        # Initialize session with connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.config.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'GlobalWeather-Python/1.0'
        })
        
        # Configure retries
        from requests.adapters import HTTPAdapter
        from requests.packages.urllib3.util.retry import Retry
        
        retry_strategy = Retry(
            total=self.config.max_retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            method_whitelist=["HEAD", "GET", "OPTIONS"]
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        # Cache for storing recent requests
        self._cache: Dict[str, tuple] = {}
        self._cache_ttl = 300  # 5 minutes
    
    def _get_cache_key(self, endpoint: str, params: Dict) -> str:
        """Generate cache key for request."""
        cache_data = f"{endpoint}:{json.dumps(params, sort_keys=True)}"
        return hashlib.md5(cache_data.encode()).hexdigest()
    
    def _get_from_cache(self, cache_key: str) -> Optional[Dict]:
        """Retrieve data from cache if still valid."""
        if cache_key in self._cache:
            data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self._cache_ttl:
                logger.debug(f"Cache hit for key: {cache_key}")
                return data
        return None
    
    def _save_to_cache(self, cache_key: str, data: Dict):
        """Save data to cache."""
        self._cache[cache_key] = (data, time.time())
        
        # Clean old cache entries
        current_time = time.time()
        self._cache = {
            k: v for k, v in self._cache.items()
            if current_time - v[1] < self._cache_ttl
        }
    
    @backoff.on_exception(
        backoff.expo,
        (requests.exceptions.RequestException, RateLimitError),
        max_tries=3,
        max_time=60
    )
    def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
        use_cache: bool = True
    ) -> Dict:
        """
        Make HTTP request to the API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            params: Query parameters
            data: Request body data
            use_cache: Whether to use caching for GET requests
            
        Returns:
            Response data as dictionary
            
        Raises:
            WeatherAPIError: On API errors
            AuthenticationError: On auth failures
            RateLimitError: On rate limit exceeded
        """
        # Check cache for GET requests
        if method == "GET" and use_cache:
            cache_key = self._get_cache_key(endpoint, params or {})
            cached_data = self._get_from_cache(cache_key)
            if cached_data:
                return cached_data
        
        url = urljoin(self.config.base_url, endpoint)
        
        if self.config.debug:
            logger.debug(f"{method} {url}")
            logger.debug(f"Params: {params}")
            logger.debug(f"Data: {data}")
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=data,
                timeout=self.config.timeout,
                verify=self.config.verify_ssl
            )
            
            # Log rate limit headers
            if 'X-RateLimit-Remaining' in response.headers:
                remaining = response.headers['X-RateLimit-Remaining']
                limit = response.headers.get('X-RateLimit-Limit', 'unknown')
                logger.debug(f"Rate limit: {remaining}/{limit} remaining")
            
            # Handle different status codes
            if response.status_code == 401:
                raise AuthenticationError("Invalid API key")
            elif response.status_code == 429:
                retry_after = response.headers.get('Retry-After', 60)
                raise RateLimitError(
                    "Rate limit exceeded",
                    retry_after=int(retry_after)
                )
            elif response.status_code == 404:
                raise WeatherAPIError(f"Resource not found: {endpoint}")
            elif response.status_code >= 500:
                raise WeatherAPIError(f"Server error: {response.status_code}")
            
            response.raise_for_status()
            
            # Parse response
            response_data = response.json()
            
            # Cache successful GET requests
            if method == "GET" and use_cache:
                self._save_to_cache(cache_key, response_data)
            
            return response_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
            raise WeatherAPIError(f"Request failed: {str(e)}")
    
    # Weather Data Methods
    
    def get_current_weather(
        self,
        location: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        units: WeatherUnits = WeatherUnits.METRIC,
        lang: str = "en"
    ) -> Dict:
        """
        Get current weather conditions.
        
        Args:
            location: City name (e.g., "London")
            lat: Latitude coordinate
            lon: Longitude coordinate
            units: Temperature units
            lang: Language code
            
        Returns:
            Current weather data
            
        Example:
            >>> client = WeatherClient('api_key')
            >>> weather = client.get_current_weather('Paris')
            >>> print(weather['current']['temperature'])
        """
        if not location and not (lat and lon):
            raise ValueError("Either location or coordinates required")
        
        params = {
            'units': units.value,
            'lang': lang
        }
        
        if location:
            params['city'] = location
        else:
            params['lat'] = lat
            params['lon'] = lon
        
        return self._make_request('GET', '/weather/current', params=params)
    
    def get_forecast(
        self,
        location: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        days: int = 5,
        units: WeatherUnits = WeatherUnits.METRIC
    ) -> Dict:
        """
        Get weather forecast.
        
        Args:
            location: City name
            lat: Latitude coordinate
            lon: Longitude coordinate
            days: Number of days (1-7)
            units: Temperature units
            
        Returns:
            Weather forecast data
        """
        if not 1 <= days <= 7:
            raise ValueError("Days must be between 1 and 7")
        
        params = {
            'days': days,
            'units': units.value
        }
        
        if location:
            params['city'] = location
        else:
            params['lat'] = lat
            params['lon'] = lon
        
        return self._make_request('GET', '/weather/forecast', params=params)
    
    def get_historical_weather(
        self,
        date: Union[str, datetime],
        location: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        units: WeatherUnits = WeatherUnits.METRIC
    ) -> Dict:
        """
        Get historical weather data for a specific date.
        
        Args:
            date: Date (YYYY-MM-DD format or datetime object)
            location: City name
            lat: Latitude coordinate
            lon: Longitude coordinate
            units: Temperature units
            
        Returns:
            Historical weather data
        """
        if isinstance(date, datetime):
            date_str = date.strftime('%Y-%m-%d')
        else:
            date_str = date
        
        params = {
            'date': date_str,
            'units': units.value
        }
        
        if location:
            params['city'] = location
        else:
            params['lat'] = lat
            params['lon'] = lon
        
        return self._make_request('GET', '/weather/historical', params=params)
    
    def get_alerts(
        self,
        location: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        severity: Optional[WeatherSeverity] = None
    ) -> Dict:
        """
        Get active weather alerts for a location.
        
        Args:
            location: City name
            lat: Latitude coordinate
            lon: Longitude coordinate
            severity: Filter by severity level
            
        Returns:
            Active weather alerts
        """
        params = {}
        
        if location:
            params['city'] = location
        else:
            params['lat'] = lat
            params['lon'] = lon
        
        if severity:
            params['severity'] = severity.value
        
        return self._make_request('GET', '/weather/alerts', params=params)
    
    def search_locations(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search for locations.
        
        Args:
            query: Search query
            limit: Maximum results (1-10)
            
        Returns:
            List of matching locations
        """
        if not 1 <= limit <= 10:
            raise ValueError("Limit must be between 1 and 10")
        
        params = {
            'q': query,
            'limit': limit
        }
        
        response = self._make_request('GET', '/locations/search', params=params)
        return response.get('results', [])
    
    # Webhook Management
    
    def create_webhook(
        self,
        url: str,
        events: List[str],
        description: Optional[str] = None,
        secret: Optional[str] = None
    ) -> Dict:
        """
        Create a webhook subscription.
        
        Args:
            url: Webhook endpoint URL
            events: List of event types to subscribe to
            description: Webhook description
            secret: Secret for signature verification
            
        Returns:
            Created webhook details
        """
        data = {
            'url': url,
            'events': events,
            'active': True
        }
        
        if description:
            data['description'] = description
        
        if secret:
            data['secret'] = secret
        
        return self._make_request('POST', '/webhooks', data=data)
    
    def list_webhooks(self) -> List[Dict]:
        """
        List all webhooks for the account.
        
        Returns:
            List of webhooks
        """
        response = self._make_request('GET', '/webhooks')
        return response.get('webhooks', [])
    
    def delete_webhook(self, webhook_id: str) -> bool:
        """
        Delete a webhook.
        
        Args:
            webhook_id: Webhook identifier
            
        Returns:
            True if deleted successfully
        """
        self._make_request('DELETE', f'/webhooks/{webhook_id}')
        return True
    
    # Utility Methods
    
    def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str,
        secret: str
    ) -> bool:
        """
        Verify webhook signature.
        
        Args:
            payload: Request body bytes
            signature: Signature header value
            secret: Webhook secret
            
        Returns:
            True if signature is valid
        """
        expected = hmac.new(
            secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected, signature)
    
    def batch_weather_request(
        self,
        locations: List[str],
        request_type: str = "current"
    ) -> Dict[str, Dict]:
        """
        Get weather for multiple locations.
        
        Args:
            locations: List of city names
            request_type: Type of request (current, forecast)
            
        Returns:
            Dictionary mapping locations to weather data
        """
        results = {}
        
        for location in locations:
            try:
                if request_type == "current":
                    results[location] = self.get_current_weather(location)
                elif request_type == "forecast":
                    results[location] = self.get_forecast(location)
                else:
                    raise ValueError(f"Invalid request type: {request_type}")
                    
            except WeatherAPIError as e:
                logger.error(f"Failed to get weather for {location}: {e}")
                results[location] = {"error": str(e)}
        
        return results
    
    def close(self):
        """Close the session."""
        self.session.close()
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()


class WeatherMonitor:
    """
    Monitor weather conditions and trigger alerts.
    """
    
    def __init__(self, client: WeatherClient):
        """
        Initialize weather monitor.
        
        Args:
            client: WeatherClient instance
        """
        self.client = client
        self.thresholds: Dict[str, Any] = {}
        self.callbacks: Dict[str, List[callable]] = {}
    
    def set_threshold(
        self,
        parameter: str,
        operator: str,
        value: float,
        location: str
    ):
        """
        Set a threshold for monitoring.
        
        Args:
            parameter: Weather parameter to monitor
            operator: Comparison operator (>, <, ==, >=, <=)
            value: Threshold value
            location: Location to monitor
        """
        key = f"{location}:{parameter}"
        self.thresholds[key] = {
            'operator': operator,
            'value': value,
            'parameter': parameter,
            'location': location
        }
    
    def on_threshold_exceeded(self, callback: callable):
        """
        Register callback for threshold exceeded events.
        
        Args:
            callback: Function to call when threshold is exceeded
        """
        if 'threshold_exceeded' not in self.callbacks:
            self.callbacks['threshold_exceeded'] = []
        self.callbacks['threshold_exceeded'].append(callback)
    
    def check_thresholds(self):
        """Check all thresholds and trigger callbacks."""
        locations = set(t['location'] for t in self.thresholds.values())
        
        for location in locations:
            try:
                weather = self.client.get_current_weather(location)
                current_data = weather['current']
                
                for key, threshold in self.thresholds.items():
                    if not key.startswith(f"{location}:"):
                        continue
                    
                    param = threshold['parameter']
                    if param in current_data:
                        value = current_data[param]
                        
                        if self._check_condition(
                            value,
                            threshold['operator'],
                            threshold['value']
                        ):
                            self._trigger_callbacks('threshold_exceeded', {
                                'location': location,
                                'parameter': param,
                                'value': value,
                                'threshold': threshold['value'],
                                'operator': threshold['operator']
                            })
                            
            except WeatherAPIError as e:
                logger.error(f"Error checking threshold for {location}: {e}")
    
    def _check_condition(self, value: float, operator: str, threshold: float) -> bool:
        """Check if condition is met."""
        operators = {
            '>': lambda x, y: x > y,
            '<': lambda x, y: x < y,
            '>=': lambda x, y: x >= y,
            '<=': lambda x, y: x <= y,
            '==': lambda x, y: x == y,
            '!=': lambda x, y: x != y
        }
        
        if operator not in operators:
            raise ValueError(f"Invalid operator: {operator}")
        
        return operators[operator](value, threshold)
    
    def _trigger_callbacks(self, event_type: str, data: Dict):
        """Trigger callbacks for an event."""
        if event_type in self.callbacks:
            for callback in self.callbacks[event_type]:
                try:
                    callback(data)
                except Exception as e:
                    logger.error(f"Callback error: {e}")
    
    def start_monitoring(self, interval: int = 300):
        """
        Start monitoring weather conditions.
        
        Args:
            interval: Check interval in seconds
        """
        import threading
        
        def monitor_loop():
            while True:
                self.check_thresholds()
                time.sleep(interval)
        
        thread = threading.Thread(target=monitor_loop, daemon=True)
        thread.start()


def main():
    """Example usage of the Weather API client."""
    
    # Initialize client
    api_key = os.getenv('WEATHER_API_KEY', 'your_api_key_here')
    
    with WeatherClient(api_key, debug=True) as client:
        
        # Get current weather
        print("\n=== Current Weather ===")
        weather = client.get_current_weather('London')
        print(f"Location: {weather['location']['city']}")
        print(f"Temperature: {weather['current']['temperature']}°C")
        print(f"Conditions: {weather['current']['weather']['description']}")
        
        # Get forecast
        print("\n=== 3-Day Forecast ===")
        forecast = client.get_forecast('Paris', days=3)
        for day in forecast['forecast']:
            print(f"{day['date']}: {day['temperature']['min']}°C - {day['temperature']['max']}°C")
        
        # Search locations
        print("\n=== Location Search ===")
        locations = client.search_locations('New York')
        for loc in locations:
            print(f"- {loc['name']}, {loc.get('state', '')}, {loc['country']}")
        
        # Get weather alerts
        print("\n=== Weather Alerts ===")
        alerts = client.get_alerts('Miami')
        if alerts['alerts']:
            for alert in alerts['alerts']:
                print(f"⚠️ {alert['title']} ({alert['severity']})")
        else:
            print("No active alerts")
        
        # Batch request
        print("\n=== Batch Request ===")
        cities = ['Tokyo', 'Sydney', 'Mumbai']
        batch_results = client.batch_weather_request(cities)
        for city, data in batch_results.items():
            if 'error' not in data:
                temp = data['current']['temperature']
                print(f"{city}: {temp}°C")
    
    # Weather monitoring example
    print("\n=== Weather Monitor ===")
    monitor = WeatherMonitor(WeatherClient(api_key))
    
    # Set temperature threshold
    monitor.set_threshold('temperature', '>', 30, 'Phoenix')
    
    # Register callback
    def alert_callback(data):
        print(f"🚨 Alert: {data['parameter']} is {data['value']} in {data['location']}")
    
    monitor.on_threshold_exceeded(alert_callback)
    
    # Check thresholds once
    monitor.check_thresholds()
    
    print("\nDone!")


if __name__ == "__main__":
    main()