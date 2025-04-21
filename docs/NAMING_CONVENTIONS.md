
# Naming Conventions

This document outlines the naming conventions used in this project to prevent build errors and maintain consistency.

## File Naming

### React Components

- **Use PascalCase for component files**: `Button.tsx`, `UserProfile.tsx`, `NavBar.tsx`
- **Match component name to file name**: The exported component should match the filename exactly
- **Use .tsx extension** for files containing JSX

```typescript
// Correct: Button.tsx
export const Button = () => {...}
// or
export default function Button() {...}

// Incorrect: button.tsx or Button.jsx
```

### Hooks

- **Use camelCase for hook files starting with "use"**: `useAuth.ts`, `useFetchData.ts`
- **Use .ts extension** unless the hook returns JSX (then use .tsx)
- **Export hook with same name as file**: `export function useAuth() {...}`

### Utility Files

- **Use camelCase for utility files**: `stringUtils.ts`, `dateFormatter.ts`
- **Use descriptive, action-oriented names** for utility files

### Type Definition Files

- **Use camelCase for type files**: `userTypes.ts`, `authTypes.ts`
- **Include 'types' in the name** for clarity

## Component Naming

### Component Props

- **Use PascalCase for props interfaces with "Props" suffix**:
  ```typescript
  interface ButtonProps {
    variant: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    onClick: () => void;
  }
  ```

### Enums

- **Use PascalCase for enum names**:
  ```typescript
  enum ButtonVariant {
    Primary = 'primary',
    Secondary = 'secondary',
  }
  ```

### Event Handlers

- **Prefix with "handle" or "on"**:
  ```typescript
  const handleClick = () => {...}
  <button onClick={onSubmit}>Submit</button>
  ```

## Directory Structure

- **Use lowercase kebab-case for directories**: `components/`, `auth-utils/`
- **Group related files in feature directories**

## Imports

- **Use consistent import paths**: Prefer absolute imports with aliases for key directories
- **Match import name to exported component name**:
  ```typescript
  // Correct
  import { Button } from './Button';
  
  // Incorrect
  import { button } from './Button';
  ```

## Common Errors and Solutions

### Case-Sensitivity Issues

Case-sensitivity issues occur especially when deploying to case-sensitive file systems (like Linux):

```typescript
// Error: Cannot find module './button'
import Button from './button'; // When file is actually Button.tsx

// Solution: Match the actual filename exactly
import Button from './Button';
```

### Import Path Errors

```typescript
// Error: Cannot find module './components/buttons/primary-button'
import PrimaryButton from './components/buttons/primary-button';

// Solution: Match directory structure and filename exactly
import PrimaryButton from './components/buttons/PrimaryButton';
```
