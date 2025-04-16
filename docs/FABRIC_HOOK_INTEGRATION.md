# Fabric.js Hooks Integration Guide

This guide provides best practices for creating and using React hooks with Fabric.js in our application.

## Common Pattern for Canvas Hooks

When creating hooks that interact with the Fabric.js canvas, follow this pattern:

```typescript
import { Canvas as FabricCanvas } from 'fabric';

interface UseMyHookProps {
  // Always use an object parameter pattern
  canvas: FabricCanvas | null;
  // Other parameters...
}

export const useMyHook = ({ canvas, ...otherProps }: UseMyHookProps) => {
  // Implementation...
};
```

## Working with Canvas References

Always use refs to track canvas instances:

```typescript
// CORRECT:
const fabricCanvasRef = useRef<FabricCanvas | null>(null);

// Set the ref when canvas is available
useEffect(() => {
  fabricCanvasRef.current = canvas;
}, [canvas]);

// Pass the ref to other hooks
const lineState = useLineState({ fabricCanvasRef, ...otherProps });
```

## Parameter Objects

Always use parameter objects instead of individual parameters:

```typescript
// CORRECT:
const lineState = useLineState({
  fabricCanvasRef,
  lineColor,
  lineThickness
});

// INCORRECT:
const lineState = useLineState(fabricCanvasRef, lineColor, lineThickness);
```

## Event Handling

When working with Fabric.js events:

1. Always clean up event listeners:

```typescript
useEffect(() => {
  if (!canvas) return;
  
  canvas.on('mouse:down', handleMouseDown);
  
  return () => {
    canvas.off('mouse:down', handleMouseDown);
  };
}, [canvas, handleMouseDown]);
```

2. Use the FabricEventNames enum for event names:

```typescript
import { FabricEventNames } from '@/types/fabric-events';

canvas.on(FabricEventNames.MOUSE_DOWN, handleMouseDown);
```

## Fabric Object Creation

When creating Fabric.js objects:

1. Always import specific classes:

```typescript
// CORRECT:
import { Line, Circle } from 'fabric';

// INCORRECT:
import fabric from 'fabric';
// or using global fabric object without import
```

2. Always include both required parameters for Line:

```typescript
// CORRECT:
const line = new Line([x1, y1, x2, y2], { stroke: 'red' });

// INCORRECT:
const line = new Line([x1, y1, x2, y2]); // Missing options
const line = new Line({ stroke: 'red' }); // Missing coordinates
```

## Component Integration

When integrating canvas hooks with components:

1. Ensure proper type definitions:

```typescript
interface MyComponentProps {
  canvas: FabricCanvas | null;
}

const MyComponent: React.FC<MyComponentProps> = ({ canvas }) => {
  const { isActive } = useMyCanvasHook({ canvas });
  // ...
};
```

2. Check for null canvas before operations:

```typescript
const handleClick = () => {
  if (!canvas) return;
  
  // Now it's safe to use canvas
  canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
};
```

## Testing Hooks

When testing hooks that use Fabric.js:

1. Create type-safe mock canvas objects:

```typescript
import { asMockCanvas } from '@/types/test/MockTypes';

const mockCanvas = asMockCanvas({
  add: vi.fn(),
  remove: vi.fn(),
  renderAll: vi.fn()
});
```

2. Use proper parameter objects:

```typescript
const { result } = renderHook(() => useLineState({
  fabricCanvasRef: { current: mockCanvas },
  lineColor: '#000000',
  lineThickness: 2,
  saveCurrentState: vi.fn()
}));
```

By following these guidelines, we can prevent common errors when working with Fabric.js hooks and ensure consistent, maintainable code.
