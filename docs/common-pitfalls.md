
# Common Pitfalls and Solutions

## Canvas Initialization

**Issue**: Canvas fails to initialize properly or is initialized multiple times.

**Solution**:
- Ensure proper order of operations (canvas → grid → objects)
- Use useEffect cleanup functions to prevent memory leaks
- Implement canvas existence checks before operations

```typescript
// Proper canvas initialization
useEffect(() => {
  // Create canvas only once
  if (!canvasRef.current && containerRef.current) {
    const canvas = new fabric.Canvas(containerRef.current);
    canvasRef.current = canvas;
    
    // Initialize grid after canvas
    createGrid(canvas);
  }
  
  // Clean up on unmount
  return () => {
    if (canvasRef.current) {
      canvasRef.current.dispose();
      canvasRef.current = null;
    }
  };
}, []);
```

## Grid Management

**Issue**: Grid fails to render or disappears unexpectedly.

**Solution**:
- Handle race conditions during creation
- Implement retry mechanisms for grid failures
- Use proper state tracking for grid creation
- Ensure grid objects are properly added to canvas

## Coordinate Systems

**Issue**: Coordinates are misaligned or transformations don't work correctly.

**Solution**:
- Be aware of multiple coordinate systems (screen, canvas, grid)
- Use appropriate transformation utilities
- Document coordinate assumptions in functions
- Implement proper zoom and pan handling

## Touch and Mouse Events

**Issue**: Event handling is inconsistent across devices.

**Solution**:
- Normalize events across different input methods
- Handle touch, mouse, and stylus inputs correctly
- Implement proper gesture recognition
- Test on multiple devices and input methods

## Memory Leaks

**Issue**: Performance degrades over time due to memory leaks.

**Solution**:
- Clean up event listeners in useEffect return functions
- Properly dispose of fabric.js objects when removing them
- Clear references to removed objects
- Use the React profiler to identify memory issues
