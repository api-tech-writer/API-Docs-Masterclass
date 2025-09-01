# [Endpoint Name]

Brief description of what this endpoint does.

## Endpoint

```
[HTTP_METHOD] /path/to/endpoint
```

## Authentication

Describe authentication requirements (e.g., Bearer token, API key, OAuth).

## Request

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `{param}` | string | Yes/No | Parameter description |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `param` | string | No | null | Parameter description |
| `limit` | integer | No | 10 | Maximum number of results (1-100) |
| `offset` | integer | No | 0 | Number of results to skip |

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token for authentication |
| Content-Type | Yes | Must be `application/json` |
| X-Request-ID | No | Unique request identifier for tracking |

### Request Body

```json
{
  "field1": "string",
  "field2": 123,
  "field3": {
    "nested": "value"
  },
  "field4": ["array", "of", "values"]
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field1` | string | Yes | Description of field1 |
| `field2` | integer | No | Description of field2 |
| `field3` | object | No | Description of field3 |
| `field4` | array | No | Description of field4 |

## Response

### Success Response

**Status Code:** `200 OK` or `201 Created` (for POST requests)

**Headers:**
```
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

**Body:**
```json
{
  "id": "resource_123",
  "status": "success",
  "data": {
    "field1": "value1",
    "field2": 123,
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  },
  "metadata": {
    "total": 100,
    "page": 1,
    "per_page": 10
  }
}
```

### Error Responses

#### 400 Bad Request

Invalid request parameters or body.

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'field1' parameter is invalid",
    "details": {
      "field": "field1",
      "reason": "Must be a valid email address"
    }
  }
}
```

#### 401 Unauthorized

Authentication failed or missing.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

#### 403 Forbidden

Authenticated but not authorized for this resource.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

#### 404 Not Found

Resource not found.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource with ID 'resource_123' not found"
  }
}
```

#### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retry_after": 60
  }
}
```

#### 500 Internal Server Error

Server error occurred.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An internal error occurred",
    "request_id": "req_abc123"
  }
}
```

## Examples

### Example 1: Basic Request

<details>
<summary>cURL</summary>

```bash
curl -X GET "https://api.example.com/endpoint" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```
</details>

<details>
<summary>Python</summary>

```python
import requests

response = requests.get(
    "https://api.example.com/endpoint",
    headers={
        "Authorization": "Bearer YOUR_TOKEN",
        "Content-Type": "application/json"
    }
)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")
```
</details>

<details>
<summary>JavaScript</summary>

```javascript
fetch('https://api.example.com/endpoint', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
</details>

<details>
<summary>Go</summary>

```go
package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", "https://api.example.com/endpoint", nil)
    req.Header.Add("Authorization", "Bearer YOUR_TOKEN")
    req.Header.Add("Content-Type", "application/json")
    
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```
</details>

### Example 2: With Parameters

[Add more complex examples with query parameters, request body, etc.]

## Rate Limiting

This endpoint is subject to rate limiting:

- **Free tier**: 100 requests per hour
- **Pro tier**: 1,000 requests per hour
- **Enterprise**: Unlimited

Rate limit information is included in response headers.

## Webhooks

This endpoint can trigger the following webhook events:

- `resource.created` - When a new resource is created
- `resource.updated` - When a resource is updated
- `resource.deleted` - When a resource is deleted

## Notes

- [Add any important notes or caveats]
- [Mention any deprecations or upcoming changes]
- [Link to related endpoints or guides]

## Related

- [Related Endpoint 1](/reference/related-1)
- [Related Guide](/guides/related-guide)
- [Concepts](/concepts/related-concept)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.1 | 2025-01-15 | Added new field `field4` |
| v1.0 | 2025-01-01 | Initial release |

---

**Need help?** Contact [support@example.com](mailto:support@example.com) or visit our [community forum](https://forum.example.com).