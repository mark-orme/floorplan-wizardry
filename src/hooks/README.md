
# Hooks

This directory contains custom React hooks that provide reusable logic across the application.

## Core Principles

- **Single Responsibility**: Each hook should do one thing well
- **Composition**: Complex hooks should compose simpler hooks
- **Error Handling**: Hooks should gracefully handle errors and edge cases
- **Performance**: Hooks should be optimized for performance using proper dependencies

## Hook Categories

### Canvas Hooks

These hooks handle canvas operations, drawing, and interactions:

- `useCanvasState` - Manages core canvas state (tool, zoom, etc.)
- `useCanvasOperations` - Composes multiple canvas operation hooks
- `useCanvasHistory` - Manages undo/redo functionality
- `useCanvasTools` - Provides tool-specific operations like zoom, clear, etc.
- `useCanvasRefs` - Provides shared references to canvas objects
- `useCanvasUtilities` - Utility functions for canvas operations
- `useCanvasInitialization` - Handles canvas initialization
- `useCanvasGridInitialization` - Initializes grid on canvas
- `useCanvasInteraction` - Manages user interaction with canvas objects
- `useCanvasProfiler` - Profiles canvas performance

### Drawing Hooks

These hooks handle specific drawing operations:

- `useDrawingTool` - Manages drawing tool state and validation
- `useDrawingHistory` - Manages drawing history (being deprecated)
- `useDrawingState` - Manages current drawing state
- `useDrawingErrorReporting` - Reports drawing errors
- `useDrawingActions` - Provides drawing action functions

### Tool-Specific Hooks

- `useToolOperations` - Manages drawing tool operations

### DOM and UI Hooks

- `useDomRef` - Enhanced ref hook with focus capabilities

## Usage Patterns

### Rate Limiting

Use the `useRateLimitedUpdate` hook to prevent excessive state updates:

```tsx
const [canvasState, setCanvasState] = useState(initialState);
const updateCanvasState = useRateLimitedUpdate(setCanvasState, { 
  method: 'debounce', 
  delay: 100 
});

// Use the rate-limited function instead of setState directly
updateCanvasState(newState);
```

### Canvas Operations

Canvas operations are composed of multiple specialized hooks:

```tsx
const { 
  handleToolChange,
  handleUndo,
  handleRedo,
  handleZoom
} = useCanvasOperations({
  // Configuration options
});
```

### Error Handling

Many hooks include built-in error reporting:

```tsx
const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();

try {
  // Canvas operation
} catch (error) {
  reportDrawingError(error, 'drawing-operation', { 
    tool: currentTool,
    action: 'create-line'
  });
}
```
