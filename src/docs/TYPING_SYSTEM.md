
# Typing System Documentation

This document provides a comprehensive guide to the typing system used throughout the application.

## Core Principles

Our application follows these typing principles:

1. **Single Source of Truth**: Each type has a canonical definition in one location
2. **Type Re-export**: Types are re-exported through barrel files for easier imports
3. **Documentation First**: All types include JSDoc comments for better IDE integration
4. **Type Safety**: Use of strict type checking to catch errors at compile time
5. **No Any**: Avoid using `any` types whenever possible

## Type Hierarchy

### Core Types

Located in `src/types/core/`:

- `Geometry.ts`: Fundamental geometric types (Point, Line, Polygon, etc.)
- `DrawingTool.ts`: Drawing tool type definitions
- `PerformanceStats.ts`: Performance tracking type definitions

### Domain-Specific Types

Located in appropriate domain directories:

- `src/types/floor-plan/`: Floor plan specific types
- `src/types/security/`: Security-related types
- `src/types/canvas/`: Canvas and rendering types

## Type Import Best Practices

### Recommended Import Patterns

```typescript
// Import from the canonical source
import { Point, Rectangle } from '@/types/core/Geometry';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

// Import from barrel files for convenience
import { AuditLogEntry, SecurityConfig } from '@/types/security';
```

### Avoiding Import Errors

1. **Use Type Imports** for types that might cause circular dependencies:
   ```typescript
   import type { FloorPlan } from '@/types/floorPlanTypes';
   ```

2. **Use Consistent Paths** for imports:
   ```typescript
   // Correct
   import { Point } from '@/types/core/Geometry';
   
   // Avoid
   import { Point } from '../../types/core/Geometry';
   ```

## DrawingTool and DrawingMode

One of the most common sources of confusion is the relationship between `DrawingTool` and `DrawingMode`:

- `DrawingMode` is defined as an enum in `@/constants/drawingModes.ts`
- `DrawingTool` is defined as a type alias to `DrawingMode` in `@/types/core/DrawingTool.ts`

```typescript
// Correct usage:
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

function setTool(tool: DrawingTool): void {
  if (tool === DrawingMode.SELECT) {
    // ...
  }
}
```

## Type Guards

Use type guards to safely narrow types:

```typescript
function isPoint(value: unknown): value is Point {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof (value as Point).x === 'number' &&
    typeof (value as Point).y === 'number'
  );
}

// Usage
if (isPoint(someValue)) {
  // TypeScript now knows someValue is a Point
  console.log(someValue.x, someValue.y);
}
```

## Security Types

Security types are particularly critical and follow a strict organization:

1. **Base Types**: Defined in `src/types/securityTypes.ts`
2. **Specialized Types**: Defined in `src/types/security/*.ts`
3. **Re-exports**: All types are re-exported through `src/types/security/index.ts`

## Performance Considerations

When working with large geometric datasets, consider using:

1. **Read-only Types**: Use `readonly` modifiers for arrays and properties that shouldn't change
2. **Immutable Data**: Create new objects instead of mutating existing ones
3. **Optimized Type Checks**: Use type assertions sparingly and only when absolutely necessary

## Extending the Type System

When adding new types:

1. Identify the appropriate location based on domain
2. Create a new file with a descriptive name
3. Add comprehensive JSDoc comments
4. Export the type through the appropriate barrel file
5. Add any necessary utility functions or type guards

## Common Type Errors and Solutions

### "Type X is not assignable to type Y"

This often occurs with `DrawingMode` and `DrawingTool`. Ensure you're importing from the canonical source:

```typescript
// Correct
import { DrawingMode } from '@/constants/drawingModes';

// Incorrect
import { DrawingMode } from '@/types/FloorPlan';
```

### "Property X does not exist on type Y"

Ensure you're using the correct type and that the property exists:

```typescript
// Check the type definition
interface Point {
  x: number;
  y: number;
  // z is not defined
}

const point: Point = { x: 1, y: 2 };
console.log(point.z); // Error: Property 'z' does not exist on type 'Point'
```

### "Cannot find module X"

Ensure the path is correct and the file exists:

```typescript
// Correct
import { Point } from '@/types/core/Geometry';

// Incorrect
import { Point } from '@/types/core/geometry'; // Wrong case
```
