# Weather API Reference

The Weather API provides comprehensive weather data including current conditions, forecasts, and historical data.

## Base URL

```
https://api.globalweather.com/v1
```

## Authentication

All API requests require authentication using an API key in the header:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Get Current Weather

Returns current weather conditions for a specified location.

```http
GET /weather/current
```

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| city | string | query | No* | City name (e.g., "London") |
| lat | float | query | No* | Latitude coordinate |
| lon | float | query | No* | Longitude coordinate |
| units | string | query | No | Temperature units: `metric` (default), `imperial`, `kelvin` |
| lang | string | query | No | Language code (ISO 639-1) |

*Either `city` or both `lat` and `lon` are required.

#### Request Examples

**By City Name:**
```bash
curl -X GET "https://api.globalweather.com/v1/weather/current?city=London&units=metric" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**By Coordinates:**
```bash
curl -X GET "https://api.globalweather.com/v1/weather/current?lat=51.5074&lon=-0.1278" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "location": {
    "city": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    },
    "timezone": "Europe/London"
  },
  "current": {
    "timestamp": "2025-01-01T12:00:00Z",
    "temperature": 15.5,
    "feels_like": 14.2,
    "humidity": 72,
    "pressure": 1013,
    "visibility": 10000,
    "wind": {
      "speed": 5.2,
      "direction": 230,
      "gust": 8.1
    },
    "clouds": {
      "coverage": 40,
      "description": "Scattered clouds"
    },
    "weather": {
      "id": 802,
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    },
    "uv_index": 3,
    "air_quality": {
      "aqi": 42,
      "category": "Good"
    }
  }
}
```

#### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 404 | Not Found - Location not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

### Get Weather Forecast

Returns weather forecast for up to 7 days.

```http
GET /weather/forecast
```

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| city | string | query | No* | City name |
| lat | float | query | No* | Latitude coordinate |
| lon | float | query | No* | Longitude coordinate |
| days | integer | query | No | Number of days (1-7, default: 5) |
| units | string | query | No | Temperature units |
| lang | string | query | No | Language code |

#### Request Example

```bash
curl -X GET "https://api.globalweather.com/v1/weather/forecast?city=Paris&days=3" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "location": {
    "city": "Paris",
    "country": "FR",
    "coordinates": {
      "lat": 48.8566,
      "lon": 2.3522
    }
  },
  "forecast": [
    {
      "date": "2025-01-02",
      "temperature": {
        "min": 8.2,
        "max": 14.5,
        "morning": 9.1,
        "day": 13.8,
        "evening": 11.2,
        "night": 8.5
      },
      "humidity": 65,
      "wind": {
        "speed": 4.2,
        "direction": 180
      },
      "weather": {
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      },
      "precipitation": {
        "probability": 0,
        "volume": 0
      },
      "uv_index": 4
    }
  ]
}
```

---

### Get Historical Weather

Returns historical weather data for a specific date.

```http
GET /weather/historical
```

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| city | string | query | No* | City name |
| lat | float | query | No* | Latitude coordinate |
| lon | float | query | No* | Longitude coordinate |
| date | string | query | Yes | Date (YYYY-MM-DD format) |
| units | string | query | No | Temperature units |

#### Request Example

```bash
curl -X GET "https://api.globalweather.com/v1/weather/historical?city=Tokyo&date=2024-12-25" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "location": {
    "city": "Tokyo",
    "country": "JP"
  },
  "date": "2024-12-25",
  "historical": {
    "temperature": {
      "min": 3.2,
      "max": 11.5,
      "average": 7.3
    },
    "humidity": {
      "min": 45,
      "max": 78,
      "average": 61
    },
    "precipitation": {
      "total": 2.4,
      "hours": 3
    },
    "wind": {
      "max_speed": 12.3,
      "average_speed": 6.7
    },
    "pressure": {
      "min": 1015,
      "max": 1021,
      "average": 1018
    }
  }
}
```

---

### Search Locations

Search for locations to get weather data.

```http
GET /locations/search
```

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| q | string | query | Yes | Search query |
| limit | integer | query | No | Maximum results (1-10, default: 5) |

#### Request Example

```bash
curl -X GET "https://api.globalweather.com/v1/locations/search?q=New%20York&limit=3" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "results": [
    {
      "id": "5128581",
      "name": "New York",
      "state": "New York",
      "country": "US",
      "coordinates": {
        "lat": 40.7128,
        "lon": -74.0060
      }
    },
    {
      "id": "5128582",
      "name": "New York Mills",
      "state": "Minnesota",
      "country": "US",
      "coordinates": {
        "lat": 46.5180,
        "lon": -95.3753
      }
    }
  ],
  "count": 2
}
```

---

### Weather Alerts

Get active weather alerts for a location.

```http
GET /weather/alerts
```

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| city | string | query | No* | City name |
| lat | float | query | No* | Latitude coordinate |
| lon | float | query | No* | Longitude coordinate |
| severity | string | query | No | Filter by severity: `minor`, `moderate`, `severe`, `extreme` |

#### Request Example

```bash
curl -X GET "https://api.globalweather.com/v1/weather/alerts?city=Miami" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response

```json
{
  "location": {
    "city": "Miami",
    "country": "US"
  },
  "alerts": [
    {
      "id": "NWS-2025-001",
      "type": "hurricane_warning",
      "severity": "severe",
      "title": "Hurricane Warning",
      "description": "Hurricane warning in effect from Tuesday evening through Wednesday afternoon",
      "start": "2025-01-02T18:00:00Z",
      "end": "2025-01-03T16:00:00Z",
      "areas": ["Miami-Dade County", "Broward County"],
      "instructions": "Take shelter. Complete preparations.",
      "source": "National Weather Service"
    }
  ],
  "count": 1
}
```

---

## Rate Limiting

API requests are rate limited based on your subscription plan:

| Plan | Requests per Hour | Requests per Day |
|------|------------------|------------------|
| Free | 60 | 1,000 |
| Basic | 600 | 10,000 |
| Pro | 3,600 | 100,000 |
| Enterprise | Unlimited | Unlimited |

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1609459200
```

## Error Handling

All errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "INVALID_LOCATION",
    "message": "The specified location could not be found",
    "details": {
      "city": "InvalidCity",
      "suggestion": "Please check the spelling or try searching for the location first"
    }
  },
  "timestamp": "2025-01-01T12:00:00Z",
  "request_id": "req_abc123"
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| INVALID_API_KEY | API key is invalid or expired | Check your API key |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait before retrying |
| INVALID_LOCATION | Location not found | Verify location name or coordinates |
| INVALID_DATE | Date format or range invalid | Use YYYY-MM-DD format |
| MISSING_PARAMETER | Required parameter missing | Include all required parameters |
| SERVICE_UNAVAILABLE | Temporary service issue | Retry with exponential backoff |

## Webhooks

Subscribe to weather events and receive real-time notifications.

### Webhook Events

- `weather.alert.created` - New weather alert issued
- `weather.alert.updated` - Existing alert updated
- `weather.alert.cancelled` - Alert cancelled
- `weather.threshold.exceeded` - Custom threshold exceeded

### Webhook Payload

```json
{
  "event": "weather.alert.created",
  "timestamp": "2025-01-01T12:00:00Z",
  "data": {
    "alert": {
      "id": "alert_123",
      "type": "severe_thunderstorm",
      "location": "Dallas, TX"
    }
  }
}
```

## SDKs and Libraries

Official SDKs are available for:

- [Python](https://github.com/globalweather/python-sdk)
- [JavaScript/Node.js](https://github.com/globalweather/js-sdk)
- [Java](https://github.com/globalweather/java-sdk)
- [Go](https://github.com/globalweather/go-sdk)
- [Ruby](https://github.com/globalweather/ruby-sdk)

## Support

- **Documentation**: [https://docs.globalweather.com](https://docs.globalweather.com)
- **Status Page**: [https://status.globalweather.com](https://status.globalweather.com)
- **Support Email**: support@globalweather.com
- **Community Forum**: [https://community.globalweather.com](https://community.globalweather.com)