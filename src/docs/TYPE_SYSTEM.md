# Canvas Drawing Type System

This document provides an in-depth overview of the TypeScript type system used in our canvas drawing implementation. Understanding these types is crucial for maintaining code quality and preventing runtime errors.

## Core Type Hierarchies

### Canvas Types

```typescript
// HTML Canvas Element Extension
interface HTMLCanvasElement {
  _fabric?: FabricCanvas; // Internal Fabric.js reference
}

// Canvas References - Central point for canvas access
interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvas?: FabricCanvas | null;
}
```

### Event Types

```typescript
// Base Pointer Event Interface
interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  absolutePointer?: { x: number; y: number };
  // Additional properties for Fabric v6 compatibility
  scenePoint?: { x: number; y: number };
  viewportPoint?: { x: number; y: number };
}

// Specific Event Types
interface FabricMouseDownEvent extends FabricPointerEvent {}
interface FabricMouseMoveEvent extends FabricPointerEvent {}
interface FabricMouseUpEvent extends FabricPointerEvent {}
```

### Geometric Types

```typescript
// Point Interface
interface Point {
  x: number;
  y: number;
}

// Line Interface
interface Line {
  start: Point;
  end: Point;
}
```

## Type Guards

We use type guards extensively to ensure type safety when working with different kinds of events:

```typescript
// Type guard for touch events
function isTouchEvent(value: unknown): value is TouchEvent {
  return typeof value === 'object' && 
         value !== null && 
         'touches' in value &&
         'changedTouches' in value;
}

// Type guard for mouse events
function isMouseEvent(value: unknown): value is MouseEvent {
  return typeof value === 'object' && 
         value !== null && 
         'clientX' in value &&
         'clientY' in value &&
         !('touches' in value);
}
```

## Enum Types

Enums are used to provide type-safe constants:

```typescript
// Event Type Enum
enum FabricEventTypes {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  // ... other event types
}

// Drawing Tool Enum
enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  STRAIGHT_LINE = 'straight-line',
  // ... other tool types
}
```

## Advanced Typing Techniques

### Discriminated Unions

Used to handle different event types with type safety:

```typescript
type FabricEvent = 
  | { type: 'mouse:down'; e: MouseEvent; pointer: Point }
  | { type: 'mouse:move'; e: MouseEvent; pointer: Point }
  | { type: 'touch:down'; e: TouchEvent; pointer: Point }
  | { type: 'touch:move'; e: TouchEvent; pointer: Point };

// Type-safe handling
function handleEvent(event: FabricEvent) {
  switch (event.type) {
    case 'mouse:down':
      // TypeScript knows event.e is MouseEvent here
      break;
    case 'touch:down':
      // TypeScript knows event.e is TouchEvent here
      break;
  }
}
```

### Mapped Types

Used for configuration objects:

```typescript
type ToolConfig<T extends DrawingMode> = {
  [K in DrawingMode]: {
    cursor: string;
    isDrawingMode: boolean;
  }
};

const toolConfigs: ToolConfig<DrawingMode> = {
  [DrawingMode.SELECT]: { cursor: 'default', isDrawingMode: false },
  [DrawingMode.DRAW]: { cursor: 'crosshair', isDrawingMode: true },
  // ... other configurations
};
```

### Conditional Types

Used for tool-specific state types:

```typescript
type ToolState<T extends DrawingMode> = 
  T extends DrawingMode.STRAIGHT_LINE 
    ? LineToolState 
    : T extends DrawingMode.RECTANGLE 
      ? RectangleToolState 
      : BaseToolState;

function getToolState<T extends DrawingMode>(
  tool: T
): ToolState<T> {
  // Implementation returns correct state type based on tool
}
```

## Type Safety Best Practices

1. **Never use `any`**: Always define proper types or use `unknown` when type is uncertain.
2. **Use type guards**: Always verify types before using them.
3. **Enable strict TypeScript checks**: We use strict null checks and other stricter TypeScript options.
4. **Define exhaustive interfaces**: Ensure interfaces have all required properties.
5. **Use readonly where appropriate**: Mark properties that shouldn't change as readonly.
6. **Use type assertions sparingly**: Only use type assertions when you're confident about the type.

## Using Fabric.js Types

Fabric.js provides its own type definitions that we extend and refine:

```typescript
import { Canvas as FabricCanvas, Object as FabricObject, Point as FabricPoint } from 'fabric';

// Convert our Point type to Fabric Point
function toFabricPoint(point: Point): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

// Convert Fabric Point to our Point type
function fromFabricPoint(point: FabricPoint): Point {
  return { x: point.x, y: point.y };
}
```

## Type Safety Enforcement via ESLint

We enforce type safety through custom ESLint rules:

1. **No unsafe member access**: Prevents accessing properties that might not exist.
2. **No unnecessary non-null assertions**: Prevents assuming values are non-null without checking.
3. **Prefer optional chaining**: Encourages safe property access.
4. **Explicit function return types**: Ensures all functions have clear return types.
5. **Consistent type definitions**: Ensures consistent naming and structure of types.

## Common Type Pitfalls

1. **Fabric.js DOM event vs. Fabric event**: Always use the correct event type.
2. **Point type conflicts**: Be careful with Fabric's Point type vs. our own Point interface.
3. **Null canvas references**: Always check if canvas references are not null before using them.
4. **Event handler cleanup**: Properly type cleanup functions to prevent memory leaks.
5. **Async event handlers**: Be careful with async event handlers and ensure proper typing.

## Type Evolution Guidelines

As the codebase evolves, follow these guidelines for type changes:

1. **Backward compatibility**: Ensure type changes don't break existing code.
2. **Documentation**: Update this document when significant type changes are made.
3. **Gradual migration**: When changing fundamental types, provide migration paths.
4. **Test coverage**: Ensure type changes are covered by unit tests.
5. **Performance impact**: Consider the runtime impact of complex type constructs.
