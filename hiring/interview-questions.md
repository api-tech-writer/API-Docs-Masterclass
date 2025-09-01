# API Technical Writer Interview Questions

A comprehensive guide for evaluating API documentation skills during interviews.

## Table of Contents

1. [Screening Questions](#screening-questions)
2. [Technical Writing Skills](#technical-writing-skills)
3. [API Knowledge](#api-knowledge)
4. [Practical Exercises](#practical-exercises)
5. [Tool Proficiency](#tool-proficiency)
6. [Collaboration & Process](#collaboration--process)
7. [Problem Solving](#problem-solving)
8. [Portfolio Review](#portfolio-review)
9. [Take-Home Assignments](#take-home-assignments)
10. [Evaluation Rubric](#evaluation-rubric)

## Screening Questions

### Basic Qualifications

1. **Experience with API Documentation**
   - "How many years have you been writing API documentation?"
   - "What types of APIs have you documented (REST, GraphQL, gRPC)?"
   - "What's the largest API project you've worked on?"

2. **Technical Background**
   - "Do you have any programming experience? Which languages?"
   - "How comfortable are you reading and writing code?"
   - "Have you ever built or consumed an API yourself?"

3. **Writing Samples**
   - "Can you share examples of API documentation you've written?"
   - "What piece of documentation are you most proud of and why?"
   - "Show us documentation you've written for different audiences."

## Technical Writing Skills

### Writing Quality

1. **Clarity and Concision**
   - "How do you balance being thorough versus being concise?"
   - "Rewrite this verbose paragraph to be clearer:" [Provide example]
   - "What's your approach to explaining complex technical concepts?"

2. **Audience Awareness**
   - "How do you adjust documentation for different skill levels?"
   - "Describe your approach to writing for international audiences."
   - "How do you determine what your readers already know?"

3. **Style and Consistency**
   - "What style guides have you used?"
   - "How do you ensure consistency across large documentation sets?"
   - "What's your opinion on using 'you' vs 'the user' in documentation?"

### Exercise: Quick Edit

**Task**: Edit this API endpoint description for clarity and completeness:

```markdown
## POST /users

This endpoint creates users. Send JSON with name and email. Returns user object.
```

**Expected improvements**:
- Add authentication requirements
- Specify request/response format
- Include status codes
- Add examples
- Improve description

## API Knowledge

### REST Concepts

1. **HTTP Methods**
   - "Explain the difference between PUT and PATCH."
   - "When would you use POST vs PUT?"
   - "What are idempotent operations?"

2. **Status Codes**
   - "What's the difference between 401 and 403?"
   - "When should an API return 204 vs 200?"
   - "Explain 4xx vs 5xx errors to a non-technical person."

3. **API Design**
   - "What makes a RESTful API RESTful?"
   - "How do you document pagination?"
   - "Explain versioning strategies you've seen."

### Authentication & Security

1. **Authentication Methods**
   - "Explain OAuth 2.0 in simple terms."
   - "What's the difference between authentication and authorization?"
   - "How would you document API key usage?"

2. **Security Best Practices**
   - "What security considerations should be in API docs?"
   - "How do you handle sensitive information in examples?"
   - "What is CORS and why does it matter?"

### Modern API Technologies

1. **GraphQL**
   - "How does GraphQL documentation differ from REST?"
   - "Explain queries vs mutations."
   - "What is schema introspection?"

2. **WebSockets & Webhooks**
   - "How would you document real-time APIs?"
   - "Explain webhooks to a beginner."
   - "What's different about documenting event-driven APIs?"

## Practical Exercises

### Exercise 1: Document an Endpoint

**Given this code:**

```python
@app.route('/weather/forecast', methods=['GET'])
def get_forecast():
    """
    Get weather forecast for a location.
    Query params: city (required), days (optional, 1-7, default 5)
    Returns: JSON array of daily forecasts
    Errors: 400 if city missing, 404 if city not found
    """
    city = request.args.get('city')
    days = request.args.get('days', 5, type=int)
    # ... implementation
```

**Task**: Write complete API documentation for this endpoint.

**Evaluation criteria**:
- Completeness (all parameters, responses, errors)
- Clear examples
- Proper formatting
- Error handling documentation
- Edge cases consideration

### Exercise 2: Improve Existing Documentation

**Given this documentation:**

```markdown
# API

## getUser

Gets a user.

Parameters: id

Response: user data
```

**Task**: Identify issues and rewrite this documentation.

**Expected improvements**:
- Add HTTP method and path
- Specify parameter types and requirements
- Document response structure
- Add authentication requirements
- Include examples
- Add error responses
- Improve formatting

### Exercise 3: Create a Quick Start Guide

**Scenario**: New API for a todo list application with basic CRUD operations.

**Task**: Write a "Getting Started in 5 Minutes" guide.

**Should include**:
- Account setup
- Authentication
- First API call
- Basic CRUD operations
- Next steps

## Tool Proficiency

### Documentation Tools

1. **Static Site Generators**
   - "Which documentation tools have you used?"
   - "Compare MkDocs vs Sphinx vs Docusaurus."
   - "How do you handle versioning in documentation?"

2. **API Specification Tools**
   - "Experience with OpenAPI/Swagger?"
   - "Have you used Postman for documentation?"
   - "How do you keep docs in sync with code?"

3. **Version Control**
   - "How comfortable are you with Git?"
   - "Describe your documentation workflow with GitHub."
   - "How do you handle documentation reviews?"

### Technical Skills Assessment

1. **Markdown/reStructuredText**
   - "Write a table in Markdown showing API rate limits."
   - "Create a collapsible code example section."
   - "How would you create cross-references?"

2. **API Testing Tools**
   - "How do you test API examples?"
   - "Experience with curl, HTTPie, or Postman?"
   - "How do you ensure code examples work?"

3. **Diagramming**
   - "What tools do you use for technical diagrams?"
   - "Draw a simple authentication flow."
   - "How would you visualize a webhook workflow?"

## Collaboration & Process

### Working with Developers

1. **Information Gathering**
   - "How do you extract information from busy developers?"
   - "What questions do you ask when documenting a new API?"
   - "How do you handle incomplete or changing requirements?"

2. **Review Process**
   - "Describe your documentation review process."
   - "How do you handle technical accuracy reviews?"
   - "What if a developer disagrees with your approach?"

3. **Agile Environment**
   - "How do you fit documentation into sprints?"
   - "When should documentation be written?"
   - "How do you handle documentation debt?"

### Cross-functional Skills

1. **Product Understanding**
   - "How do you learn about a new product/API?"
   - "How do you prioritize what to document?"
   - "How do you identify documentation gaps?"

2. **User Feedback**
   - "How do you gather user feedback on documentation?"
   - "Describe a time you improved docs based on feedback."
   - "How do you measure documentation effectiveness?"

## Problem Solving

### Scenario-Based Questions

1. **Scenario: Unclear Requirements**
   - "The developer says 'just document it like the other endpoints.' What do you do?"
   - Expected: Ask for specifics, find patterns, create template

2. **Scenario: Breaking Changes**
   - "A major API version change is coming. How do you handle documentation?"
   - Expected: Version strategy, migration guide, deprecation notices

3. **Scenario: Poor API Design**
   - "You're documenting an inconsistent API. What do you do?"
   - Expected: Document actual behavior, suggest improvements, create guides to help users

4. **Scenario: Tight Deadline**
   - "Launch is tomorrow and docs aren't ready. How do you prioritize?"
   - Expected: Focus on critical paths, quick start, common use cases

### Critical Thinking

1. **Documentation Decisions**
   - "When would you NOT document something?"
   - "How do you decide the right level of detail?"
   - "Balance between examples and reference documentation?"

2. **Problem Resolution**
   - "Users complain the docs are confusing. How do you investigate?"
   - "Code and docs don't match. How do you resolve?"
   - "How do you handle undocumented features?"

## Portfolio Review

### What to Look For

1. **Writing Quality**
   - Clear, concise explanations
   - Good structure and organization
   - Appropriate technical level
   - Consistent style

2. **Technical Accuracy**
   - Correct HTTP methods and status codes
   - Proper authentication documentation
   - Accurate code examples
   - Complete error handling

3. **User Focus**
   - Progressive disclosure
   - Good examples
   - Common use cases covered
   - Troubleshooting sections

4. **Visual Design**
   - Clean formatting
   - Effective use of tables/lists
   - Helpful diagrams
   - Good navigation

### Red Flags

- No code examples
- Outdated or incorrect information
- Poor organization
- No error documentation
- Missing authentication details
- Inconsistent formatting
- No user guidance

## Take-Home Assignments

### Assignment 1: Document a Simple API

**Provide**: OpenAPI spec for a small API (3-5 endpoints)

**Deliverables**:
1. Getting started guide
2. Complete endpoint reference
3. Two tutorials for common use cases
4. Error handling guide

**Time**: 4-6 hours

**Evaluation**:
- Completeness
- Clarity
- Organization
- Examples quality
- Visual presentation

### Assignment 2: Improve Existing Documentation

**Provide**: Poorly written API documentation

**Task**: 
1. Identify all issues
2. Create improvement plan
3. Rewrite one section as example
4. Explain your approach

**Time**: 2-3 hours

**Evaluation**:
- Problem identification
- Prioritization
- Writing quality
- Strategic thinking

### Assignment 3: Create Integration Tutorial

**Provide**: API credentials and basic documentation

**Task**: Create a tutorial for a specific use case

**Requirements**:
- Working code examples
- Step-by-step instructions
- Troubleshooting section
- Next steps

**Time**: 3-4 hours

**Evaluation**:
- Technical accuracy
- Clarity of instructions
- Code quality
- Completeness

## Evaluation Rubric

### Scoring Guide (1-5 scale)

#### Technical Writing (40%)

| Score | Criteria |
|-------|----------|
| 5 | Exceptional clarity, perfect grammar, engaging style |
| 4 | Very clear, minor issues, good style |
| 3 | Clear, some issues, adequate style |
| 2 | Unclear in places, multiple issues |
| 1 | Poor writing, many errors |

#### API Knowledge (30%)

| Score | Criteria |
|-------|----------|
| 5 | Expert-level understanding, teaches concepts |
| 4 | Strong understanding, explains well |
| 3 | Good understanding, can document accurately |
| 2 | Basic understanding, needs guidance |
| 1 | Limited understanding |

#### Tools & Process (20%)

| Score | Criteria |
|-------|----------|
| 5 | Expert with multiple tools, defines process |
| 4 | Proficient with tools, follows process well |
| 3 | Competent with main tools, understands process |
| 2 | Learning tools, basic process understanding |
| 1 | Unfamiliar with tools/process |

#### Collaboration (10%)

| Score | Criteria |
|-------|----------|
| 5 | Excellent communicator, proactive, leads initiatives |
| 4 | Good communicator, collaborative, takes initiative |
| 3 | Adequate communication, works well with others |
| 2 | Some communication issues, needs improvement |
| 1 | Poor communication skills |

### Interview Feedback Template

```markdown
# Candidate: [Name]
## Date: [Date]
## Position: [API Technical Writer]

### Summary
[Overall impression]

### Strengths
- [Strength 1]
- [Strength 2]
- [Strength 3]

### Areas for Growth
- [Area 1]
- [Area 2]

### Technical Assessment
- Writing Quality: [1-5]
- API Knowledge: [1-5]
- Tools Proficiency: [1-5]
- Examples/Exercises: [1-5]

### Cultural Fit
- Communication: [1-5]
- Collaboration: [1-5]
- Learning Mindset: [1-5]

### Recommendation
[ ] Strong Hire
[ ] Hire
[ ] Maybe
[ ] No Hire

### Notes
[Additional observations]
```

## Sample Answers Guide

### Question: "Explain REST to a non-technical person"

**Good Answer**:
"REST is like ordering at a restaurant. You (the client) make requests to the waiter (the API) using standard methods: GET (view the menu), POST (place an order), PUT (change your entire order), PATCH (modify part of your order), and DELETE (cancel your order). The waiter brings back responses with status codes like 200 (here's your food), 404 (we don't have that dish), or 500 (kitchen is on fire)."

**Why it's good**:
- Uses relatable analogy
- Covers key concepts
- Maintains technical accuracy
- Appropriate for audience

### Question: "How do you document a breaking change?"

**Good Answer**:
"I would:
1. Announce it well in advance with deprecation notices
2. Clearly mark deprecated features in current docs
3. Create a migration guide with:
   - What's changing and why
   - Timeline with key dates
   - Before/after examples
   - Step-by-step migration instructions
   - Common issues and solutions
4. Provide tools or scripts if possible
5. Update all affected examples and tutorials
6. Set up redirects from old documentation
7. Monitor support channels for issues"

**Why it's good**:
- Comprehensive approach
- User-focused
- Practical solutions
- Shows experience

## Additional Resources

### Recommended Reading
- "Docs for Developers" by Jared Bhatti et al.
- "The Product is Docs" by Christopher Gales
- "Every Page is Page One" by Mark Baker

### Online Resources
- [Write the Docs](https://www.writethedocs.org/)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [API Documentation Best Practices](https://swagger.io/blog/api-documentation/best-practices-in-api-documentation/)

### Practice APIs
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [Reqres](https://reqres.in/)
- [OpenWeather API](https://openweathermap.org/api)

---

**Note**: Adjust questions based on seniority level and specific role requirements. Focus on practical skills over theoretical knowledge.