
# Hooks Directory

This directory contains shared React hooks that are used across multiple features.

## Structure

Hooks in this directory should be generic and reusable:

- `form/` - Form-related hooks
- `ui/` - UI-related hooks
- `data/` - Data fetching and manipulation hooks
- `query/` - React Query hooks
- `storage/` - Local storage and persistence hooks

## Usage Guidelines

1. Hooks should have a clear, single responsibility
2. Name hooks with a `use` prefix following React conventions
3. Document parameters and return values
4. Include TypeScript types for parameters and return values
5. Export hooks through barrel files (index.ts)

## Example

```tsx
// Good example
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ...
}
```
