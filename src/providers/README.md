
# Providers Directory

This directory contains React context providers used across the application.

## Structure

This directory contains providers that are used application-wide:

- `QueryProvider.tsx` - React Query provider with global configuration
- `AuthProvider.tsx` - Authentication provider
- `UIProvider.tsx` - UI state provider

## Usage Guidelines

1. Providers should manage global or widely-used state
2. Provide clear hooks for consuming context (e.g., `useAuth()`)
3. Document provider props and context values
4. Export providers and hooks through barrel files (index.ts)

## Example

```tsx
// Good example
export const MyContext = createContext<MyContextValue | undefined>(undefined);

export function MyProvider({ children }: { children: React.ReactNode }) {
  // ...
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
}
```
