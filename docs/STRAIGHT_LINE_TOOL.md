
# Straight Line Tool Documentation

## Overview

The Straight Line Tool allows users to draw precise straight lines on the canvas with measurement indicators. This document explains the architecture, usage, and implementation details.

## Architecture

The tool is implemented using several interconnected components:

1. **useStraightLineTool** - Main hook that manages the tool's state and interactions
2. **useLineState** - Manages the state of the current line being drawn
3. **useLineEvents** - Handles mouse events for line drawing operations

### Component Hierarchy

```
useStraightLineTool
  ├── useLineState (State management)
  └── useLineEvents (Event handling)
      └── Fabric.js Canvas interactions
```

## Type Definitions

### LineState Interface

The `LineState` interface is used to track the state of line drawing:

```typescript
interface LineState {
  isDrawing: boolean;               // Whether currently drawing a line
  isToolInitialized: boolean;       // Whether tool is initialized
  startPointRef: RefObject<Point>;  // Starting point of the line
  currentLineRef: RefObject<Line>;  // Current line being drawn
  distanceTooltipRef: RefObject<Text>; // Text showing measurement
  setStartPoint: (point: Point) => void;  // Set start point
  setCurrentLine: (line: Line) => void;   // Set current line
  setDistanceTooltip: (tooltip: Text) => void; // Set tooltip
  initializeTool: () => void;       // Initialize the tool
  resetDrawingState: () => void;    // Reset drawing state
  setIsDrawing: (isDrawing: boolean) => void; // Set drawing state
}
```

## Event Flow

1. **Activation**: When DrawingMode.STRAIGHT_LINE is selected, the tool initializes
2. **Mouse Down**: Creates a new line starting at the cursor position
3. **Mouse Move**: Updates the end point of the line and the distance tooltip
4. **Mouse Up**: Finalizes the line and adds it to the canvas history
5. **Escape Key**: Cancels the current drawing operation

## Implementation Notes

### Canvas Configuration

When the Straight Line Tool is activated:
- Drawing mode is disabled (`canvas.isDrawingMode = false`)
- Selection mode is disabled (`canvas.selection = false`) 
- Cursor is set to crosshair
- Objects are made non-selectable

### Measurement Display

A tooltip is created that follows the midpoint of the line and displays the current length in pixels. This is implemented using a fabric.js Text object.

### Cleanup

The tool properly cleans up all event handlers when:
- Tool is deactivated (user selects another tool)
- Component is unmounted

## Common Issues and Solutions

### Type Compatibility

Ensure proper type compatibility between our application Point interface and fabric.js Point objects by using the conversion utilities:

```typescript
// Converting between types
import { toFabricPoint, fromFabricPoint } from '@/utils/geometryUtils';

// Our Point type to fabric Point
const fabricPoint = toFabricPoint(appPoint);

// fabric Point to our Point type
const appPoint = fromFabricPoint(fabricPoint);
```

### Performance Considerations

- Line rendering is optimized to only update necessary objects
- Distance calculation uses optimized math functions
- Event handlers are properly debounced/throttled when needed

## ESLint Rules

Special ESLint rules have been implemented to ensure proper usage of the Straight Line Tool:

- Ensuring correct Line constructor usage
- Preventing fabric.js type confusion
- Enforcing consistent event handling patterns

## Testing

The Straight Line Tool should be tested for:
1. Correct line creation and rendering
2. Accurate distance measurement
3. Proper cleanup of resources
4. Interaction with other canvas elements
5. Touch device compatibility
