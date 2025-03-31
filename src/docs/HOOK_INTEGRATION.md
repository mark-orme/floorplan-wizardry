# React Hooks and Fabric.js Integration

This document explains how our React hooks integrate with Fabric.js to provide a seamless and type-safe canvas drawing experience.

## Core Integration Principles

1. **Unidirectional Data Flow**: State flows from React to Fabric.js, and events flow from Fabric.js back to React.
2. **Ref-Based Access**: We use refs to maintain references to the canvas and avoid re-initialization.
3. **Effect-Based Synchronization**: We use effects to synchronize React state with the Fabric.js canvas.
4. **Callback-Based Event Handling**: We use callbacks to handle Fabric.js events in a React-friendly way.

## Hook Hierarchy

Our hooks are organized in a hierarchical manner:

```
useCanvasInitialization
    │
    ├── useCanvasControllerSetup
    │       │
    │       ├── useCanvasState
    │       └── useCanvasEventHandlers
    │
    ├── useToolManagement
    │       │
    │       ├── useStraightLineTool
    │       │       │
    │       │       ├── useLineState
    │       │       └── useLineEvents
    │       │
    │       ├── useDrawTool
    │       └── ...
    │
    └── useGridManagement
```

## Canvas Initialization Pattern

Canvas initialization follows a consistent pattern:

```typescript
// 1. Create refs
const canvasRef = useRef<HTMLCanvasElement>(null);
const fabricCanvasRef = useRef<FabricCanvas | null>(null);
const initializationRef = useRef(false);

// 2. Initialize canvas in effect
useEffect(() => {
  // Prevent double initialization
  if (initializationRef.current || !canvasRef.current) return;
  initializationRef.current = true;
  
  // Check for existing Fabric instance
  if (canvasRef.current._fabric) {
    console.warn("Canvas already has a Fabric instance!");
    return;
  }
  
  try {
    // Create canvas
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      // other options...
    });
    
    // Store reference
    fabricCanvasRef.current = fabricCanvas;
    
    // Additional setup...
    
    // Report success
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }
  } catch (error) {
    // Handle error
    console.error("Failed to initialize canvas:", error);
    if (onError) {
      onError(error as Error);
    }
  }
  
  // Cleanup
  return () => {
    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.dispose();
      } catch (err) {
        console.error("Error disposing canvas:", err);
      }
      fabricCanvasRef.current = null;
    }
    initializationRef.current = false;
  };
}, [width, height, onCanvasReady, onError]);
```

## Event Handler Pattern

We handle Fabric.js events using callbacks that are memoized with useCallback:

```typescript
// 1. Create callback
const handleMouseDown = useCallback((opt: FabricMouseDownEvent) => {
  // Event handling logic
}, [dependencies]);

// 2. Set up event handlers in effect
useEffect(() => {
  if (!fabricCanvasRef.current) return;
  
  // Add event handlers
  fabricCanvasRef.current.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
  
  // Return cleanup function
  return () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    }
  };
}, [fabricCanvasRef, handleMouseDown]);
```

## Tool State Management Pattern

Each drawing tool has a dedicated state management hook:

```typescript
export const useLineState = () => {
  // Tool state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Refs to avoid re-renders
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  
  // State management functions
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
    setIsDrawing(true);
  }, []);
  
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
  }, []);
  
  // ... other functions
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    setStartPoint,
    resetDrawingState,
    // ... other returned values
  };
};
```

## Tool Event Pattern

Each tool has a dedicated event handling hook:

```typescript
export const useLineEvents = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: DrawingMode,
  lineColor: string,
  lineThickness: number,
  saveCurrentState: () => void,
  lineState: LineState
) => {
  const { 
    isDrawing, 
    setIsDrawing, 
    startPointRef, 
    currentLineRef, 
    setStartPoint,
    setCurrentLine,
    resetDrawingState
  } = lineState;
  
  // Event handlers
  const handleMouseDown = useCallback((opt: FabricMouseDownEvent) => {
    if (tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    // Mouse down handling logic
  }, [tool, fabricCanvasRef, /* other dependencies */]);
  
  const handleMouseMove = useCallback((opt: FabricMouseMoveEvent) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    // Mouse move handling logic
  }, [isDrawing, tool, fabricCanvasRef, /* other dependencies */]);
  
  const handleMouseUp = useCallback((opt: FabricMouseUpEvent) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    // Mouse up handling logic
  }, [isDrawing, tool, fabricCanvasRef, /* other dependencies */]);
  
  // Setup event handlers in effect
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.STRAIGHT_LINE) {
      canvas.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
      canvas.on(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
      canvas.on(FabricEventTypes.MOUSE_UP, handleMouseUp);
    }
    
    return () => {
      if (canvas) {
        canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
        canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
        canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
      }
    };
  }, [fabricCanvasRef, tool, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    // ... other functions
  };
};
```

## Tool Integration Pattern

Finally, we combine state and events into a unified tool hook:

```typescript
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // Get line state
  const lineState = useLineState();
  const { isDrawing, isToolInitialized } = lineState;
  
  // Get line events
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing
  } = useLineEvents(
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState,
    lineState
  );
  
  // Manage tool state
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE && !isToolInitialized) {
      lineState.initializeTool();
    }
  }, [tool, isToolInitialized, lineState]);
  
  // Return unified tool interface
  return {
    isDrawing,
    cancelDrawing,
    isToolInitialized,
    isActive: tool === DrawingMode.STRAIGHT_LINE
  };
};
```

## Key Benefits of This Approach

1. **Clear Separation of Concerns**: Each hook has a single responsibility.
2. **Reusable Logic**: Hooks can be reused across different components.
3. **Type Safety**: TypeScript ensures correct usage of Fabric.js APIs.
4. **Testability**: Each hook can be tested in isolation.
5. **Maintainability**: Code is organized in a modular and consistent way.
6. **Performance**: We use refs and memoization to minimize re-renders.

## Common Pitfalls and How to Avoid Them

1. **Multiple Canvas Initialization**
   - Problem: Creating multiple Fabric.js canvas instances for the same HTML element.
   - Solution: Use initializationRef to track initialization state.

2. **Event Handler Memory Leaks**
   - Problem: Not removing event handlers when components unmount.
   - Solution: Always return a cleanup function from useEffect that removes event handlers.

3. **Dependency Array Mistakes**
   - Problem: Missing dependencies in useEffect or useCallback.
   - Solution: Use ESLint rules to ensure complete dependency arrays.

4. **Canvas Not Initialized**
   - Problem: Trying to use canvas before it's initialized.
   - Solution: Always check if fabricCanvasRef.current exists before using it.

5. **Inconsistent State**
   - Problem: React state and Fabric.js canvas state get out of sync.
   - Solution: Use effects to synchronize state changes.

By following these patterns, we create a robust integration between React and Fabric.js that is both type-safe and maintainable.
