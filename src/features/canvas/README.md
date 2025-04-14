
# Canvas Feature

This module handles all canvas drawing functionality including:

- Canvas initialization and rendering
- Drawing tools and operations
- Object selection and manipulation

## Components

- `CanvasApp` - Main canvas application component
- `Toolbar` - Toolbar for canvas operations
- `CanvasContainer` - Container with proper sizing for canvas

## Hooks

- `useCanvasOperations` - Hook for canvas operations
- `useDrawingTool` - Hook for drawing tool state management
- `useStraightLineTool` - Hook for drawing straight lines

## Usage

Import components and hooks directly from the feature:

```tsx
import { CanvasApp, useDrawingTool } from '@/features/canvas';
```
