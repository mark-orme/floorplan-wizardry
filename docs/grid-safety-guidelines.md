
# Grid System Design Guidelines

This document outlines best practices for working with the grid system to ensure type safety and prevent common errors.

## Constant Usage Guidelines

### Grid Spacing Constants

When accessing grid spacing constants, always use the proper structure:

```typescript
// ✅ Correct usage
import { GRID_SPACING } from '@/constants/numerics';

// Usage
const smallGrid = GRID_SPACING.SMALL;
const largeGrid = GRID_SPACING.LARGE;
const defaultGrid = GRID_SPACING.DEFAULT;
```

```typescript
// ❌ Incorrect usage - may cause type errors
import { SMALL_GRID, LARGE_GRID } from '@/constants/numerics';

// Wrong - SMALL_GRID is primitive, not an object
const smallGrid = SMALL_GRID.SMALL;
```

### Numeric Constants

Always import specific constants directly, and check that they exist in the source file:

```typescript
// ✅ Correct imports
import { 
  PIXELS_PER_METER,
  AREA_PRECISION,
  SNAP_THRESHOLD,
  STANDARD_ANGLES,
  ANGLE_SNAP_THRESHOLD
} from '@/constants/numerics';
```

### Grid Props Usage

For grid properties with specific attributes, use the proper structure:

```typescript
// ✅ Correct usage
import { SMALL_GRID_PROPS, LARGE_GRID_PROPS } from '@/constants/numerics';

// Usage
const smallGridDefault = SMALL_GRID_PROPS.DEFAULT;
const largeGridDefault = LARGE_GRID_PROPS.DEFAULT;
```

## Type Safety Guidelines

### Function Parameters

Use explicit typing for all grid-related function parameters:

```typescript
// ✅ Correct function parameter typing
function createGrid(canvas: FabricCanvas, smallSpacing: number = GRID_SPACING.SMALL) {
  // Implementation
}
```

### Error Objects

When capturing errors for logging or monitoring, use proper typing:

```typescript
// ✅ Correct error capture
try {
  // Grid operations
} catch (error: unknown) {
  // For Sentry
  captureError(error, 'grid-creation');
  
  // For logging
  console.error('Grid creation failed:', error instanceof Error ? error.message : String(error));
}
```

### Test Mocks

When creating mock objects for tests:

```typescript
// ✅ Correct test mock creation
const mockCanvas = createTypedMockCanvas();

// Add custom methods only after proper casting
(mockCanvas as any).customMethod = jest.fn();
```

## Ensuring Compatibility

### Check Before Accessing

Always check that objects exist before accessing their properties:

```typescript
// ✅ Correct property access
if (canvas && canvas.freeDrawingBrush) {
  canvas.freeDrawingBrush.color = lineColor;
}
```

### Use Optional Chaining

Use optional chaining for potentially undefined properties:

```typescript
// ✅ Correct usage of optional chaining
canvas?.freeDrawingBrush?.color = lineColor;
```

## Best Practices for Updates

1. When adding new constants to `numerics.ts`, update the ESLint rules to include them
2. Document all constants with JSDoc comments
3. Use proper naming conventions (UPPER_SNAKE_CASE for constants)
4. Group related constants together in the file
5. Consider using objects with properties instead of primitive values for related constants
6. Add backward compatibility exports when refactoring

## Common Issues and Resolutions

1. **Property 'SMALL' does not exist on type '20'**
   - Resolution: Use `GRID_SPACING.SMALL` instead of accessing properties on primitive values

2. **Module has no exported member 'X'**
   - Resolution: Check the source file to ensure the constant is properly exported

3. **Spread types may only be created from object types**
   - Resolution: Use proper typing for object spreads, and avoid spreading non-object types

4. **Type 'X' is not assignable to parameter of type 'string'**
   - Resolution: Use proper type assertions or ensure function arguments match parameter types
