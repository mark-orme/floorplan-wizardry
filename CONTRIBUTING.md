
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

## 📚 Code Structure Guidelines

### Grid System

When working with the grid system, follow these principles:

1. **Function Responsibility**:
   - Grid creation functions should be in `utils/grid/gridCreationUtils.ts`
   - Grid validation functions should be in `utils/grid/gridValidator.ts`
   - Debugging tools should be in `utils/grid/gridDebugUtils.ts`
   - Diagnostics should be in `utils/grid/gridDiagnostics.ts`

2. **Exports Organization**:
   - All grid utilities should be exported through `utils/grid/index.ts`
   - Use named exports for clarity
   - Group related functions in namespaced objects when appropriate

3. **Error Handling**:
   - Grid functions should handle null/undefined canvases gracefully
   - Implement proper try/catch blocks for canvas operations
   - Log detailed error messages for debugging

4. **Validation First**:
   - Always validate inputs before performing grid operations
   - Check canvas existence and validity
   - Validate grid objects before manipulating them

### Hook Design

When creating React hooks:

1. **Single Responsibility**:
   - Each hook should focus on one specific concern
   - Break complex hooks into smaller, composable hooks
   - Separate data fetching, state management, and side effects

2. **Naming Conventions**:
   - Hooks should start with `use`
   - Name should clearly indicate purpose (e.g., `useGridCreation`)
   - Group related hooks in dedicated directories

3. **Dependencies Management**:
   - Be explicit about hook dependencies
   - Use dependency arrays correctly in useEffect
   - Consider memoization for expensive calculations

4. **Error States**:
   - Include error states in hook returns
   - Provide clear error messages
   - Implement recovery mechanisms where appropriate

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

## 🧪 Testing Standards

1. All new features should include unit tests
2. UI components should have accessibility tests
3. Use test-driven development where possible
4. Test edge cases and error conditions thoroughly
5. Mock external dependencies properly

### Grid Testing

When testing grid functions:

1. **Mock Canvas**:
   - Create a proper mock for FabricCanvas
   - Implement necessary methods (add, remove, contains, etc.)
   - Simulate canvas dimensions

2. **Test Cases**:
   - Test with valid canvas
   - Test with null/undefined canvas
   - Test with invalid dimensions
   - Test with existing grid objects
   - Test error recovery mechanisms

3. **Validation**:
   - Verify grid objects are created correctly
   - Check proper styling is applied
   - Validate error handling works as expected

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

## 🏗️ Grid Architecture

The grid system follows a layered architecture:

1. **Core Creation Layer**:
   - Low-level grid creation functions
   - Direct interaction with Fabric.js API
   - Basic error handling

2. **Validation Layer**:
   - Input validation
   - Grid integrity checks
   - Canvas validation

3. **Recovery Layer**:
   - Retry mechanisms
   - Fallback methods
   - Emergency grid creation

4. **React Integration Layer**:
   - React hooks for grid management
   - Component lifecycle integration
   - State management

### Function Categories

Grid functions fall into these categories:

1. **Creation Functions**:
   - `createBasicEmergencyGrid`: Simplified grid for fallback
   - `createCompleteGrid`: Full-featured grid
   - `createEnhancedGrid`: Grid with additional features
   - `createSimpleGrid`: Basic grid implementation

2. **Validation Functions**:
   - `validateGrid`: Check grid integrity
   - `verifyGridExists`: Verify grid existence
   - `isCanvasValidForGrid`: Validate canvas for grid operation

3. **Management Functions**:
   - `ensureGrid`: Create or verify grid with safety checks
   - `reorderGridObjects`: Manage grid object ordering
   - `clearGrid`: Remove grid from canvas

4. **Diagnostic Functions**:
   - `runGridDiagnostics`: Check grid health
   - `applyGridFixes`: Fix common grid issues
   - `dumpGridState`: Log detailed grid information
   - `emergencyGridFix`: Last-resort grid repair

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
