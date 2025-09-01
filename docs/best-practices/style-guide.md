# API Documentation Style Guide

A comprehensive guide for writing clear, consistent, and user-friendly API documentation.

## Table of Contents

1. [Introduction](#introduction)
2. [Writing Principles](#writing-principles)
3. [Voice and Tone](#voice-and-tone)
4. [Grammar and Mechanics](#grammar-and-mechanics)
5. [Formatting Standards](#formatting-standards)
6. [API Reference Style](#api-reference-style)
7. [Code Examples](#code-examples)
8. [Error Messages](#error-messages)
9. [Terminology and Glossary](#terminology-and-glossary)
10. [Accessibility Guidelines](#accessibility-guidelines)
11. [Internationalization](#internationalization)
12. [Review Checklist](#review-checklist)

## Introduction

This style guide ensures consistency across all API documentation, making it easier for developers to understand and use our APIs. Following these guidelines creates a better developer experience and reduces support burden.

### Goals

- **Clarity**: Write documentation that's easy to understand
- **Consistency**: Use the same patterns and terminology throughout
- **Completeness**: Provide all necessary information
- **Usability**: Make documentation practical and actionable
- **Accessibility**: Ensure documentation is available to all users

## Writing Principles

### 1. Write for Your Audience

Know your readers and their technical level:

```markdown
❌ Bad: "Implement the singleton pattern for resource optimization."
✅ Good: "Create only one instance of the client to improve performance."
```

### 2. Be Concise but Complete

Remove unnecessary words while keeping essential information:

```markdown
❌ Bad: "In order to be able to make a request to the API endpoint, you will need to first obtain an API key."
✅ Good: "To make API requests, first obtain an API key."
```

### 3. Use Active Voice

Active voice makes documentation more direct and easier to understand:

```markdown
❌ Bad: "The request is authenticated by the server using the API key."
✅ Good: "The server authenticates the request using the API key."
```

### 4. Be Specific

Provide concrete information instead of vague statements:

```markdown
❌ Bad: "The API might take a while to respond."
✅ Good: "The API typically responds within 200ms, with a maximum timeout of 30 seconds."
```

### 5. Show, Don't Just Tell

Include examples to illustrate concepts:

```markdown
❌ Bad: "Format dates using ISO 8601."
✅ Good: "Format dates using ISO 8601: `2025-01-01T12:00:00Z`"
```

## Voice and Tone

### Voice Characteristics

Our documentation voice is:
- **Professional** but not formal
- **Friendly** but not casual
- **Confident** but not arrogant
- **Helpful** but not condescending

### Tone Guidelines

#### For Success Scenarios
Be encouraging and positive:
```markdown
✅ "Great! Your API key is now active and ready to use."
```

#### For Error Scenarios
Be helpful and solution-oriented:
```markdown
✅ "This error occurs when the API key is missing. Add your API key to the Authorization header."
```

#### For Warnings
Be clear about consequences:
```markdown
✅ "Warning: Deleting this resource is permanent and cannot be undone."
```

### Do's and Don'ts

| Do | Don't |
|----|-------|
| Use "you" to address the reader | Use "we" when referring to the developer |
| Say "the API returns" | Say "we return" |
| Use contractions sparingly | Overuse contractions |
| Be encouraging | Be patronizing |
| Acknowledge difficulty | Minimize challenges |

## Grammar and Mechanics

### Capitalization

#### Sentence Case for Headings
```markdown
✅ Good: "Getting started with webhooks"
❌ Bad: "Getting Started With Webhooks"
```

#### Proper Nouns and Products
```markdown
✅ Good: "Use Python 3.9 or later"
✅ Good: "Deploy to AWS Lambda"
```

### Punctuation

#### Oxford Comma
Always use the Oxford comma:
```markdown
✅ Good: "The API supports JSON, XML, and YAML formats."
❌ Bad: "The API supports JSON, XML and YAML formats."
```

#### Code in Sentences
Don't add punctuation to code blocks:
```markdown
✅ Good: Run the following command:
```bash
npm install
```

❌ Bad: Run the following command:
```bash
npm install.
```
```

### Numbers

- Spell out numbers one through nine
- Use numerals for 10 and above
- Always use numerals for:
  - Measurements: "5 seconds"
  - Versions: "Python 3.9"
  - HTTP codes: "404 error"

### Abbreviations and Acronyms

Define on first use:
```markdown
✅ Good: "Use Secure Sockets Layer (SSL) for all connections. SSL ensures..."
```

Common exceptions (no definition needed):
- API, HTTP, HTTPS, URL, JSON, XML, REST, SQL, HTML, CSS

## Formatting Standards

### Document Structure

```markdown
# Page Title

Brief introduction paragraph explaining what this page covers.

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1

Content with subsections as needed.

### Subsection

Detailed information.

## Section 2

More content.
```

### Lists

#### Bulleted Lists
Use for unordered items:
```markdown
Required headers:
- Authorization
- Content-Type
- Accept
```

#### Numbered Lists
Use for sequential steps:
```markdown
1. Create an account
2. Generate an API key
3. Make your first request
```

### Tables

Use tables for structured data:

```markdown
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | string | Yes | Your API key |
| `format` | string | No | Response format (json, xml) |
```

### Code Formatting

#### Inline Code
Use backticks for:
- Parameter names: `user_id`
- File names: `config.json`
- Commands: `npm install`
- Short code: `status: 200`

#### Code Blocks
Include language identifier:

````markdown
```python
import requests

response = requests.get(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"}
)
```
````

### Notes and Warnings

#### Information Notes
```markdown
> **Note**: This endpoint is rate limited to 100 requests per hour.
```

#### Important Information
```markdown
> **Important**: Always store API keys securely. Never commit them to version control.
```

#### Warnings
```markdown
> ⚠️ **Warning**: This action cannot be undone.
```

#### Danger/Critical
```markdown
> 🚨 **Danger**: This endpoint is deprecated and will be removed in v2.0.
```

## API Reference Style

### Endpoint Documentation Template

```markdown
## [HTTP Method] /path/to/endpoint

Brief description of what this endpoint does.

### Request

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `{id}` | string | Yes | Resource identifier |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum number of results (default: 10) |

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | Must be `application/json` |

#### Request Body

```json
{
  "name": "string",
  "email": "string",
  "age": "integer"
}
```

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-01-01T12:00:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "The email address format is invalid"
  }
}
```

### Example

```bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```
```

### Parameter Descriptions

Write clear, actionable descriptions:

```markdown
❌ Bad:
| Parameter | Description |
|-----------|-------------|
| `limit` | Limit |
| `offset` | Offset |

✅ Good:
| Parameter | Description |
|-----------|-------------|
| `limit` | Maximum number of items to return (1-100) |
| `offset` | Number of items to skip before starting to return results |
```

## Code Examples

### Guidelines for Code Examples

1. **Make them runnable**: Provide complete, working examples
2. **Show real use cases**: Use realistic data and scenarios
3. **Include error handling**: Show how to handle common errors
4. **Add comments**: Explain complex parts
5. **Test everything**: Ensure all examples work

### Multi-Language Examples

Provide examples in multiple languages:

````markdown
<details>
<summary>Python</summary>

```python
import requests

response = requests.get(
    "https://api.example.com/weather",
    params={"city": "London"},
    headers={"Authorization": "Bearer YOUR_KEY"}
)

if response.status_code == 200:
    weather = response.json()
    print(f"Temperature: {weather['temperature']}°C")
else:
    print(f"Error: {response.status_code}")
```
</details>

<details>
<summary>JavaScript</summary>

```javascript
fetch('https://api.example.com/weather?city=London', {
    headers: {
        'Authorization': 'Bearer YOUR_KEY'
    }
})
.then(response => response.json())
.then(weather => {
    console.log(`Temperature: ${weather.temperature}°C`);
})
.catch(error => {
    console.error('Error:', error);
});
```
</details>

<details>
<summary>cURL</summary>

```bash
curl -X GET "https://api.example.com/weather?city=London" \
  -H "Authorization: Bearer YOUR_KEY"
```
</details>
````

### Progressive Disclosure

Start simple, then add complexity:

```markdown
### Basic Example

Make a simple request:

```python
response = requests.get("https://api.example.com/users")
```

### Advanced Example

Add authentication and error handling:

```python
try:
    response = requests.get(
        "https://api.example.com/users",
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=30
    )
    response.raise_for_status()
    users = response.json()
except requests.exceptions.RequestException as e:
    print(f"API request failed: {e}")
```
```

## Error Messages

### Error Message Guidelines

Good error messages:
1. **Identify the problem**: What went wrong
2. **Explain why**: Root cause
3. **Suggest a fix**: How to resolve it
4. **Provide resources**: Links to documentation

### Error Message Examples

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. You've exceeded the rate limit of 100 requests per hour.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_at": "2025-01-01T13:00:00Z"
    },
    "documentation": "https://docs.example.com/rate-limiting"
  }
}
```

### Common Error Patterns

| Error Type | Message Pattern | Example |
|------------|----------------|---------|
| Missing Parameter | `{parameter} is required` | "The 'api_key' parameter is required" |
| Invalid Format | `{parameter} must be {format}` | "Email must be a valid email address" |
| Not Found | `{resource} not found` | "User with ID '123' not found" |
| Permission | `You don't have permission to {action}` | "You don't have permission to delete this resource" |

## Terminology and Glossary

### Consistent Terminology

Use consistent terms throughout documentation:

| Use | Don't Use |
|-----|-----------|
| endpoint | URL, route, path |
| API key | token, secret |
| request | call |
| response | result, output |
| parameter | argument, param |

### Technical Terms

Define technical terms on first use or link to glossary:

```markdown
The API uses **JWT (JSON Web Tokens)** for authentication. JWTs are...

Or:

The API uses [JWT](#glossary-jwt) for authentication.
```

### Glossary Template

```markdown
## Glossary

### API Key
A unique identifier used to authenticate requests to the API.

### Endpoint
A specific URL where an API can be accessed.

### Rate Limiting
The practice of limiting the number of API requests a client can make.
```

## Accessibility Guidelines

### Alt Text for Images

Always provide descriptive alt text:

```markdown
![Flow diagram showing the authentication process: User sends credentials, server validates, returns token, user includes token in subsequent requests](auth-flow.png)
```

### Table Headers

Use proper header markup:

```markdown
| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | User's full name |
```

### Link Text

Use descriptive link text:

```markdown
❌ Bad: For more information, [click here](https://docs.example.com)
✅ Good: Learn more about [authentication methods](https://docs.example.com/auth)
```

### Color and Contrast

- Don't rely solely on color to convey information
- Ensure sufficient contrast for text
- Use patterns or icons in addition to color

## Internationalization

### Writing for Translation

1. **Avoid idioms**: Use clear, literal language
2. **Keep sentences simple**: One idea per sentence
3. **Be consistent**: Use the same term for the same concept
4. **Avoid humor**: It rarely translates well
5. **Use full sentences**: Don't concatenate strings

### Date and Time Formats

Always use ISO 8601:
```
2025-01-01T12:00:00Z
```

### Number Formats

Be explicit about formats:
```markdown
✅ Good: "Use decimal notation (1234.56) for coordinates"
```

## Review Checklist

### Content Review

- [ ] Technically accurate
- [ ] Complete information provided
- [ ] Examples are working
- [ ] Links are valid
- [ ] No sensitive information exposed

### Style Review

- [ ] Follows style guide
- [ ] Consistent terminology
- [ ] Clear and concise
- [ ] Active voice used
- [ ] Proper formatting

### Accessibility Review

- [ ] Images have alt text
- [ ] Tables have headers
- [ ] Links are descriptive
- [ ] Color not sole indicator
- [ ] Readable font size

### Code Review

- [ ] Code examples run
- [ ] Error handling shown
- [ ] Comments explain complex parts
- [ ] Multiple languages provided
- [ ] Realistic use cases

### Final Review

- [ ] Spell check passed
- [ ] Grammar check passed
- [ ] Peer reviewed
- [ ] Tested by newcomer
- [ ] Published to correct location

## Quick Reference

### Common Phrases

| Instead of | Use |
|------------|-----|
| "Please note that..." | "Note:" |
| "It should be noted that..." | [Remove entirely] |
| "In order to..." | "To..." |
| "Make use of..." | "Use..." |
| "At this point in time..." | "Now..." |

### Word Choice

| Prefer | Avoid |
|--------|-------|
| "use" | "utilize" |
| "help" | "assist" |
| "about" | "approximately" |
| "start" | "initiate" |
| "end" | "terminate" |

### Markdown Quick Reference

```markdown
# H1 Heading
## H2 Heading
### H3 Heading

**Bold text**
*Italic text*
`inline code`

[Link text](URL)
![Alt text](image.png)

> Blockquote

- Bullet point
1. Numbered item

| Table | Header |
|-------|--------|
| Cell | Cell |

```code block```

---  (horizontal rule)
```

## Resources

### Style Guides
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/style-guide)
- [AWS Documentation Style Guide](https://docs.aws.amazon.com/style-guide)

### Tools
- [Vale](https://vale.sh/): Prose linting
- [alex](https://alexjs.com/): Inclusive language checker
- [Hemingway Editor](http://www.hemingwayapp.com/): Readability checker
- [Grammarly](https://www.grammarly.com/): Grammar and spell checker

### Further Reading
- "Docs for Developers" by Jared Bhatti et al.
- "The Product is Docs" by Christopher Gales
- "Documentation as Code" by Anne Gentle

## Contributing

To suggest improvements to this style guide:
1. Open an issue describing the proposed change
2. Provide examples of current vs. proposed style
3. Explain the benefits of the change
4. Submit a pull request with the changes

Remember: The goal is clarity and consistency. When in doubt, prioritize the reader's understanding over strict adherence to rules.