
# Type Consistency Guide

This guide provides best practices for maintaining type consistency across the application, especially for commonly used types like DrawingMode, FloorPlan, and Point.

## Common Type Mismatches and How to Prevent Them

### Multiple Definition Problem

**Problem**: We have multiple definitions of the same concept (e.g., different DrawingMode enums in different files).

**Solution**:
- Maintain a single source of truth for each type
- Use type aliases rather than duplicate definitions
- Export and import types from canonical locations

### Example:

```typescript
// CORRECT
import { DrawingMode } from '@/constants/drawingModes';
import type { FloorPlan } from '@/types/floorPlanTypes';

// INCORRECT
// Don't define your own versions of these types!
enum LocalDrawingMode { /* ... */ }
interface MyFloorPlan { /* ... */ }
```

## Canonical Sources for Common Types

Always import these types from their canonical sources:

| Type | Import From |
|------|------------|
| DrawingMode | `@/constants/drawingModes` |
| DrawingTool | `@/types/core/DrawingTool` |
| FloorPlan | `@/types/floorPlanTypes` |
| Point | `@/types/floorPlanTypes` |
| Canvas | `fabric` (as `FabricCanvas` for clarity) |

## Type Conversion Utilities

Use the utilities in `@/utils/floorPlanAdapter` for safe conversions:

```typescript
import { adaptFloorPlan, normalizeDrawingMode } from '@/utils/floorPlanAdapter';

// Convert API floor plan to application format
const floorPlan = adaptFloorPlan(apiData);

// Normalize a drawing mode (handles strings and enum values)
const mode = normalizeDrawingMode(inputMode);
```

## Type Guards for Runtime Safety

Create and use type guards for runtime type checking:

```typescript
function isFloorPlan(obj: any): obj is FloorPlan {
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'strokes' in obj
  );
}

// Usage
if (isFloorPlan(data)) {
  // TypeScript now knows data is a FloorPlan
  console.log(data.strokes.length);
}
```

## Best Practices for Avoiding Type Errors

1. **Use Explicit Return Types**
   ```typescript
   // Good
   function getSelectedTool(): DrawingMode {
     return DrawingMode.SELECT;
   }
   
   // Avoid
   function getSelectedTool() {
     return DrawingMode.SELECT;
   }
   ```

2. **Validate External Data**
   ```typescript
   import { validateFloorPlan } from '@/utils/floorPlanAdapter';
   
   function processFloorPlan(data: unknown) {
     if (!validateFloorPlan(data)) {
       throw new Error('Invalid floor plan data');
     }
     
     // Now safe to use as FloorPlan
     const floorPlan = data as FloorPlan;
   }
   ```

3. **Use Type Intersections Instead of Partial Types**
   ```typescript
   // Better than Partial<FloorPlan>
   type FloorPlanUpdate = Pick<FloorPlan, 'id'> & Partial<Omit<FloorPlan, 'id'>>;
   ```

4. **Add JSDoc Comments for Complex Types**
   ```typescript
   /**
    * Options for the floor plan editor
    * @property {boolean} readOnly - Whether the editor is in read-only mode
    * @property {DrawingMode} defaultTool - Default selected tool
    */
   interface EditorOptions {
     readOnly: boolean;
     defaultTool: DrawingMode;
   }
   ```

## Code Review Checklist for Type Consistency

When reviewing code, check for:

- [x] Are types imported from their canonical sources?
- [x] Are function return types explicitly declared?
- [x] Are type guards used for runtime type checking?
- [x] Are conversion utilities used for external data?
- [x] Is the DrawingMode enum used consistently?
- [x] Are there any unnecessary type assertions (`as` keyword)?

## ESLint Rules to Enforce Type Consistency

The codebase has custom ESLint rules to enforce these patterns:

```javascript
// .eslintrc.js
{
  rules: {
    "drawing-tools/consistent-imports": "error",
    "drawing-tools/no-string-literals": "error",
    "drawing-tools/consistent-typing": "error",
    "drawing-tools/typed-hooks": "error"
  }
}
```
