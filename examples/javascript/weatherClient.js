/**
 * Global Weather API JavaScript/Node.js Client
 * ============================================
 * A comprehensive JavaScript client for the Global Weather API.
 * 
 * Installation:
 *   npm install axios dotenv winston retry-axios
 * 
 * Usage:
 *   const WeatherClient = require('./weatherClient');
 *   
 *   const client = new WeatherClient('your_api_key');
 *   const weather = await client.getCurrentWeather('London');
 *   console.log(`Temperature: ${weather.current.temperature}°C`);
 */

const axios = require('axios');
const crypto = require('crypto');
const EventEmitter = require('events');
const { URL, URLSearchParams } = require('url');

// Load environment variables
require('dotenv').config();

/**
 * Weather units enumeration
 */
const WeatherUnits = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
  KELVIN: 'kelvin'
};

/**
 * Weather severity levels
 */
const WeatherSeverity = {
  MINOR: 'minor',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  EXTREME: 'extreme'
};

/**
 * Custom error classes
 */
class WeatherAPIError extends Error {
  constructor(message, code = null, details = null) {
    super(message);
    this.name = 'WeatherAPIError';
    this.code = code;
    this.details = details;
  }
}

class AuthenticationError extends WeatherAPIError {
  constructor(message) {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

class RateLimitError extends WeatherAPIError {
  constructor(message, retryAfter = null) {
    super(message, 'RATE_LIMIT');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Weather API Client
 */
class WeatherClient extends EventEmitter {
  /**
   * Initialize the Weather API client
   * @param {string} apiKey - API key for authentication
   * @param {Object} options - Configuration options
   */
  constructor(apiKey = process.env.WEATHER_API_KEY, options = {}) {
    super();
    
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    this.config = {
      apiKey,
      baseURL: options.baseURL || 'https://api.globalweather.com/v1',
      timeout: options.timeout || 30000,
      maxRetries: options.maxRetries || 3,
      debug: options.debug || false,
      cacheEnabled: options.cacheEnabled !== false,
      cacheTTL: options.cacheTTL || 300000 // 5 minutes
    };
    
    // Initialize axios instance with interceptors
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'GlobalWeather-JS/1.0'
      }
    });
    
    // Setup interceptors
    this._setupInterceptors();
    
    // Initialize cache
    this.cache = new Map();
    
    // Rate limit tracking
    this.rateLimit = {
      limit: null,
      remaining: null,
      reset: null
    };
  }
  
  /**
   * Setup axios interceptors for request/response handling
   * @private
   */
  _setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
          console.log('[Request] Params:', config.params);
        }
        
        this.emit('request', config);
        return config;
      },
      (error) => {
        this.emit('request-error', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Update rate limit info
        if (response.headers['x-ratelimit-limit']) {
          this.rateLimit = {
            limit: parseInt(response.headers['x-ratelimit-limit']),
            remaining: parseInt(response.headers['x-ratelimit-remaining']),
            reset: parseInt(response.headers['x-ratelimit-reset'])
          };
        }
        
        if (this.config.debug) {
          console.log(`[Response] ${response.status} ${response.statusText}`);
          console.log('[Response] Rate Limit:', this.rateLimit);
        }
        
        this.emit('response', response);
        return response;
      },
      async (error) => {
        if (error.response) {
          const { status, data, headers } = error.response;
          
          // Handle specific error cases
          switch (status) {
            case 401:
              throw new AuthenticationError('Invalid API key');
              
            case 429:
              const retryAfter = headers['retry-after'] || 60;
              throw new RateLimitError(
                'Rate limit exceeded',
                parseInt(retryAfter)
              );
              
            case 404:
              throw new WeatherAPIError('Resource not found', 'NOT_FOUND');
              
            default:
              if (status >= 500) {
                throw new WeatherAPIError(
                  'Server error',
                  'SERVER_ERROR',
                  { status, message: data.error?.message }
                );
              }
          }
        }
        
        this.emit('response-error', error);
        throw error;
      }
    );
    
    // Add retry logic
    this._setupRetry();
  }
  
  /**
   * Setup retry logic for failed requests
   * @private
   */
  _setupRetry() {
    const retryAxios = require('retry-axios');
    
    this.client.defaults.raxConfig = {
      instance: this.client,
      retry: this.config.maxRetries,
      noResponseRetries: 2,
      retryDelay: 1000,
      httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
      statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
      onRetryAttempt: (err) => {
        const cfg = err.config.raxConfig;
        if (this.config.debug) {
          console.log(`[Retry] Attempt #${cfg.currentRetryAttempt}`);
        }
      }
    };
    
    retryAxios.attach(this.client);
  }
  
  /**
   * Generate cache key for request
   * @private
   */
  _getCacheKey(method, url, params) {
    const data = `${method}:${url}:${JSON.stringify(params || {})}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }
  
  /**
   * Get data from cache if available
   * @private
   */
  _getFromCache(key) {
    if (!this.config.cacheEnabled) return null;
    
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
      if (this.config.debug) {
        console.log('[Cache] Hit:', key);
      }
      return cached.data;
    }
    
    return null;
  }
  
  /**
   * Save data to cache
   * @private
   */
  _saveToCache(key, data) {
    if (!this.config.cacheEnabled) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean old entries
    this._cleanCache();
  }
  
  /**
   * Clean expired cache entries
   * @private
   */
  _cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Make API request
   * @private
   */
  async _request(method, endpoint, options = {}) {
    const { params, data, useCache = true } = options;
    
    // Check cache for GET requests
    if (method === 'GET' && useCache) {
      const cacheKey = this._getCacheKey(method, endpoint, params);
      const cached = this._getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        params,
        data
      });
      
      const responseData = response.data;
      
      // Cache successful GET requests
      if (method === 'GET' && useCache) {
        const cacheKey = this._getCacheKey(method, endpoint, params);
        this._saveToCache(cacheKey, responseData);
      }
      
      return responseData;
      
    } catch (error) {
      // Re-throw our custom errors
      if (error instanceof WeatherAPIError) {
        throw error;
      }
      
      // Wrap other errors
      throw new WeatherAPIError(
        error.message || 'Request failed',
        'REQUEST_FAILED',
        error
      );
    }
  }
  
  // Weather Data Methods
  
  /**
   * Get current weather conditions
   * @param {string|Object} location - City name or {lat, lon} object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Current weather data
   */
  async getCurrentWeather(location, options = {}) {
    const params = {
      units: options.units || WeatherUnits.METRIC,
      lang: options.lang || 'en'
    };
    
    if (typeof location === 'string') {
      params.city = location;
    } else if (location && typeof location === 'object') {
      params.lat = location.lat;
      params.lon = location.lon;
    } else {
      throw new Error('Location must be a city name or {lat, lon} object');
    }
    
    return this._request('GET', '/weather/current', { params });
  }
  
  /**
   * Get weather forecast
   * @param {string|Object} location - City name or {lat, lon} object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Weather forecast data
   */
  async getForecast(location, options = {}) {
    const params = {
      days: options.days || 5,
      units: options.units || WeatherUnits.METRIC
    };
    
    if (params.days < 1 || params.days > 7) {
      throw new Error('Days must be between 1 and 7');
    }
    
    if (typeof location === 'string') {
      params.city = location;
    } else if (location && typeof location === 'object') {
      params.lat = location.lat;
      params.lon = location.lon;
    }
    
    return this._request('GET', '/weather/forecast', { params });
  }
  
  /**
   * Get historical weather data
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string|Object} location - City name or {lat, lon} object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Historical weather data
   */
  async getHistoricalWeather(date, location, options = {}) {
    const params = {
      date,
      units: options.units || WeatherUnits.METRIC
    };
    
    if (typeof location === 'string') {
      params.city = location;
    } else if (location && typeof location === 'object') {
      params.lat = location.lat;
      params.lon = location.lon;
    }
    
    return this._request('GET', '/weather/historical', { params });
  }
  
  /**
   * Get weather alerts
   * @param {string|Object} location - City name or {lat, lon} object
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Active weather alerts
   */
  async getAlerts(location, options = {}) {
    const params = {};
    
    if (options.severity) {
      params.severity = options.severity;
    }
    
    if (typeof location === 'string') {
      params.city = location;
    } else if (location && typeof location === 'object') {
      params.lat = location.lat;
      params.lon = location.lon;
    }
    
    return this._request('GET', '/weather/alerts', { params });
  }
  
  /**
   * Search for locations
   * @param {string} query - Search query
   * @param {number} limit - Maximum results (1-10)
   * @returns {Promise<Array>} List of matching locations
   */
  async searchLocations(query, limit = 5) {
    if (limit < 1 || limit > 10) {
      throw new Error('Limit must be between 1 and 10');
    }
    
    const params = { q: query, limit };
    const response = await this._request('GET', '/locations/search', { params });
    return response.results || [];
  }
  
  // Webhook Management
  
  /**
   * Create a webhook subscription
   * @param {Object} webhookConfig - Webhook configuration
   * @returns {Promise<Object>} Created webhook details
   */
  async createWebhook(webhookConfig) {
    const { url, events, description, secret } = webhookConfig;
    
    if (!url || !events || !Array.isArray(events)) {
      throw new Error('URL and events array are required');
    }
    
    const data = {
      url,
      events,
      active: true
    };
    
    if (description) data.description = description;
    if (secret) data.secret = secret;
    
    return this._request('POST', '/webhooks', { data });
  }
  
  /**
   * List all webhooks
   * @returns {Promise<Array>} List of webhooks
   */
  async listWebhooks() {
    const response = await this._request('GET', '/webhooks');
    return response.webhooks || [];
  }
  
  /**
   * Delete a webhook
   * @param {string} webhookId - Webhook identifier
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteWebhook(webhookId) {
    await this._request('DELETE', `/webhooks/${webhookId}`);
    return true;
  }
  
  /**
   * Verify webhook signature
   * @param {Buffer} payload - Request body buffer
   * @param {string} signature - Signature header value
   * @param {string} secret - Webhook secret
   * @returns {boolean} True if signature is valid
   */
  verifyWebhookSignature(payload, signature, secret) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  }
  
  // Utility Methods
  
  /**
   * Get weather for multiple locations
   * @param {Array<string>} locations - Array of city names
   * @param {string} type - Request type (current/forecast)
   * @returns {Promise<Object>} Map of location to weather data
   */
  async batchWeatherRequest(locations, type = 'current') {
    const results = {};
    
    const promises = locations.map(async (location) => {
      try {
        let data;
        if (type === 'current') {
          data = await this.getCurrentWeather(location);
        } else if (type === 'forecast') {
          data = await this.getForecast(location);
        } else {
          throw new Error(`Invalid request type: ${type}`);
        }
        
        results[location] = data;
      } catch (error) {
        console.error(`Failed to get weather for ${location}:`, error.message);
        results[location] = { error: error.message };
      }
    });
    
    await Promise.all(promises);
    return results;
  }
  
  /**
   * Get rate limit information
   * @returns {Object} Current rate limit status
   */
  getRateLimitInfo() {
    return { ...this.rateLimit };
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

/**
 * Weather Monitor class for threshold monitoring
 */
class WeatherMonitor extends EventEmitter {
  /**
   * Initialize weather monitor
   * @param {WeatherClient} client - WeatherClient instance
   */
  constructor(client) {
    super();
    this.client = client;
    this.thresholds = new Map();
    this.monitoringInterval = null;
  }
  
  /**
   * Set a threshold for monitoring
   * @param {Object} config - Threshold configuration
   */
  setThreshold(config) {
    const { parameter, operator, value, location } = config;
    const key = `${location}:${parameter}`;
    
    this.thresholds.set(key, {
      parameter,
      operator,
      value,
      location
    });
  }
  
  /**
   * Check if condition is met
   * @private
   */
  _checkCondition(value, operator, threshold) {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      case '==': return value === threshold;
      case '!=': return value !== threshold;
      default: throw new Error(`Invalid operator: ${operator}`);
    }
  }
  
  /**
   * Check all thresholds
   */
  async checkThresholds() {
    const locations = new Set();
    this.thresholds.forEach(t => locations.add(t.location));
    
    for (const location of locations) {
      try {
        const weather = await this.client.getCurrentWeather(location);
        const current = weather.current;
        
        this.thresholds.forEach((threshold, key) => {
          if (!key.startsWith(`${location}:`)) return;
          
          const value = current[threshold.parameter];
          if (value !== undefined) {
            if (this._checkCondition(value, threshold.operator, threshold.value)) {
              this.emit('threshold-exceeded', {
                location,
                parameter: threshold.parameter,
                value,
                threshold: threshold.value,
                operator: threshold.operator
              });
            }
          }
        });
        
      } catch (error) {
        console.error(`Error checking threshold for ${location}:`, error.message);
        this.emit('error', error);
      }
    }
  }
  
  /**
   * Start monitoring
   * @param {number} interval - Check interval in milliseconds
   */
  startMonitoring(interval = 300000) {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }
    
    this.checkThresholds();
    this.monitoringInterval = setInterval(() => {
      this.checkThresholds();
    }, interval);
    
    this.emit('monitoring-started', { interval });
  }
  
  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.emit('monitoring-stopped');
    }
  }
}

// Example usage
async function main() {
  try {
    // Initialize client
    const apiKey = process.env.WEATHER_API_KEY || 'your_api_key_here';
    const client = new WeatherClient(apiKey, { debug: true });
    
    // Get current weather
    console.log('\n=== Current Weather ===');
    const weather = await client.getCurrentWeather('London');
    console.log(`Location: ${weather.location.city}`);
    console.log(`Temperature: ${weather.current.temperature}°C`);
    console.log(`Conditions: ${weather.current.weather.description}`);
    
    // Get forecast
    console.log('\n=== 3-Day Forecast ===');
    const forecast = await client.getForecast('Paris', { days: 3 });
    forecast.forecast.forEach(day => {
      console.log(`${day.date}: ${day.temperature.min}°C - ${day.temperature.max}°C`);
    });
    
    // Search locations
    console.log('\n=== Location Search ===');
    const locations = await client.searchLocations('New York');
    locations.forEach(loc => {
      console.log(`- ${loc.name}, ${loc.state || ''}, ${loc.country}`);
    });
    
    // Get weather alerts
    console.log('\n=== Weather Alerts ===');
    const alerts = await client.getAlerts('Miami');
    if (alerts.alerts && alerts.alerts.length > 0) {
      alerts.alerts.forEach(alert => {
        console.log(`⚠️ ${alert.title} (${alert.severity})`);
      });
    } else {
      console.log('No active alerts');
    }
    
    // Batch request
    console.log('\n=== Batch Request ===');
    const cities = ['Tokyo', 'Sydney', 'Mumbai'];
    const batchResults = await client.batchWeatherRequest(cities);
    Object.entries(batchResults).forEach(([city, data]) => {
      if (!data.error) {
        console.log(`${city}: ${data.current.temperature}°C`);
      }
    });
    
    // Weather monitoring example
    console.log('\n=== Weather Monitor ===');
    const monitor = new WeatherMonitor(client);
    
    // Set temperature threshold
    monitor.setThreshold({
      parameter: 'temperature',
      operator: '>',
      value: 20,
      location: 'London'
    });
    
    // Listen for threshold exceeded events
    monitor.on('threshold-exceeded', (data) => {
      console.log(`🚨 Alert: ${data.parameter} is ${data.value} in ${data.location}`);
    });
    
    // Check thresholds once
    await monitor.checkThresholds();
    
    // Get rate limit info
    console.log('\n=== Rate Limit Info ===');
    console.log(client.getRateLimitInfo());
    
    console.log('\nDone!');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

// Export classes and run example if executed directly
module.exports = {
  WeatherClient,
  WeatherMonitor,
  WeatherUnits,
  WeatherSeverity,
  WeatherAPIError,
  AuthenticationError,
  RateLimitError
};

if (require.main === module) {
  main();
}