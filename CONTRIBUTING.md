# Contributing to API-Docs-Masterclass

Thank you for your interest in contributing to the API-Docs-Masterclass repository! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
- [Community](#community)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow:

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Collaborative**: Work together to improve documentation
- **Be Professional**: Maintain professional standards in all interactions

## 🎯 How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 1. Documentation Improvements
- Fix typos, grammar, or formatting issues
- Improve clarity and readability
- Add missing information
- Update outdated content

#### 2. New Documentation
- Add new API endpoints
- Create additional guides or tutorials
- Write case studies
- Develop new examples

#### 3. Code Examples
- Add examples in new programming languages
- Improve existing code samples
- Create interactive demos
- Build SDKs or client libraries

#### 4. Tools and Automation
- Enhance build processes
- Add new documentation tools
- Improve CI/CD workflows
- Create testing utilities

#### 5. Translations
- Translate documentation to other languages
- Review and improve existing translations
- Create localization guidelines

### Reporting Issues

Before creating an issue, please:
1. Search existing issues to avoid duplicates
2. Use issue templates when available
3. Provide clear, detailed information
4. Include steps to reproduce (if applicable)

#### Issue Types
- **Bug Report**: Documentation errors or broken examples
- **Feature Request**: New documentation or features
- **Question**: Clarification or help needed
- **Discussion**: Broader topics about API documentation

## 🛠 Development Setup

### Prerequisites

```bash
# Required software
- Git 2.30+
- Node.js 18+ and npm 8+
- Python 3.9+
- A text editor (VS Code recommended)
```

### Local Development

1. **Fork and Clone**
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/API-Docs-Masterclass.git
cd API-Docs-Masterclass
```

2. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

3. **Install Dependencies**
```bash
# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

4. **Run Local Server**
```bash
# Start MkDocs server
mkdocs serve

# In another terminal, run API mock
npx prism mock specs/openapi.yaml
```

5. **Make Changes**
- Edit documentation files
- Test your changes locally
- Ensure all links work
- Validate code examples

6. **Run Tests**
```bash
# Lint documentation
npm run lint:prose

# Check links
npm run check:links

# Validate OpenAPI spec
npm run validate:openapi

# Run all checks
npm test
```

## 📝 Documentation Standards

### File Structure

```
docs/
├── reference/         # API endpoints (one file per resource)
│   ├── authentication.md
│   ├── weather.md
│   └── alerts.md
├── guides/           # How-to guides (task-oriented)
│   ├── getting-started.md
│   ├── authentication-guide.md
│   └── webhooks-setup.md
├── concepts/         # Conceptual explanations
│   ├── api-architecture.md
│   └── rate-limiting.md
└── best-practices/   # Best practices and patterns
    └── error-handling.md
```

### Documentation Template

#### API Endpoint Documentation
```markdown
# Resource Name

Brief description of the resource.

## Endpoints

### GET /resource/{id}

Description of what this endpoint does.

#### Parameters

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | string | path | Yes | Resource identifier |

#### Request Example

```bash
curl -X GET "https://api.example.com/resource/123" \
  -H "Authorization: Bearer TOKEN"
```

#### Response

```json
{
  "id": "123",
  "name": "Example",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Error Codes

| Code | Description |
|------|-------------|
| 404 | Resource not found |
| 401 | Unauthorized |
```

### Writing Style

#### Language and Tone
- Use clear, concise language
- Write in active voice
- Use present tense
- Be consistent with terminology
- Define technical terms on first use

#### Formatting Guidelines
- Use sentence case for headings
- Include code examples for all endpoints
- Provide both curl and SDK examples
- Use tables for structured data
- Include diagrams where helpful

#### Code Examples
- Test all code examples
- Include language-specific idioms
- Show error handling
- Provide complete, runnable examples
- Include comments for clarity

## 🚀 Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Ensure your changes are documented
   - Update the CHANGELOG if applicable
   - Add yourself to CONTRIBUTORS if new

2. **Test Your Changes**
   - Run all tests locally
   - Check documentation builds
   - Verify examples work
   - Test on multiple browsers

3. **Follow Standards**
   - Adhere to style guides
   - Maintain consistent formatting
   - Use semantic commit messages

### Submitting a Pull Request

1. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Provide detailed description
   - Include screenshots if relevant

2. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests pass locally
- [ ] Documentation builds
- [ ] Links checked
- [ ] Examples validated

## Checklist
- [ ] Follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
```

3. **Review Process**
   - Respond to feedback promptly
   - Make requested changes
   - Keep PR updated with main branch
   - Be patient and respectful

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

Examples:
```bash
docs(api): add authentication examples
fix(examples): correct Python syntax error
feat(guides): add GraphQL migration guide
```

## 🎨 Style Guides

### Markdown Style
- Use ATX-style headers (`#`)
- Limit lines to 100 characters
- Use fenced code blocks with language
- Include alt text for images
- Use reference-style links for repeated URLs

### API Documentation Style
- Follow [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)
- Use [API documentation best practices](https://www.apimatic.io/api-documentation-best-practices/)
- Maintain consistency with existing docs

### Code Style
- **Python**: PEP 8
- **JavaScript**: StandardJS
- **Shell**: Google Shell Style Guide
- **YAML**: 2-space indentation

## 🌟 Recognition

### Contributors
All contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributors page
- Documentation credits

### Contribution Levels
- 🥉 **Bronze**: First contribution merged
- 🥈 **Silver**: 5+ contributions
- 🥇 **Gold**: 10+ contributions
- 💎 **Diamond**: Core maintainer

## 🤔 Getting Help

### Resources
- [Documentation](docs/): Read existing documentation
- [Issues](https://github.com/ap-itech-writer/API-Docs-Masterclass/issues): Search for answers
- [Discussions](https://github.com/ap-itech-writer/API-Docs-Masterclass/discussions): Ask questions
- [Discord](https://discord.gg/api-docs): Join our community

### Mentorship
New contributors can request mentorship by:
1. Adding "mentor-needed" label to issues
2. Joining #mentorship channel on Discord
3. Attending contributor office hours

## 📚 Additional Resources

### Learning Materials
- [Write the Docs](https://www.writethedocs.org/)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [The Good Docs Project](https://thegooddocsproject.dev/)

### Tools
- [Vale](https://vale.sh/): Prose linting
- [markdownlint](https://github.com/DavidAnson/markdownlint): Markdown linting
- [Grammarly](https://www.grammarly.com/): Grammar checking

## 🎯 Contribution Challenges

Enhance your skills with these challenges:

### Beginner Challenges
1. Fix three typos or grammar issues
2. Add a code example in a new language
3. Improve one section's clarity

### Intermediate Challenges
1. Write a complete how-to guide
2. Create an interactive demo
3. Add GraphQL documentation

### Advanced Challenges
1. Implement documentation versioning
2. Create automated testing for examples
3. Build a custom documentation tool

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time, effort, and expertise in improving API documentation practices.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/api-docs).

*Happy documenting! 📚*