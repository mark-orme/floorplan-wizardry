
# Types

This directory contains TypeScript type definitions used throughout the application.

## Structure

- **core/**: Core type definitions for the application
- **hooks/**: Types related to custom React hooks
- **canvas/**: Type definitions for canvas and drawing operations
- **input/**: Types for input handling (mouse, touch, stylus)

## Key Types

### Point

```typescript
interface Point {
  x: number;
  y: number;
}
```

### MeasurementData

```typescript
interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped?: boolean;
  unit: string;
}
```

### InputMethod

```typescript
enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil'
}
```

### LineState

```typescript
interface LineState {
  isDrawing: boolean;
  isActive: boolean;
  isToolInitialized: boolean;
  inputMethod: string;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  currentLine: any | null;
}
```

## Usage Guidelines

Types should:
1. Be properly named following TypeScript conventions
2. Be well-documented with JSDoc comments
3. Be exported through the appropriate barrel files
4. Use descriptive names and follow consistent conventions

When creating new types:
- Group related types in appropriate subdirectories
- Use interfaces for object shapes that will be implemented
- Use type aliases for unions, intersections, and complex types
- Consider using utility types (Partial, Omit, etc.) when appropriate

## Examples

```typescript
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/hooks/straightLineTool/types';
import { InputMethod } from '@/hooks/straightLineTool/useStraightLineTool';
```

## Type Safety Best Practices

1. **No `any` Types**: Avoid using `any` whenever possible
2. **Explicit Return Types**: Always specify return types for functions
3. **Union Types**: Use union types for variables that can have multiple types
4. **Optional Properties**: Use optional properties (?) instead of allowing undefined
5. **Type Guards**: Implement proper type guards for narrowing types
