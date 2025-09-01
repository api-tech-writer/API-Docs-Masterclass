# Authentication

The Global Weather API uses API keys to authenticate requests. You can view and manage your API keys in your [Dashboard](https://dashboard.globalweather.com).

## Overview

Authentication is required for all API endpoints. The API supports multiple authentication methods to suit different use cases and security requirements.

## Authentication Methods

### 1. API Key Authentication (Recommended)

The simplest and most common method. Include your API key in the Authorization header.

#### Header Authentication

```bash
Authorization: Bearer YOUR_API_KEY
```

**Example:**
```bash
curl -X GET "https://api.globalweather.com/v1/weather/current?city=London" \
  -H "Authorization: Bearer gw_live_abc123def456"
```

#### Query Parameter Authentication

For quick testing only. **Not recommended for production.**

```bash
GET https://api.globalweather.com/v1/weather/current?city=London&api_key=YOUR_API_KEY
```

> ⚠️ **Security Warning**: Never expose API keys in client-side code or public repositories.

### 2. OAuth 2.0

For applications requiring user authorization and enhanced security.

#### Authorization Flow

1. **Redirect user to authorization URL:**
```
https://auth.globalweather.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=read:weather write:alerts&
  state=RANDOM_STATE
```

2. **Exchange authorization code for access token:**
```bash
curl -X POST "https://auth.globalweather.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

3. **Use access token in requests:**
```bash
curl -X GET "https://api.globalweather.com/v1/weather/current?city=London" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

#### Available Scopes

| Scope | Description |
|-------|-------------|
| `read:weather` | Read weather data |
| `write:alerts` | Create custom alerts |
| `read:historical` | Access historical data |
| `write:webhooks` | Manage webhooks |
| `admin:account` | Manage account settings |

### 3. JWT Authentication

For server-to-server communication with short-lived tokens.

#### Creating a JWT

```javascript
const jwt = require('jsonwebtoken');

const payload = {
  iss: 'YOUR_CLIENT_ID',
  sub: 'weather-service',
  aud: 'https://api.globalweather.com',
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  iat: Math.floor(Date.now() / 1000)
};

const token = jwt.sign(payload, YOUR_PRIVATE_KEY, { algorithm: 'RS256' });
```

#### Using JWT in Requests

```bash
curl -X GET "https://api.globalweather.com/v1/weather/current?city=London" \
  -H "Authorization: Bearer JWT_TOKEN"
```

## API Key Management

### Creating API Keys

1. Log in to your [Dashboard](https://dashboard.globalweather.com)
2. Navigate to API Keys section
3. Click "Create New Key"
4. Set permissions and restrictions
5. Copy and securely store your key

### Key Types

| Type | Prefix | Use Case |
|------|--------|----------|
| Live | `gw_live_` | Production environment |
| Test | `gw_test_` | Development and testing |
| Restricted | `gw_rstr_` | Limited scope access |

### Key Restrictions

Enhance security by restricting API keys:

#### IP Address Restriction
```json
{
  "allowed_ips": [
    "192.168.1.1",
    "10.0.0.0/24"
  ]
}
```

#### HTTP Referrer Restriction
```json
{
  "allowed_referrers": [
    "https://example.com/*",
    "https://app.example.com/*"
  ]
}
```

#### Application Restriction
```json
{
  "allowed_applications": [
    "com.example.weatherapp",
    "iOS Bundle ID"
  ]
}
```

## Security Best Practices

### 1. Secure Storage

**Do:**
- Store keys in environment variables
- Use secret management services
- Encrypt keys at rest

**Don't:**
- Hardcode keys in source code
- Commit keys to version control
- Share keys publicly

### 2. Key Rotation

Regularly rotate API keys to maintain security:

```bash
# Generate new key
POST /api/keys/rotate
{
  "current_key": "gw_live_old123",
  "grace_period_hours": 24
}
```

### 3. Environment Separation

Use different keys for different environments:

```bash
# .env.development
WEATHER_API_KEY=gw_test_dev123

# .env.production
WEATHER_API_KEY=gw_live_prod456
```

### 4. Rate Limiting

Implement client-side rate limiting to prevent key suspension:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per hour
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

## Error Responses

### Authentication Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | `AUTH_INVALID_KEY` | API key is invalid |
| 401 | `AUTH_KEY_EXPIRED` | API key has expired |
| 401 | `AUTH_KEY_REVOKED` | API key has been revoked |
| 401 | `AUTH_MISSING_KEY` | No API key provided |
| 403 | `AUTH_INSUFFICIENT_SCOPE` | Key lacks required permissions |
| 403 | `AUTH_IP_RESTRICTED` | Request from unauthorized IP |
| 403 | `AUTH_REFERRER_RESTRICTED` | Request from unauthorized referrer |

### Error Response Format

```json
{
  "error": {
    "code": "AUTH_INVALID_KEY",
    "message": "The provided API key is invalid",
    "details": {
      "key_prefix": "gw_live_",
      "timestamp": "2025-01-01T12:00:00Z"
    }
  },
  "request_id": "req_abc123"
}
```

## Testing Authentication

### Test Endpoint

Verify your authentication setup:

```bash
GET /auth/verify
```

**Request:**
```bash
curl -X GET "https://api.globalweather.com/v1/auth/verify" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "valid": true,
  "key_type": "live",
  "permissions": ["read:weather", "write:alerts"],
  "rate_limit": {
    "limit": 1000,
    "remaining": 950,
    "reset": "2025-01-01T13:00:00Z"
  },
  "account": {
    "id": "acc_123",
    "plan": "pro",
    "email": "user@example.com"
  }
}
```

## Migration Guide

### Migrating from API Key to OAuth 2.0

1. **Register OAuth Application:**
```bash
POST /oauth/applications
{
  "name": "My Weather App",
  "redirect_uris": ["https://app.example.com/callback"],
  "scopes": ["read:weather", "write:alerts"]
}
```

2. **Update Authentication Code:**
```javascript
// Before (API Key)
const headers = {
  'Authorization': `Bearer ${API_KEY}`
};

// After (OAuth)
const headers = {
  'Authorization': `Bearer ${accessToken}`
};
```

3. **Implement Token Refresh:**
```javascript
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://auth.globalweather.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });
  
  return response.json();
}
```

## Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error
- Verify key is copied correctly (no extra spaces)
- Check key hasn't expired
- Ensure using correct environment (live vs test)

#### 2. "Rate Limit Exceeded"
- Check current usage in Dashboard
- Implement exponential backoff
- Consider upgrading plan

#### 3. "Insufficient Permissions"
- Review key permissions in Dashboard
- Request additional scopes for OAuth
- Use appropriate key type

### Debug Headers

Include debug header for detailed error information:

```bash
X-Debug-Mode: true
```

Response will include additional debugging information:

```json
{
  "error": {
    "code": "AUTH_INVALID_KEY",
    "message": "The provided API key is invalid",
    "debug": {
      "key_hash": "abc123...",
      "received_at": "2025-01-01T12:00:00Z",
      "validation_steps": [
        { "step": "format_check", "result": "passed" },
        { "step": "database_lookup", "result": "failed" }
      ]
    }
  }
}
```

## Support

For authentication issues:

- **Documentation**: [Authentication Guide](https://docs.globalweather.com/auth)
- **Dashboard**: [API Key Management](https://dashboard.globalweather.com/keys)
- **Support**: auth-support@globalweather.com
- **Status**: [Authentication Service Status](https://status.globalweather.com/auth)