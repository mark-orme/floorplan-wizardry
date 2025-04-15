
# Contexts

This directory contains React Context providers and their associated hooks.

## Structure

- `AuthContext.tsx`: Authentication state management
- `CanvasContext.tsx`: Canvas state management
- `DrawingContext.tsx`: Drawing state management

## Usage

Contexts should:
1. Export both the provider component and a custom hook to access the context
2. Be properly typed with TypeScript
3. Include meaningful default values
4. Be documented with JSDoc comments

When creating new contexts:
- Consider if a context is truly needed or if props/composition would work
- Export them through the main barrel file (index.ts)
- Create a custom hook to access the context (use[ContextName])
- Provide a meaningful error message if the context is used outside its provider

## Examples

```tsx
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useCanvasContext, CanvasProvider } from '@/contexts/CanvasContext';
```

## Context Organization

Organize contexts by domain:

1. **UI Contexts**: For global UI state like themes, modals, etc.
2. **Domain Contexts**: For business logic like canvas, drawing, etc.
3. **Auth Contexts**: For authentication and authorization state

## Context Design Guidelines

1. **Minimize Context Size**: Keep the state in each context focused on a specific domain
2. **Memoize Values**: Use useMemo to optimize context values
3. **Split Contexts**: Use multiple contexts instead of one large context
4. **Context + Reducers**: Use useReducer for complex state management
5. **Provider Composition**: Nest providers for cleaner organization
6. **Selectors**: Use selector patterns to minimize rerenders

## Error Handling

Contexts should include proper error handling:

```tsx
export function useDrawingContext() {
  const context = useContext(DrawingContext);
  
  if (context === undefined) {
    throw new Error('useDrawingContext must be used within a DrawingProvider');
  }
  
  return context;
}
```
