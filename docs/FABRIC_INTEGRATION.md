
# Fabric.js Integration Guide

This document outlines best practices for integrating Fabric.js with React and TypeScript in our application.

## Common Type Issues and How to Avoid Them

### 1. Line Constructor

The Fabric.js `Line` constructor requires exactly 4 numbers as its first argument, representing the start and end points:

```typescript
// CORRECT:
const line = new Line([x1, y1, x2, y2], options);

// INCORRECT - will cause TypeScript errors:
const line = new Line([], options);
```

### 2. Point Objects

Fabric.js `Point` objects are not directly compatible with our simple `Point` interface. 
When using Fabric.js methods that expect a Fabric Point, make sure to convert:

```typescript
// Our Point interface
interface Point {
  x: number;
  y: number;
}

// Converting our Point to Fabric.js Point
const ourPoint: Point = { x: 100, y: 200 };
const fabricPoint = new fabric.Point(ourPoint.x, ourPoint.y);
```

### 3. Touch Events

When storing touch information, don't mix Touch objects with Point objects:

```typescript
// INCORRECT - Touch objects have specific properties
const touchRecords: Touch[] = [myPoint]; // Error!

// CORRECT - Create a proper interface
interface TouchRecord {
  originalEvent: TouchEvent;
  identifier: number;
  position: Point;
  clientX: number;
  clientY: number;
}
```

### 4. Event Handlers

Always cast event objects properly when passing them to Fabric.js:

```typescript
// Use 'as any' only when absolutely necessary for Fabric.js compatibility
canvas.fire(FabricEventTypes.MOUSE_DOWN, eventInfo as any);
```

## Best Practices

1. **Testing**: When writing tests, ensure mock objects match the expected interfaces
2. **Type Guards**: Use type guards to validate objects before using them
3. **Immutability**: Treat Fabric.js objects as immutable whenever possible
4. **ESLint Rules**: Use our custom ESLint rules to catch common errors
5. **Documentation**: Document any non-obvious type conversions

## File Organization

- `/types/fabric.d.ts` - Core Fabric.js type definitions
- `/types/fabric-events.d.ts` - Event type definitions
- `/utils/fabric/` - Utility functions for Fabric.js
- `/hooks/straightLineTool/` - Custom hooks for the straight line drawing tool

## Common Pitfalls

1. Canvas initialization: Never initialize a canvas twice
2. Event handling: Always clean up event listeners in useEffect returns
3. Type narrowing: Use proper type guards instead of type assertions
4. Object disposal: Always dispose of canvas objects when unmounting
5. Touch events: Pay special attention to TouchEvent vs. Touch objects vs. simple coordinates

## Custom Types for Fabric.js Integration

### For Touch Events
```typescript
// Safe touch record with required properties
interface TouchRecord {
  identifier: number;
  clientX: number;
  clientY: number;
  position: Point;
  originalEvent?: TouchEvent;
}
```

### For Point Conversion
```typescript
// Convert our Point to Fabric Point
function toFabricPoint(point: Point): fabric.Point {
  return new fabric.Point(point.x, point.y);
}

// Convert Fabric Point to our Point
function fromFabricPoint(point: fabric.Point): Point {
  return { x: point.x, y: point.y };
}
```
