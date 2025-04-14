# Fabric.js Best Practices

This document outlines best practices for working with Fabric.js in our canvas drawing application.

## Canvas Initialization

### Do
- Initialize the canvas only once per mount cycle
- Always dispose of the canvas when unmounting
- Check if the canvas has already been initialized before creating a new instance
- Use a ref to track initialization state

```typescript
// Good practice
const canvasRef = useRef<HTMLCanvasElement>(null);
const fabricCanvasRef = useRef<FabricCanvas | null>(null);
const initializationCheckRef = useRef(false);

useEffect(() => {
  // Check if already initialized
  if (initializationCheckRef.current || !canvasRef.current) return;
  initializationCheckRef.current = true;
  
  // Check for existing fabric instance
  if (canvasRef.current._fabric) {
    console.warn("Canvas already has a Fabric instance!");
    return;
  }
  
  // Initialize canvas
  const fabricCanvas = new FabricCanvas(canvasRef.current, options);
  fabricCanvasRef.current = fabricCanvas;
  
  // Cleanup on unmount
  return () => {
    fabricCanvas.dispose();
    fabricCanvasRef.current = null;
    initializationCheckRef.current = false;
  };
}, []);
```

### Don't
- Initialize the canvas directly in render
- Create multiple canvas instances for the same HTML element
- Forget to dispose of the canvas on unmount
- Re-initialize on every state change

```typescript
// Bad practice
useEffect(() => {
  if (!canvasRef.current) return;
  // This will create a new canvas on every state change!
  const fabricCanvas = new FabricCanvas(canvasRef.current);
  // No cleanup function
}, [state]); // Dependency on changing state
```

## Event Handling

### Do
- Use the FabricEventTypes enum for event names
- Clean up event handlers on unmount
- Use event handler references to ensure proper cleanup
- Use proper typings for event handlers

```typescript
// Good practice
const handleMouseDown = useCallback((opt: FabricMouseDownEvent) => {
  const { e, pointer } = opt;
  // Handler logic
}, [dependencies]);

useEffect(() => {
  if (!fabricCanvas) return;
  
  fabricCanvas.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
  
  return () => {
    fabricCanvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
  };
}, [fabricCanvas, handleMouseDown]);
```

### Don't
- Use string literals for event names
- Add event handlers without cleanup
- Add anonymous functions as event handlers (makes cleanup impossible)
- Recreate event handlers in useEffect

```typescript
// Bad practice
useEffect(() => {
  if (!fabricCanvas) return;
  
  // Anonymous function - can't be removed properly
  fabricCanvas.on('mouse:down', (opt) => {
    // Handler logic
  });
  
  // No cleanup!
}, [fabricCanvas]);
```

## Object Management

### Do
- Set object properties in batch using `set()`
- Use object references for selections
- Explicitly call `requestRenderAll()` after changes
- Use object type property to identify object types
- Set proper default options for new objects

```typescript
// Good practice
const line = new Line([x1, y1, x2, y2], {
  stroke: lineColor,
  strokeWidth: lineThickness,
  selectable: true,
  objectType: 'straight-line' // Custom property for identification
});

// Batch property updates
line.set({
  strokeWidth: newThickness,
  stroke: newColor
});

canvas.add(line);
canvas.requestRenderAll();
```

### Don't
- Set properties individually (causes multiple renders)
- Rely on object constructor alone for styling
- Forget to call `requestRenderAll()`
- Use object equality for identification

```typescript
// Bad practice
const line = new Line([x1, y1, x2, y2]);
line.stroke = lineColor; // Individual property set
line.strokeWidth = lineThickness; // Individual property set
canvas.add(line);
// Missing requestRenderAll()!
```

## Touch and Gesture Support

### Do
- Use proper touch event handling
- Check for device capabilities
- Support multi-touch interactions
- Handle both mouse and touch events

```typescript
// Good practice
// Detect touch capability
const isTouchDevice = 'ontouchstart' in window;

// Handle both mouse and touch
if (isTouchDevice) {
  initializeCanvasGestures(canvas);
} else {
  // Mouse-only handlers
}
```

### Don't
- Use mouse-only event handling on touch devices
- Ignore multi-touch scenarios
- Use browser-incompatible gesture APIs without fallbacks

## Performance Optimization

### Do
- Use object caching for static objects
- Limit the number of objects on canvas
- Use proper zoom and pan handling
- Control object stacking order

```typescript
// Good practice
const rect = new Rect({
  // ... properties
  objectCaching: true // Enable caching for better performance
});

// Batch add objects
canvas.add(...objectBatch);
canvas.requestRenderAll();
```

### Don't
- Add objects one by one with render calls
- Re-render on every tiny change
- Create new objects when existing ones can be modified
- Keep invisible objects in the canvas

## Memory Management

### Do
- Dispose of canvas instances when no longer needed
- Remove objects from canvas when deleted
- Clear references to unused objects
- Use weak references when appropriate

```typescript
// Good practice
// Remove object
canvas.remove(object);

// Clear selection
canvas.discardActiveObject();

// Dispose canvas on unmount
useEffect(() => {
  return () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  };
}, []);
```

### Don't
- Keep references to removed objects
- Leave event handlers attached to removed objects
- Create circular references
- Ignore cleanup on component unmount

## Error Handling

### Do
- Use try/catch blocks for canvas operations
- Check for null/undefined before accessing properties
- Handle canvas initialization failures gracefully
- Provide meaningful error messages

```typescript
// Good practice
try {
  if (!fabricCanvasRef.current) {
    throw new Error("Canvas not initialized");
  }
  
  fabricCanvasRef.current.add(new Line([0, 0, 100, 100]));
  fabricCanvasRef.current.requestRenderAll();
} catch (error) {
  console.error("Failed to add line to canvas:", error);
  // Handle error appropriately
}
```

### Don't
- Assume canvas operations always succeed
- Ignore potential errors in initialization
- Leave the application in inconsistent state after errors

## Type Safety

### Do
- Use proper TypeScript types for Fabric objects
- Create interfaces for custom object properties
- Use type guards for event handling
- Follow the type definitions in the documentation

```typescript
// Good practice
interface CustomRectOptions extends FabricObjectOptions {
  customProperty?: string;
}

const createCustomRect = (options: CustomRectOptions): Rect => {
  return new Rect({
    ...options,
    objectType: 'custom-rect'
  });
};
```

### Don't
- Use any type for Fabric.js objects
- Ignore TypeScript errors with type assertions
- Create inconsistent types across the application

## Testing

### Do
- Mock Fabric.js canvas for unit tests
- Test event handlers in isolation
- Verify canvas state after operations
- Write integration tests for critical user journeys

```typescript
// Good practice for testing
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      requestRenderAll: vi.fn()
    })),
    // Other Fabric classes
  };
});
```

### Don't
- Test with actual canvas rendering
- Rely on visual verification for unit tests
- Skip testing event handlers

## Debugging

### Do
- Add descriptive object names
- Use the Fabric object inspector
- Log canvas state at critical points
- Add visual debugging helpers when needed
- Use the GridDebugOverlay for grid-related issues

```typescript
// Good practice
const debugObject = new Rect({
  // ... properties
  name: 'DebugRect-1', // Helpful for debugging
  data: { createdAt: new Date(), purpose: 'debug' } // Custom debug data
});

// For grid debugging
window.diagnoseGrid(); // Provides detailed grid information
```

### Don't
- Use console.log for entire objects (they're circular)
- Leave debugging code in production
- Ignore Fabric.js warnings
- Forget to clean up debugging objects

By following these best practices, we can ensure a robust and maintainable canvas drawing implementation.

## Grid Implementation

### Do
- Use the grid utility functions for all grid operations
- Set proper z-index for grid elements to keep them behind other objects
- Make grid objects non-selectable and non-interactive
- Use the GRID_CONSTANTS for all grid-related values
- Add proper error handling around grid operations

```typescript
// Good practice
try {
  // Create grid using proper utilities
  const gridObjects = createCompleteGrid(canvas);
  
  // Set proper properties on all grid objects
  gridObjects.forEach(obj => {
    obj.set({
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    canvas.sendObjectToBack(obj);
  });
  
  // Use proper visibility management
  setGridVisibility(canvas, true);
} catch (error) {
  logger.error("Error creating grid:", error);
  // Implement fallback or retry mechanism
}
```

### Don't
- Directly modify grid objects after creation
- Mix grid objects with regular drawing objects
- Hardcode grid values that exist in GRID_CONSTANTS
- Forget to add error handling around grid operations

```typescript
// Bad practice
const gridSize = 10; // Hardcoded instead of using GRID_CONSTANTS
for (let i = 0; i < canvas.width; i += gridSize) {
  const line = new Line([i, 0, i, canvas.height]);
  line.stroke = '#ccc'; // Hardcoded color
  line.selectable = false;
  canvas.add(line);
}
```

## Drawing Tools Integration

### Do
- Separate tool state from tool event handling
- Clean up all event handlers when tools change
- Use proper refs for values that shouldn't trigger re-renders
- Implement proper error handling in drawing operations

```typescript
// Good practice
// State management hook
const useToolState = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef(null);
  // other state...
  
  return {
    isDrawing,
    setIsDrawing,
    startPointRef,
    // other state and setters...
  };
};

// Event handling hook
const useToolEvents = (fabricCanvas, toolState) => {
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleMouseDown = (opt) => {
      // implementation
    };
    
    fabricCanvas.on('mouse:down', handleMouseDown);
    
    // Clean up event handlers
    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
    };
  }, [fabricCanvas, toolState]);
};
```

### Don't
- Mix state management with event handling
- Forget to clean up event handlers
- Use the same logic for different drawing tools
- Ignore error handling in drawing operations

```typescript
// Bad practice
useEffect(() => {
  if (!canvas) return;
  
  // Mixed state and event handling
  const handleMouseDown = (opt) => {
    setIsDrawing(true);
    // More mixed logic...
  };
  
  canvas.on('mouse:down', handleMouseDown);
  // Missing cleanup function
}, [canvas]);
```

## Measurement Tooltips

### Do
- Create tooltips only when needed
- Position tooltips properly relative to drawing objects
- Clean up tooltips when operations complete
- Make tooltips non-selectable and non-interactive

```typescript
// Good practice
const createDistanceTooltip = (points, distance) => {
  const tooltip = new Text(`${distance.toFixed(2)}m`, {
    left: (points[0].x + points[1].x) / 2,
    top: (points[0].y + points[1].y) / 2,
    fontSize: 14,
    fill: '#333',
    backgroundColor: 'rgba(255,255,255,0.7)',
    selectable: false,
    evented: false
  });
  
  return tooltip;
};

// Clean up when done
const cleanup = () => {
  if (tooltipRef.current) {
    canvas.remove(tooltipRef.current);
    tooltipRef.current = null;
  }
};
```

### Don't
- Leave tooltips on the canvas after operations
- Create tooltips without proper positioning
- Make tooltips selectable or interactive
- Forget to update tooltips when measurements change

```typescript
// Bad practice
const tooltip = new Text(`${distance}m`);
canvas.add(tooltip); // No positioning, no cleanup
```
