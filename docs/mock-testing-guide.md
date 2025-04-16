
# Mock Testing Guide

This guide provides best practices for creating and using mocks in tests, with a focus on type safety and preventing common errors.

## Canvas Mocking Best Practices

### Use Helper Functions

Always use the provided helper functions for creating typed mocks:

```typescript
// CORRECT: Use the helper function
const mockCanvas = createTypedMockCanvas();

// INCORRECT: Don't cast directly
const mockCanvas = { ... } as Canvas;
```

### Complete Mock Objects

When mocking hooks or complex objects, ensure all required properties are present:

```typescript
// CORRECT: Include all required properties
vi.mocked(useLineState).mockReturnValue({
  isDrawing: false,
  isActive: false,
  startPoint: null,
  currentPoint: null,
  currentLine: null,
  distanceTooltip: null,  // Don't forget properties like this!
  fabricCanvasRef: { current: null },
  lineColor: '#000000',
  lineThickness: 2,
  inputMethod: InputMethod.MOUSE,
  isPencilMode: false,
  snapEnabled: true,
  anglesEnabled: false,
  initializeTool: vi.fn(),
  resetDrawingState: vi.fn(),
  toggleSnap: vi.fn(),
  toggleAngles: vi.fn(),
  createLine: vi.fn(),
  createDistanceTooltip: vi.fn(),
  setInputMethod: vi.fn(),
  setIsPencilMode: vi.fn(),
  startDrawing: vi.fn(),  // Required method
  continueDrawing: vi.fn(),  // Required method
  completeDrawing: vi.fn(),  // Required method
  cancelDrawing: vi.fn()  // Required method
});
```

### Type-Safe Parameters

Pass parameters as objects with proper type checking:

```typescript
// CORRECT: Use object parameter with createMockFunctionParams utility
const { result } = renderHook(() => useLineState(
  createMockFunctionParams({
    fabricCanvasRef: { current: mockCanvas },
    lineColor: '#000000',
    lineThickness: 2,
    saveCurrentState: mockSaveCurrentState
  })
));

// INCORRECT: Don't pass parameters directly
const { result } = renderHook(() => useLineState(
  { current: mockCanvas },
  '#000000',
  2,
  mockSaveCurrentState
));
```

### Use Point Utilities

Always use provided utilities for creating Point objects:

```typescript
// CORRECT: Use the point creation utility
result.current.startDrawing(createTestPoint(100, 100));

// INCORRECT: Don't create point objects inline
result.current.startDrawing({ x: 100, y: 100 });
```

## ESLint Rules

We've added ESLint rules to help catch common issues:

1. **hook-mock-validation**: Ensures mocks of hooks include all required properties
2. **test-mock-validation**: Validates proper use of mock objects in tests
3. **line-tool-validation**: Ensures proper use of line tool hooks and utilities

Run ESLint checks regularly to catch issues early:

```bash
npm run lint
```

## Common Pitfalls to Avoid

1. **Incomplete Mocks**: Missing properties or methods in mocked objects
2. **Incorrect Parameter Types**: Passing incorrect types to functions or hooks
3. **Direct Type Casting**: Using `as Canvas` instead of helper functions
4. **Missing Parameter Properties**: Not providing all required properties to hooks
5. **Incompatible Mock Objects**: Creating mocks that don't match the real implementation

## Debugging Test Type Errors

When you encounter type errors in tests:

1. **Check Return Types**: Ensure mocked functions return the correct types
2. **Verify Parameters**: Make sure parameters match the expected types
3. **Use Type Guards**: Implement proper type guards for complex objects
4. **Use Helper Functions**: Leverage the provided helper functions for creating mocks
5. **Review Interface Changes**: Check if the implementation has changed and update mocks accordingly

## Best Practices for Test Maintenance

1. **Keep Test Files Short**: Split large test files into smaller, focused ones
2. **Update Tests First**: When changing interfaces, update tests first to catch issues
3. **Create Mock Factories**: Implement factory functions for frequently used mocks
4. **Document Assumptions**: Add comments explaining mock implementation details
5. **Use Consistent Patterns**: Follow the same mocking patterns across the codebase

By following these guidelines, we can ensure our tests remain type-safe and reliable as the codebase evolves.
