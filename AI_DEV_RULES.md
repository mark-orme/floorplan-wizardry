
# AI Development Rules

This document outlines the rules and best practices for AI-assisted development in this project. Following these guidelines will help ensure type safety, consistency, and maintainability.

## Type Safety Rules

- **Always import types from '@/types'** - never import types from implementation files
- **Never redefine interfaces or types** that already exist in the codebase
- **Never use 'any'** - use 'unknown' if the type is truly unknown, then narrow with type guards
- **Always wrap unions with type guards** before accessing properties
- **Use enums from '@/constants'** for modes, statuses, or other finite sets of values
- **Respect project ESLint rules** - especially those related to TypeScript

## Array and Object Access

- **Always check arrays before accessing** with `if (Array.isArray(arr) && arr.length > 0)`
- **Use optional chaining** for potentially undefined properties: `obj?.prop`
- **Check object existence** before accessing properties: `if (obj && 'prop' in obj)`

## Module Organization

- **Maintain separation of concerns** between types, utilities, and components
- **Avoid circular dependencies** by keeping type definitions free of imports from implementation files
- **Keep files focused and small** (under 200 lines) - create more files rather than growing existing ones
- **Export only what's needed** from a module - avoid `export *` where possible

## Code Quality

- **Write JSDoc comments** for all public functions, interfaces, and types
- **Use meaningful variable names** that reflect purpose and type
- **Add type guards** for complex operations and type narrowing
- **Write tests** that verify type contracts and behavior

## Debugging

- **Use console logging judiciously** - and clean up before committing
- **Add explicit error handling** for async operations and complex logic
- **Include helpful error messages** that indicate where the error occurred
