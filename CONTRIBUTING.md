# Contributing to IndiBuy

Thank you for your interest in contributing to IndiBuy! This document provides guidelines for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Coding Standards](#coding-standards)
6. [Submitting Changes](#submitting-changes)
7. [Pull Request Process](#pull-request-process)
8. [Reporting Issues](#reporting-issues)
9. [Release Process](#release-process)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing opinions
- Accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- Harassment of any kind
- Discriminatory language or actions
- Personal attacks
- Publishing private information

---

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- Basic understanding of JavaScript/React
- MongoDB knowledge (for backend)
- Next.js knowledge (for frontend)

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/indibuy.git
cd indibuy
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/original/indibuy.git
```

---

## Development Setup

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Run Development Server

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## Making Changes

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New feature
- `bugfix/` - Bug fix
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests

### Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### Commit Messages

Write clear, descriptive commit messages:

```
[TYPE] Brief description

Longer description explaining the changes made.

Fixes #123
Related #456
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

Example:
```
feat: Add product comparison feature

Implement side-by-side product comparison functionality
including price, specifications, and ratings comparison.

Fixes #123
```

---

## Coding Standards

### JavaScript/TypeScript

```javascript
// Use const by default, let when reassignment is needed
const config = { ... };

// Use arrow functions
const getValue = () => { ... };

// Use template literals
const message = `Hello ${name}`;

// Use destructuring
const { user, email } = userData;

// Add JSDoc comments
/**
 * Fetches user data from API
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User data
 */
async function getUser(userId) {
  // ...
}
```

### React Components

```jsx
// Use functional components with hooks
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Effect code
  }, []);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// Add PropTypes or TypeScript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
};
```

### CSS/Tailwind

```jsx
// Use Tailwind utility classes
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="p-4 bg-white rounded-lg shadow">
    Content
  </div>
</div>

// Keep classes organized
<div className={`
  flex items-center gap-4
  p-4 bg-white rounded-lg shadow
  hover:shadow-lg transition
  dark:bg-gray-800
`}>
  Content
</div>
```

### File Structure

```
components/
├── Button/
│   ├── Button.jsx
│   ├── Button.test.jsx
│   └── index.js
├── Card/
│   ├── Card.jsx
│   ├── Card.test.jsx
│   └── index.js
```

### Naming Conventions

- Components: PascalCase (`MyComponent.jsx`)
- Utilities: camelCase (`myFunction.js`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- CSS classes: kebab-case (`.btn-primary`)
- Files: kebab-case for utilities, PascalCase for components

---

## Submitting Changes

### Before Submitting

1. **Test your changes**:
```bash
npm run test
npm run lint
```

2. **Update documentation** if needed
3. **Add/update tests** for new features
4. **Rebase with main**:
```bash
git fetch upstream
git rebase upstream/main
git push origin feature/your-feature-name -f
```

### Create a Pull Request

1. Push to your fork
2. Go to GitHub and create PR
3. Fill in the PR template
4. Link related issues

### PR Title Format

```
[TYPE] Brief description of changes

- Change 1
- Change 2
- Change 3

Fixes #123
Related #456
```

---

## Pull Request Process

### PR Checklist

- [ ] Branch is up to date with `main`
- [ ] Commits are well-formatted
- [ ] Tests pass and coverage maintained
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or clearly noted)
- [ ] Related issues linked

### Code Review

1. Maintainers will review your PR
2. Address feedback and make requested changes
3. Push changes to same branch
4. Request re-review

### Approval & Merge

- Minimum 2 approvals required
- All checks must pass
- Squash commits before merge
- Delete branch after merge

---

## Reporting Issues

### Bug Reports

Create an issue with the following information:

```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: macOS 11.0
- Node: 18.0.0
- Browser: Chrome 100

## Additional Context
Any other relevant information
```

### Feature Requests

```markdown
## Description
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other approaches

## Additional Context
Examples, research, etc.
```

---

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH
- Example: 1.2.3

### Release Checklist

1. [ ] All tests passing
2. [ ] Documentation updated
3. [ ] Changelog updated
4. [ ] Version bumped in package.json
5. [ ] Build successful
6. [ ] Tag created
7. [ ] Release notes published

### Creating a Release

```bash
# Update version
npm version major|minor|patch

# Build
npm run build

# Tag and push
git push origin --tags
```

---

## Development Tips

### Debugging

**Backend:**
```bash
# Debug mode
node --inspect-brk src/server.js
# Visit chrome://inspect
```

**Frontend:**
```bash
# React Developer Tools browser extension
# Redux DevTools for state debugging
```

### Database Management

```bash
# MongoDB shell
mongosh

# Backup
mongodump --uri "mongodb://localhost:27017/indibuy"

# Restore
mongorestore --uri "mongodb://localhost:27017/indibuy" ./dump/indibuy
```

### API Testing

```bash
# Using curl
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Product"}'

# Using Postman or Insomnia
# Import .postman_collection.json
```

---

## Getting Help

- **Documentation**: Check [../docs](../docs)
- **GitHub Issues**: Search existing issues
- **Discussions**: Ask in GitHub Discussions
- **Email**: hello@indibuy.com

---

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- GitHub contributors page

---

## Thank You!

We appreciate your contributions to IndiBuy. Your efforts help make this platform better for everyone!

Happy coding! 🚀

