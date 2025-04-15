
# Hooks

## Overview

This directory contains React hooks that provide reusable logic across the application. These hooks follow React's conventions and are designed to be composable, performant, and well-typed.

## Core Hooks

### Canvas Hooks

- **useCanvasState**: Manages the state of the canvas, including selected tools, zoom level, and object selection.
- **useCanvasInteraction**: Handles user interactions with the canvas like selection, deletion, and modification.
- **useCanvasInitialization**: Manages the initialization of a Fabric.js canvas instance.
- **useCanvasPan**: Implements panning functionality for navigating large canvases.
- **useCanvasZoom**: Manages zoom functionality with mouse wheel and touch gestures.

### Drawing Hooks

- **useDrawingTool**: Provides a consistent interface for all drawing tools.
- **useStraightLineTool**: Specialized hook for drawing straight lines with measurements.
- **useWallDrawing**: Specialized hook for architectural wall drawing.
- **useSnapToGrid**: Provides grid snapping functionality for precise drawing.

### Data Hooks

- **usePusherConnection**: Manages real-time connections with Pusher.
- **useLocalStorage**: Manages persistent state in browser local storage.
- **useFloorPlans**: Manages floor plan data and operations.

### UI Hooks

- **useToolOperations**: Manages tool selection and operations.
- **useKeyboardShortcuts**: Provides keyboard shortcut functionality.
- **useContextMenu**: Manages context menu state and positioning.

## Best Practices

When creating hooks in this directory, follow these guidelines:

1. **Single Responsibility**: Each hook should do one thing well.
2. **Composability**: Hooks should be designed to work well together.
3. **Performance**: Be mindful of excessive re-renders and memoize when appropriate.
4. **Type Safety**: All hooks should be fully typed with TypeScript.
5. **Error Handling**: Include appropriate error handling and logging.
6. **Documentation**: Include JSDoc comments and usage examples.

## Monitoring

Many hooks in this directory include Sentry integration for monitoring:

- Usage metrics
- Performance tracking
- Error reporting with context
- User interaction breadcrumbs

This helps us understand how the application is being used and identify issues.

## Example Usage

```tsx
import { useDrawingTool } from '@/hooks/useDrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

function MyComponent() {
  const {
    tool,
    setTool,
    startDrawing,
    continueDrawing,
    endDrawing,
    isDrawing
  } = useDrawingTool();
  
  const handleToolSelect = (newTool: DrawingMode) => {
    setTool(newTool);
  };
  
  // ... component logic and JSX
}
```
