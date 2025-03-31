
# Straight Line Tool Documentation

This document outlines the implementation details and usage guidelines for the straight line drawing tool in our application.

## Overview

The straight line tool allows users to draw precise straight lines on the canvas. It includes visual feedback during drawing and shows the distance measurement in pixels.

## Architecture

The straight line tool is implemented using a set of React hooks that work together:

1. **useStraightLineTool**: The main hook that coordinates the tool's functionality
2. **useLineState**: Manages the internal state of the line drawing operation
3. **useLineEvents**: Handles mouse events for drawing lines

## Implementation Details

### Initialization Flow

When the straight line tool is activated:

1. The canvas is configured:
   - Drawing mode is disabled (`canvas.isDrawingMode = false`)
   - Selection is disabled (`canvas.selection = false`)
   - Cursor is set to crosshair
   - Object selectability is disabled

2. Event handlers are attached:
   - `mouse:down` - Starts line drawing
   - `mouse:move` - Updates line while drawing
   - `mouse:up` - Completes line drawing

3. Tool state is initialized

### Drawing Process

1. **Start (mouse down)**:
   - Create a new Line object
   - Create a distance tooltip
   - Add both to canvas
   - Set initial points

2. **Draw (mouse move)**:
   - Update the line's end point
   - Calculate distance
   - Update tooltip position and text
   - Re-render canvas

3. **Complete (mouse up)**:
   - Save canvas state for undo/redo
   - Reset drawing state
   - Prepare for next line

### Cancellation

Line drawing can be cancelled by:
- Pressing the Escape key
- Changing tools
- Calling the `cancelDrawing()` function

### Validation

The `validateStraightLineTool()` function ensures the tool is correctly set up by checking:
- Canvas configuration
- Event handler presence
- Cursor settings

## Common Issues and Debugging

### Line Tool Not Activating

If the line tool isn't activating:

1. Check console logs for "Activating straight line tool" message
2. Verify that the DrawingMode is correctly set to STRAIGHT_LINE
3. Ensure event handlers are properly attached using `verifyLineToolEventHandlers()`

### Drawing Not Working

If drawing doesn't work after tool activation:

1. Verify mouse event handlers are correctly handling events
2. Check that lineState is properly initialized
3. Ensure the canvas reference is valid and accessible

### Lines Not Appearing

If lines don't appear:

1. Verify line creation in handleMouseDown
2. Check that lineColor and lineThickness are valid
3. Ensure canvas.add() is called for the line

## TypeScript Requirements

To avoid type errors:

1. Always import proper types from their source modules
2. Use explicit typing for hook return values
3. Properly type event handlers
4. Never use `any` for event parameters
5. Use FabricEventTypes enum for event names

## ESLint Rules

We have specific ESLint rules for line drawing:

1. Line constructor must have exactly 4 numbers (x1, y1, x2, y2)
2. Always check if refs exist before accessing their current property
3. Use DrawingMode enum constants for tool comparisons
4. Clean up event handlers in useEffect return functions
5. Use FabricEventTypes constants for event names

## Best Practices

1. Always validate the tool state after initialization
2. Clean up event handlers when the tool is deactivated
3. Use the useLineState hook for state management
4. Implement proper error handling and logging
5. Test the tool with different canvas states
