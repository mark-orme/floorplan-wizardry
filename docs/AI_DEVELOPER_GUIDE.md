
# AI Developer Guide

This document provides guidelines for AI developers working on this project to ensure consistent practices and avoid common errors.

## File Naming Conventions

### React Components

- **ALWAYS use PascalCase** for component files: `Button.tsx`, not `button.tsx`
- **ALWAYS match component name to file name** exactly
- **ALWAYS use .tsx extension** for files with JSX
- **NEVER mix case styles** for the same file (e.g., don't reference `app.tsx` in some places and `App.tsx` in others)

```typescript
// Correct
// File: Button.tsx
export const Button = () => {...}

// Incorrect 
// File: button.tsx
export const Button = () => {...}
```

### Hook Files

- **ALWAYS use camelCase** with `use` prefix for hooks: `useAuth.ts`, `useFormState.ts`
- **ALWAYS use .ts extension** unless the hook returns JSX (then use .tsx)
- **ALWAYS match the hook function name to the file name**

### Utility Files

- **ALWAYS use camelCase** for utility files: `stringUtils.ts`, `formatHelpers.ts`

## Import/Export Patterns

### Import Statements

- **ALWAYS use correct case** in import paths:
```typescript
// Correct
import { Button } from './Button';

// Incorrect - will break on case-sensitive file systems
import { Button } from './button';
```

- **ALWAYS check if imported files exist** before adding imports
- **NEVER use dynamic string concatenation** in import paths:
```typescript
// NEVER do this
import { something } from `./components/${name}`;
```

### Export Statements

- **Prefer named exports** for most functions and components
- **Use default exports sparingly** and only for the main component in a file
- **Match exported name to filename** for main components/functions

## React Component Development

- **ALWAYS create new components in their own files**
- **ALWAYS use functional components** with hooks instead of class components
- **NEVER define multiple exported components** in the same file
- **ALWAYS define props interface** with proper typing

```typescript
// Correct
// File: Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return <button className={`btn-${variant}`} onClick={onClick}>{children}</button>;
};
```

## TypeScript Best Practices

- **ALWAYS define explicit return types** for exported functions and components
- **NEVER use `any` type** unless absolutely necessary
- **ALWAYS use proper type imports** to avoid circular dependencies:
```typescript
import type { UserData } from './types';
```

## Common Error Prevention

### Case Sensitivity

- **ALWAYS** be consistent with file casing
- **NEVER** mix casing styles when referencing the same file
- **ALWAYS** use the exact same case in import statements as the actual file name

### Preventing Build Errors

- **ALWAYS check for existing files** before creating new ones
- **NEVER** create files with the same name but different casing
- **ALWAYS use appropriate file extensions**: `.tsx` for React components with JSX, `.ts` for TypeScript files without JSX

## ESLint Rules and Conventions

This project uses ESLint to enforce naming conventions. Always follow these rules:

- Component files must use PascalCase
- Component files must use .tsx extension if they contain JSX
- Hook files must start with 'use' and use camelCase
- Exported component names must match their filename
- Always use explicit types for props and return values

## Refactoring and Code Changes

When refactoring existing code:

- **ALWAYS check entire dependency graph** before renaming files
- **ALWAYS update all imports** when changing file names or paths
- **NEVER mix naming conventions** across the codebase
- **ALWAYS run type checking** before submitting changes
