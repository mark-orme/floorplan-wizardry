
# Hooks Directory

This directory contains React hooks used throughout the application for various functionality.

## Structure

- `canvas/` - Hooks related to canvas initialization and management
- `drawing/` - General drawing-related hooks 
- `straightLineTool/` - Specialized hooks for the straight line drawing tool

## Key Hooks

### Straight Line Tool

The straight line tool functionality has been refactored into smaller, composable hooks:

- `useStraightLineTool.ts` - Original implementation with all functionality in one hook
- `useStraightLineToolRefactored.ts` - Refactored version that composes smaller hooks
- `useLineState.ts` - Manages line drawing state
- `useStraightLineEvents.ts` - Handles Fabric.js events for line drawing
- `useLineKeyboardShortcuts.ts` - Keyboard shortcuts for line tools
- `useLineToolHandlers.ts` - Core logic for handling line drawing
- `useToolCancellation.ts` - Logic for canceling drawing operations
- `useApplePencilSupport.ts` - Enhanced support for Apple Pencil and other stylus inputs

### Input Handling

- `useMouseEvents.ts` - Abstracts mouse event handling for drawing tools
- `usePointProcessing.ts` - Converts DOM events to canvas coordinates
- `useStylusDetection.ts` - Detects and configures stylus input devices

## Usage Guidelines

### Composing Hooks

Our hook architecture follows a composable pattern where smaller, specialized hooks are combined to create more complex functionality. This approach:

1. Improves testability by isolating functionality
2. Enhances maintainability by reducing hook complexity
3. Enables reuse of common functionality

### Apple Pencil Support

When using drawing tools with stylus support:

1. Import and use `useApplePencilSupport` to handle pressure sensitivity
2. Use the `processPencilTouchEvent` function to detect Apple Pencil events
3. Consider grid snapping with `snapPencilPointToGrid` for precision

Example:

```typescript
const { 
  isPencilMode, 
  isApplePencil, 
  adjustedLineThickness 
} = useApplePencilSupport({
  fabricCanvasRef,
  lineThickness
});

// Use adjustedLineThickness for pressure-sensitive drawing
```
