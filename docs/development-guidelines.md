
# Development Guidelines

## Coding Standards

### TypeScript

- Use strict typing with proper interfaces and type definitions
- Never use `any` types or `@ts-ignore` directives
- Create dedicated type files for complex interfaces
- Prefix interfaces with 'I' (e.g., IUserData)
- Always include explicit function return types
- Handle all promises properly (await or .catch())
- Use strict boolean expressions, avoiding implicit conversions

### React Best Practices

- Use functional components with hooks
- Implement proper memo/useMemo for performance optimization
- Split large components into smaller, reusable ones (max 200 lines)
- Avoid unnecessary re-renders
- Keep components focused on a single responsibility

### Documentation

- Use JSDoc for all functions, classes, and interfaces
- Include examples for non-obvious implementations
- Document complex algorithms and business rules
- Keep documentation updated when code changes

### State Management

- Use React Query for server state
- Use React Context for global UI state
- Keep local state with useState/useReducer when appropriate
- Implement proper state initialization and cleanup

### Error Handling

- Implement proper error boundaries
- Log errors with appropriate context
- Provide user-friendly error messages and recovery options
- Catch and handle all promise rejections

## Hook Design Patterns

1. **Composition**:
   - Compose complex hooks from simpler ones
   - Follow the single responsibility principle
   - Export individual hooks for testing

2. **Dependencies**:
   - Clearly document hook dependencies
   - Use dependency arrays correctly
   - Consider using useCallback for function dependencies

3. **Error Handling**:
   - Implement try/catch blocks where appropriate
   - Return error states from hooks
   - Use error boundaries for component-level errors

## File Size Management

- Keep files focused and under 200 lines
- Create more files rather than growing existing ones
- Split large components into smaller, focused components
- Use barrel files (index.ts) to simplify imports

## Pull Request Process

1. **Preparation**:
   - Ensure code passes all linting rules and tests
   - Update documentation for any new features or changes
   - Include test coverage for new functionality

2. **Code Quality**:
   - Keep PRs focused on a single feature or bugfix
   - Follow the established patterns and conventions
   - Ensure proper type safety and error handling

3. **Review Process**:
   - Address all review comments
   - Re-test after making requested changes
   - Update documentation as needed

4. **Merging**:
   - Squash commits with clear commit messages
   - Ensure CI passes before merging
   - Update the changelog if applicable
