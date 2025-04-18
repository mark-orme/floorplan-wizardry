# Contributing to Floor Plan Editor

## 🎯 Project Goals

The Floor Plan Editor is an advanced architectural and interior design tool that aims to provide:
- Precise drawing capabilities
- Real-time measurement tools
- Collaborative floor plan creation
- High performance and accessibility

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Local Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/floor-plan-editor.git
   cd floor-plan-editor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📊 Development Metrics

[![Build Status](https://github.com/floor-plan-team/floor-plan-editor/workflows/CI/badge.svg)](https://github.com/floor-plan-team/floor-plan-editor/actions)
[![Coverage Status](https://codecov.io/gh/floor-plan-team/floor-plan-editor/branch/main/graph/badge.svg)](https://codecov.io/gh/floor-plan-team/floor-plan-editor)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-brightgreen)](https://www.w3.org/TR/WCAG21/)

We track:
- Code coverage through Jest and Codecov
- Performance benchmarks using Lighthouse
- Accessibility compliance with WCAG 2.1 AA standards

## 🤝 Contribution Workflow

### 1. Find an Issue
- Check [GitHub Issues](https://github.com/floor-plan-team/floor-plan-editor/issues)
- Look for "good first issue" or "help wanted" labels

### 2. Create a Branch
```bash
git checkout -b feature/description-of-change
```

### 3. Make Changes
- Follow our [Development Guidelines](#development-guidelines)
- Write tests for new functionality
- Ensure all tests pass: `npm test`

### 4. Commit Changes
- Use conventional commit messages
- Example: 
  - `feat: add straight line drawing tool`
  - `fix: resolve grid snapping issue`
  - `docs: update README with new features`

### 5. Pull Request
- Open a PR against the `main` branch
- Describe changes in the PR description
- Link any related issues

## 💡 Development Guidelines

### Code Quality
- No `any` or `@ts-ignore`
- Explicit return types
- JSDoc comments for public functions
- Avoid magic numbers
- Keep files under 200 lines
- No circular dependencies

### Performance
- Use React.memo for component optimization
- Implement lazy loading where possible
- Minimize re-renders
- Use virtualization for large lists

### Testing
- 100% test coverage for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright
- Accessibility tests with Axe

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes

## 🐛 Reporting Bugs

1. Search existing issues
2. Use the bug report template
3. Provide:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser/device information
   - Screenshots or screen recordings

## 🚀 Feature Requests

1. Check existing feature requests
2. Use the feature request template
3. Describe:
   - The problem you're solving
   - Proposed solution
   - Potential implementation approaches

## 📝 Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## 💖 Thank You

Your contributions make this project better for everyone!
