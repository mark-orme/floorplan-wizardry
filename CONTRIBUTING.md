
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
10. 🌍 **No Third-Party Code** - No external libraries unless approved and documented
11. 🔄 **Promise Handling** - Always use await or .catch() with promises to prevent unhandled rejections
12. 🧮 **Boolean Expression Safety** - Use explicit boolean checks rather than truthy/falsy coercion

## 📚 Documentation References

For detailed documentation on specific aspects of the codebase, please refer to:

- [Project Overview](./docs/project-overview.md) - High-level architecture and directory structure
- [Grid System](./docs/grid-system.md) - Detailed documentation on the grid architecture
- [Development Guidelines](./docs/development-guidelines.md) - Coding standards and best practices
- [Component Design](./docs/component-design.md) - Component architecture and patterns
- [Testing Strategy](./docs/testing-strategy.md) - Testing approaches and tools
- [Common Pitfalls](./docs/common-pitfalls.md) - Known issues and how to avoid them

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
- [ ] If adding new grid functions, they are properly exported in index.ts
- [ ] All TypeScript types are properly defined with no `any`

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

## 📚 Additional Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
