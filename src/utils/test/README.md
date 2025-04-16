# Canvas Testing Utilities

This directory contains utilities for testing canvas-related functionality.

## Mock Canvas Creation

Always use the proper factory methods to create typed mock canvas objects:

```typescript
import { createTypedMockCanvas } from '@/utils/test/createMockCanvas';

describe('My Canvas Test', () => {
  let mockCanvas: Canvas;
  
  beforeEach(() => {
    // Always use the factory method for properly typed mocks
    mockCanvas = createTypedMockCanvas();
  });
  
  it('should handle canvas interactions', () => {
    // Use the created canvas in tests
    const { result } = renderHook(() => useMyCanvasHook({
      canvas: mockCanvas,
      // other props...
    }));
    
    // Test your hook or component...
  });
});
```

## Typing Rules

1. Never use direct type assertions like `as Canvas`. Instead, use the provided helper functions:
   - `asMockCanvas(mockCanvas)` for Canvas objects
   - `asMockObject(mockObject)` for Fabric.js objects

2. Ensure complete mocks by using the factory methods:
   - `createTypedMockCanvas()` - Creates a complete mock canvas
   - `createTypedMockObject(type, props)` - Creates a mock Fabric.js object

## Event Handling in Tests

The mock canvas created with `createTypedMockCanvas()` includes special helpers for testing events:

```typescript
const mouseDownHandler = mockCanvas.getHandlers(FabricEventNames.MOUSE_DOWN)[0];
expect(mouseDownHandler).toBeDefined();

// Simulate an event
mockCanvas.triggerEvent(FabricEventNames.MOUSE_DOWN, { 
  pointer: { x: 100, y: 100 } 
});
```

## Best Practices

1. Reset mocks between tests in `beforeEach`
2. Use the `IMockCanvas` and `IMockObject` interfaces for type checking
3. Always provide complete mock objects with all required properties
4. Test both success and error cases
5. Mock dependencies consistently

## ESLint Rules

The project includes ESLint rules to enforce proper canvas mocking. Common errors:

- Using `as Canvas` directly instead of `asMockCanvas()`
- Missing required properties in mocks
- Creating incomplete mock objects
- Using real Canvas instances in tests

Fix these by using the proper factory methods and helper functions.
