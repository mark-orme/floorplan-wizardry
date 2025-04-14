
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
