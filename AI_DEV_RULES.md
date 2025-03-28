
# AI Development Rules

This document outlines the rules and best practices for AI-assisted development in this project. Following these guidelines will help ensure type safety, consistency, and maintainability.

## Type Safety Rules

- **Always import types from '@/types'** - never import types from implementation files
- **Never redefine interfaces or types** that already exist in the codebase
- **Never use 'any'** - use 'unknown' if the type is truly unknown, then narrow with type guards
- **Always include explicit return types** for functions and methods
- **Never leave promises unhandled** - always await or add catch handlers to promises
- **Always wrap unions with type guards** before accessing properties
- **Use proper boolean expressions** - avoid implicit boolean conversions
- **Use enums from '@/constants'** for modes, statuses, or other finite sets of values
- **Use interface prefix convention** - prefix interfaces with 'I' (e.g., IUserData)
- **Respect project ESLint rules** - especially those related to TypeScript

## Array and Object Access

- **Always check arrays before accessing** with `if (Array.isArray(arr) && arr.length > 0)`
- **Use optional chaining** for potentially undefined properties: `obj?.prop`
- **Check object existence** before accessing properties: `if (obj && 'prop' in obj)`
- **Use nullish coalescing** for default values: `const value = obj.value ?? defaultValue`
- **Use array methods with type guards** when filtering or mapping union types

## Module Organization

- **Maintain separation of concerns** between types, utilities, and components
- **Avoid circular dependencies** by keeping type definitions free of imports from implementation files
- **Keep files focused and small** (under 200 lines) - create more files rather than growing existing ones
- **Export only what's needed** from a module - avoid `export *` where possible
- **Use barrel exports** for related functionality to simplify imports
- **Split large components** into smaller, focused components with clear responsibilities

## Code Quality

- **Write JSDoc comments** for all public functions, interfaces, and types
- **Use meaningful variable names** that reflect purpose and type
- **Add type guards** for complex operations and type narrowing
- **Write tests** that verify type contracts and behavior
- **Avoid magic numbers** - extract constants with meaningful names
- **Use pre-commit hooks** to enforce linting rules before committing
- **Handle all promises** explicitly with await or .catch()
- **Use strict boolean expressions** instead of relying on JavaScript's truthy/falsy behavior

## Debugging

- **Use console logging judiciously** - and clean up before committing
- **Add explicit error handling** for async operations and complex logic
- **Include helpful error messages** that indicate where the error occurred
- **Use performance monitoring** for complex canvas operations
- **Implement appropriate fallback mechanisms** for error recovery
- **Add retry logic** for operations that might fail transiently

## Git and Pre-commit

- **Pre-commit hooks** will run ESLint and Prettier automatically
- **Lint staged files** ensures only clean code is committed
- **Follow commit message conventions** for clear history
- **Keep PRs focused** on single concerns for easier review
- **Include comprehensive test coverage** for new functionality

## Performance Considerations

- **Implement throttling** for expensive canvas operations
- **Use batching** when creating multiple canvas objects
- **Implement proper cleanup** to prevent memory leaks
- **Be aware of rendering cycles** in React components
- **Leverage memoization** for expensive computations
- **Consider code splitting** for large feature sets

## Working with the Fabric.js Canvas

- **Use appropriate event types** - never use generic Event types
- **Clean up event listeners** when components unmount
- **Batch canvas operations** when possible for better performance
- **Handle canvas errors gracefully** with fallback mechanisms
- **Implement proper coordinate transformation** between different coordinate systems
- **Document assumptions** about coordinate spaces in function JSDoc comments

## Project-Specific Conventions

- **Floor plan coordinates** are always in meters (real-world units)
- **Canvas coordinates** are in pixels based on the current zoom level
- **Grid lines** follow a consistent naming convention for reliable selection
- **Drawing tools** should implement a consistent interface
- **State management** follows established patterns with context providers and hooks
