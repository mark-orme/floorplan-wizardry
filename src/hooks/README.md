
# Hooks

This directory contains custom React hooks that encapsulate reusable logic.

## Structure

- `canvas/`: Hooks for canvas manipulation, initialization, and state management
- `drawing/`: Hooks for drawing tools and operations
- `query/`: Hooks for data fetching and state management
- `straightLineTool/`: Hooks specific to the straight line drawing tool

## Usage

Hooks should:
1. Follow the React hooks naming convention (use[HookName])
2. Be properly typed with TypeScript
3. Handle their own cleanup (useEffect return function)
4. Be documented with JSDoc comments
5. Be unit tested when possible

When creating new hooks:
- Place them in an appropriate subdirectory
- Export them through the relevant barrel file (index.ts)
- Keep them focused on a single responsibility
- Use composition of hooks when building complex behaviors

## Examples

```tsx
import { useCanvasInitialization } from '@/hooks/canvas';
import { useDrawingActions } from '@/hooks/drawing';
import { usePropertyQuery } from '@/hooks/query';
```
