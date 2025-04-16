
# Contributing to Floor Plan Editor

Welcome to the FloorPlan Designer project! This document provides guidelines for contributing to the project. For detailed documentation on the codebase, please refer to the [docs](./docs) directory.

## 🚦 Development Guidelines

1. ❌ **No `any` or `@ts-ignore`** - Never use `any` or `@ts-ignore` unless wrapped in `// FIXME:` or `// TODO:` with an explanation and ticket number
2. ✅ **Explicit Return Types** - All functions must have explicit return types
3. 📐 **No Magic Numbers** - All values that aren't obvious must be constants in a dedicated constants file
4. 🧠 **JSDoc Comments** - All public functions and interfaces must include JSDoc comments
5. 🧱 **Centralized Types** - Shared types must live in `src/types`, not duplicated across modules
6. 🧪 **Type Safety First** - If unsure, define a new interface or type alias
7. 🚫 **Separation of Concerns** - Avoid mixing view logic with controller logic
8. 🔀 **Avoid Circular References** - Structure imports to prevent circular dependencies
9. 📏 **File Size Limits** - Keep files under 200 lines; split larger files into modules
10. 🔄 **Promise Handling** - Always use await or .catch() with promises to prevent unhandled rejections
11. 🧮 **Boolean Expression Safety** - Use explicit boolean checks rather than truthy/falsy coercion
12. 🔍 **Hook Contracts** - All hooks must have explicit return types
13. 🔲 **Grid System Safety** - Use proper grid utility functions for all grid operations
14. 📝 **Logging Standards** - Use the logger utility with appropriate log levels

## 📚 Documentation References

For detailed documentation on specific aspects of the codebase, please refer to:

- [Project Overview](./README.md) - High-level architecture and directory structure
- [Straight Line Tool](./docs/STRAIGHT_LINE_TOOL.md) - Documentation on the straight line drawing tool
- [Grid System](./docs/grid-system.md) - Detailed documentation on the grid architecture
- [Grid Troubleshooting](./docs/grid-troubleshooting.md) - Solutions for common grid issues

## 📝 Pull Request Guidelines

1. Reference the issue number in your PR description
2. Include before/after screenshots for UI changes
3. Make sure all tests pass and linting checks pass
4. Update documentation if necessary
5. Keep PRs focused on a single concern for easier review
6. Follow the code style defined in ESLint rules

### PR Checklist

Before submitting your PR, ensure:

- [ ] Tests for the changes have been added/updated
- [ ] Documentation has been updated
- [ ] Code follows the established style guidelines
- [ ] PR description clearly explains the changes
- [ ] If adding new components, they are properly documented with JSDoc
- [ ] All TypeScript types are properly defined with no `any`
- [ ] Hook return types are explicitly defined
- [ ] Proper logging has been implemented

## 💾 Pre-commit Hooks

This project uses Husky and lint-staged to enforce code quality on commit:

1. ESLint and Prettier will automatically run on staged files
2. Files with lint errors will prevent commits
3. Run `npm run lint:fix` to fix linting issues
4. Commit messages should follow conventional commits format

## 📦 Dependency Management

1. Use `npx depcheck` to identify unused dependencies
2. Always check for duplicate dependencies
3. Document why a dependency is added in PR descriptions
4. Consider bundle size impact before adding new dependencies

## 💻 Development Workflow

1. Fork the repository
2. Create a new branch for your feature
3. Implement the feature or fix
4. Add appropriate tests
5. Update documentation
6. Submit a pull request

## 🧪 Testing Guidelines

1. Write unit tests for utility functions
2. Write component tests for UI components
3. Test edge cases and error handling
4. Ensure proper mocking of dependencies

## 🔍 Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Ensure CI checks pass
4. Request re-review after addressing comments
