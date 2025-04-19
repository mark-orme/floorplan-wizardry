
# Fabric.js Type Safety Guidelines

This document provides specific guidance for working with Fabric.js in our TypeScript codebase to prevent common type errors.

## Common Fabric.js Type Errors

### 1. Event Handling Type Issues

**Problem**: Passing incorrect objects to Fabric.js event handlers.

**Solution**: Always include required properties in event objects:

```typescript
// CORRECT: Include both 'e' and 'pointer' in brush events
fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, {
  e: pointerEvent,
  pointer: fabricPoint // Required property for TBrushEventData
});

// INCORRECT: Missing required 'pointer' property
fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, {
  e: pointerEvent // Error: Missing 'pointer' property
});
```

### 2. Point Object Type Issues

**Problem**: Using plain `{x, y}` objects where Fabric.js expects `fabric.Point` instances.

**Solution**: Always use proper Point conversion utilities:

```typescript
// CORRECT: Convert coordinate objects to fabric.Point
import { toFabricPoint } from '@/utils/fabricPointConverter';

const fabricPoint = toFabricPoint({ x, y });
fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, { e, pointer: fabricPoint });

// INCORRECT: Using plain object
fabricCanvas.freeDrawingBrush.onMouseDown({ x, y }, { e }); // Type error!
```

### 3. Unknown Properties in Event Objects

**Problem**: Adding non-standard properties to Fabric.js event objects.

**Solution**: Only include properties defined in the Fabric.js types:

```typescript
// CORRECT: Only use properties defined in TBrushEventData
fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, {
  e: pointerEvent,
  pointer: fabricPoint
});

// INCORRECT: Adding unknown 'isClick' property
fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, {
  e: pointerEvent,
  pointer: fabricPoint,
  isClick: true // Error: Property 'isClick' does not exist on type 'TBrushEventData'
});
```

## ESLint Rules for Fabric.js

Our codebase includes several ESLint rules designed to catch Fabric.js type errors:

1. **fabric-types/proper-object-types**: Ensures proper Fabric object type checking
2. **fabric-event-typing/correct-types**: Validates event types for Fabric.js events
3. **fabric-event-typing/consistent-event-names**: Enforces consistent event naming

## Best Practices for Fabric.js in TypeScript

1. **Always use helper functions for coordinate conversion**:
   ```typescript
   // Use toFabricPoint for all coordinate conversions
   const fabricPoint = toFabricPoint({ x, y });
   ```

2. **Properly type event handlers**:
   ```typescript
   // Use proper event types
   canvas.on(FabricEventTypes.MOUSE_DOWN, (e: TPointerEventInfo<TPointerEvent>) => {
     // Type-safe event handling
   });
   ```

3. **Include all required properties in event objects**:
   ```typescript
   // Brush events require both 'e' and 'pointer' properties
   const eventData = {
     e: pointerEvent,
     pointer: fabricPoint
   };
   ```

4. **Check object existence before accessing properties**:
   ```typescript
   // Check if brush exists before using it
   if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
     canvas.freeDrawingBrush.width = 5;
   }
   ```

## Canvas Event Objects Type Reference

| Event Handler | Required Properties | Type Interface |
|---------------|---------------------|----------------|
| onMouseDown   | e, pointer          | TBrushEventData |
| onMouseMove   | e, pointer          | TBrushEventData |
| onMouseUp     | e, pointer          | TBrushEventData |
| on('mouse:down') | e               | TPointerEventInfo<TPointerEvent> |
| on('object:added') | e, target     | TObjectEventInfo |

By following these guidelines and using our helper functions, you can avoid common Fabric.js type errors and create more robust code.
