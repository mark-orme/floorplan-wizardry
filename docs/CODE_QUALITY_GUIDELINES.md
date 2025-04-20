
# Code Quality Guidelines

This document provides guidelines to maintain high code quality and prevent common build errors.

## 🔒 Preventing Build Errors

### TypeScript Syntax

- **Always import React when using JSX**: `import React from 'react'`
- **Use proper JSX syntax**: Ensure all JSX elements are properly closed and formatted
- **Use .tsx extension** for files containing JSX
- **Never use JSX in .ts files** - always use .tsx
- **Check spread operator usage**: Ensure spread syntax `{...props}` is properly formatted
- **Carefully place commas in object/array literals**: Missing or extra commas are common syntax errors

### Module Imports/Exports

- **Verify import paths**: Always check that imported modules exist
- **Use consistent import syntax**: Choose either default or named imports for a module
- **Use proper ESM export syntax** in .js files with type="module"
- **Export with named exports** rather than default exports for better refactorability
- **Update barrel files** (index.ts/js) when adding new exports
- **Use export type for TypeScript types** to avoid circular dependencies

### React Component Development

- **Verify prop types**: Ensure component props match their TypeScript interface
- **Add proper key to list elements**: Always add a unique key when rendering arrays
- **Use fragment syntax properly**: `<>...</>` or `<React.Fragment>...</React.Fragment>`
- **Close all JSX tags**: Self-closing tags need `/>`
- **Check component return types**: Ensure components return valid JSX

## 💻 Pre-Commit Checks

Before committing code, run these checks to prevent build errors:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm run test
```

## 🔍 Code Review Checklist

Use this checklist during code reviews to catch common issues:

- [ ] All TypeScript types are correctly defined
- [ ] No eslint-disable comments unless absolutely necessary
- [ ] No any types used without proper typing
- [ ] JSX syntax is correct (proper closing tags, brackets, etc.)
- [ ] Dynamic imports follow correct patterns
- [ ] Feature flags are properly implemented
- [ ] No circular dependencies introduced
- [ ] All exported modules are properly imported
- [ ] Bundle size impact is considered for new dependencies

## 📝 Best Practices for Preventing Common Errors

### Dynamic Imports

```typescript
// GOOD: Proper dynamic import with error handling
try {
  const module = await import('./path/to/module');
  return module.default; // or named export
} catch (error) {
  console.error('Failed to import module', error);
  return fallbackImplementation;
}

// BAD: Unhandled promise rejection
const module = import('./path/to/module'); // Missing await
```

### Feature Flags

```typescript
// GOOD: Check feature flag before using feature
if (isFeatureEnabled('featureName')) {
  // Use feature
} else {
  // Fallback implementation
}

// BAD: Using feature without checking flag
useCollaborationFeature(); // Might break if feature is disabled
```

### JSX Syntax

```typescript
// GOOD: Proper JSX syntax in TSX file
return (
  <div className="container">
    <Component {...props} />
  </div>
);

// BAD: Malformed JSX
return (
  <div className="container">
    <Component {...props} // Missing closing bracket
  </div>
);
```

### Module Imports

```typescript
// GOOD: Explicit named imports
import { useState, useEffect } from 'react';
import type { ComponentProps } from 'react';

// BAD: Default import from module with no default export
import utils from './utils'; // If utils has no default export
```

## 🛠️ Automated Tools

We use these tools to help prevent common errors:

- **ESLint**: Static code analysis
- **TypeScript**: Type checking
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **lint-staged**: Run linters on staged files
- **bundlesize**: Check bundle size impact

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint Rules Documentation](https://eslint.org/docs/rules/)
