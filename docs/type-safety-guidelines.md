
# Type Safety Guidelines

## Common Type Safety Issues and How to Prevent Them

This document provides guidelines for preventing the most common type-related errors in our codebase.

### Point Type Confusion

We use two different `Point` types in our application:

1. Our application `Point` type from `@/types/core/Point` - a simple interface with `x` and `y` properties
2. Fabric.js `Point` class from the `fabric` library - a full class with methods

**Best Practices:**

- Import Fabric's Point as `FabricPoint` to avoid confusion:
  ```typescript
  import { Point as FabricPoint } from 'fabric';
  import type { Point } from '@/types/core/Point';
  ```

- Use the conversion utilities for moving between these types:
  ```typescript
  import { toFabricPoint, toAppPoint } from '@/utils/fabricPointConverter';
  
  // Convert app Point to FabricPoint
  const fabricPoint = toFabricPoint(myAppPoint);
  
  // Convert FabricPoint to app Point
  const appPoint = toAppPoint(myFabricPoint);
  ```

### Working with Floor Plans

Floor plans have a specific structure with `strokes` rather than `objects`:

**Best Practices:**

- Always check floor plan properties before accessing them:
  ```typescript
  if (floorPlan.strokes && Array.isArray(floorPlan.strokes)) {
    // Now it's safe to work with floorPlan.strokes
  }
  ```

- Use type guards for safe property access:
  ```typescript
  function hasStrokes(plan: any): plan is { strokes: any[] } {
    return plan && Array.isArray(plan.strokes);
  }
  
  if (hasStrokes(floorPlan)) {
    // TypeScript now knows floorPlan.strokes exists and is an array
  }
  ```

### Module Import Issues

Missing exports or incorrect imports can lead to runtime errors:

**Best Practices:**

- Always check that imported interfaces exist in their modules
- Prefer explicit imports over namespace imports
- Use barrel files (index.ts) for organizing exports
- Use path aliases (@/) consistently

### Function Arguments

Always provide all required arguments to functions:

**Best Practices:**

- Create parameter interfaces to make requirements explicit:
  ```typescript
  interface DrawFloorPlanParams {
    canvas: FabricCanvas;
    floorPlan: FloorPlan;
    options?: DrawOptions;
  }
  
  function drawFloorPlan({ canvas, floorPlan, options = {} }: DrawFloorPlanParams) {
    // Implementation that uses all parameters
  }
  ```

- Use object destructuring with defaults for optional parameters:
  ```typescript
  function calculateArea({ width = 0, height = 0 } = {}) {
    return width * height;
  }
  ```

- Provide meaningful TypeScript errors with function overloads when needed

### Type Guards

Use type guards to safely narrow types:

**Best Practices:**

- Create custom type guards for complex types:
  ```typescript
  function isFloorPlan(obj: any): obj is FloorPlan {
    return obj && 
      typeof obj === 'object' &&
      typeof obj.id === 'string' &&
      Array.isArray(obj.strokes);
  }
  ```

- Use built-in type guards for primitives and arrays:
  ```typescript
  if (typeof value === 'string') { /* string operations */ }
  if (Array.isArray(collection)) { /* array operations */ }
  ```

### Handling Null and Undefined

Be defensive when accessing properties that might not exist:

**Best Practices:**

- Use optional chaining:
  ```typescript
  const strokeCount = floorPlan?.strokes?.length ?? 0;
  ```

- Check existence before operations:
  ```typescript
  if (floorPlan && floorPlan.strokes) {
    // Safe to use
  }
  ```

- Provide fallbacks with nullish coalescing:
  ```typescript
  const color = stroke?.color ?? '#000000';
  ```

## Pre-commit Hooks

Our pre-commit hooks check for these issues before allowing commits. If you're seeing type errors:

1. Run `npm run lint` to check for issues
2. Address each TypeScript error before committing
3. Use `// @ts-expect-error` with explanatory comments for rare cases where the TypeScript compiler is wrong

## Testing for Type Safety

Consider adding tests that verify type compatibility:

```typescript
// This should compile without errors
const point: Point = { x: 10, y: 20 };
const fabricPoint = toFabricPoint(point);
const convertedBack = toAppPoint(fabricPoint);
expect(convertedBack.x).toBe(point.x);
expect(convertedBack.y).toBe(point.y);
```
