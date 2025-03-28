
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

## 🧪 Testing Standards

1. All new features should include unit tests
2. UI components should have accessibility tests
3. Use test-driven development where possible

## 💾 Pre-commit Hooks

This project uses Husky and lint-staged to enforce code quality on commit:

1. ESLint and Prettier will automatically run on staged files
2. Files with lint errors will prevent commits
3. Run `npm run lint:fix` to fix linting issues

## 📦 Dependency Management

1. Use `npx depcheck` to identify unused dependencies
2. Always check for duplicate dependencies
3. Document why a dependency is added in PR descriptions

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

## 📚 Additional Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [Project Architecture Overview](./docs/architecture.md)
