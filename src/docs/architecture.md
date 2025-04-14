
# Architecture Guidelines

## Barrel Exports Pattern

Our project uses the "barrel exports" pattern to simplify imports and improve developer ergonomics.

### What are Barrel Exports?

A barrel export is a file (usually named `index.ts`) that re-exports the contents of other files in the same directory.

### Benefits

1. **Cleaner imports**: Import multiple items from a folder with a single import statement
2. **Simplified refactoring**: Move files within a module without changing import paths elsewhere
3. **Better organization**: Group related functionality logically
4. **Encapsulation**: Hide internal implementation details

### Implementation Guidelines

1. Each feature or logical grouping of files should have an `index.ts` file
2. The `index.ts` file should export all public-facing components, functions, and types
3. Include JSDoc comments in the barrel file to document the module
4. Use named exports rather than default exports for better refactoring support

### Example

```typescript
/**
 * Authentication module
 * @module auth
 */

// Re-export components
export { LoginForm } from './LoginForm';
export { SignupForm } from './SignupForm';
export { ForgotPasswordForm } from './ForgotPasswordForm';

// Re-export hooks
export { useAuth } from './useAuth';
export { useUser } from './useUser';

// Re-export types
export type { User } from './types';
export type { AuthProviderProps } from './AuthProvider';
```

### Usage

```typescript
// ❌ Without barrel exports
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';

// ✅ With barrel exports
import { Button, Input, Label } from '../components/ui';
```

### Avoid Circular Dependencies

Be careful not to create circular dependencies when using barrel exports. If two modules import from each other, consider restructuring or using interface segregation.
