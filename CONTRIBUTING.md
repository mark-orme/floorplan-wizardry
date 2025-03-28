
# Contributing to Floor Plan Editor

## 🚦 Development Guidelines

1. ❌ **No `any` or `@ts-ignore`** - Never use `any` or `@ts-ignore` unless wrapped in `// FIXME:` or `// TODO:` with an explanation and ticket number
2. ✅ **Explicit Return Types** - All functions must have explicit return types
3. 📐 **No Magic Numbers** - All values that aren't obvious (e.g., 720, 0.75, 100) must be constants in a dedicated constants file
4. 🧠 **JSDoc Comments** - All public functions and interfaces must include JSDoc comments
5. 🧱 **Centralized Types** - Shared types must live in `src/types`, not duplicated across modules
6. 🧪 **Type Safety First** - If unsure, define a new interface or type alias
7. 🚫 **Separation of Concerns** - Avoid mixing view logic with controller logic
8. 🔀 **Avoid Circular References** - Structure imports to prevent circular dependencies
9. 📏 **File Size Limits** - Keep files under 200 lines; split larger files into modules
10. 🌍 **No Third-Party Code** - No external libraries unless approved and documented
11. 🔄 **Promise Handling** - Always use await or .catch() with promises to prevent unhandled rejections
12. 🧮 **Boolean Expression Safety** - Use explicit boolean checks rather than truthy/falsy coercion

## 📝 Pull Request Guidelines

1. Reference the issue number in your PR description
2. Include before/after screenshots for UI changes
3. Make sure all tests pass and linting checks pass
4. Update documentation if necessary
5. Keep PRs focused on a single concern for easier review
6. Follow the code style defined in ESLint rules

## 🧪 Testing Standards

1. All new features should include unit tests
2. UI components should have accessibility tests
3. Use test-driven development where possible
4. Test edge cases and error conditions thoroughly
5. Mock external dependencies properly

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

## 🏗️ Code Architecture

1. Follow component-based architecture patterns
2. Keep components small and focused on a single responsibility
3. Maintain separation between UI, business logic, and data access
4. Use custom hooks for shared logic
5. Utilize context providers for global state
6. Follow established folder structure and naming conventions

## 🪄 AI Assistant Usage Guidelines

When using AI tools to help with development, use this prompt template:

```
Write this with no any, explicit function return types, extract magic numbers into constants, and include JSDoc for all exported functions. 
Avoid circular references. All types should be in src/types/[domain].ts where relevant.
Make sure the code follows our project structure with small, focused files. 
Ensure compatibility with Fabric.js v6 API.
Implement proper promise handling with await or .catch().
Use strict boolean expressions.
```

## 🛠️ Type Safety Enforcement

1. TypeScript strict mode is enabled
2. ESLint enforces type safety rules:
   - No explicit `any` types
   - Explicit function return types
   - No floating promises (all must be handled)
   - Strict boolean expressions (no implicit coercion)
   - Consistent interface naming and structure

## 📚 Additional Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [Project Architecture Overview](./docs/architecture.md)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
