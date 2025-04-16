
# Straight Line Tool Hooks

## Overview

This directory contains the React hooks that power the straight line drawing tool. These hooks enable users to draw precise straight lines with measurement feedback.

## Key Hooks

### useStraightLineTool

The main hook that coordinates the tool's functionality:

```typescript
const {
  isEnabled,
  isActive,
  isDrawing,
  currentLine,
  inputMethod,
  isPencilMode,
  snapEnabled,
  anglesEnabled,
  measurementData,
  toggleGridSnapping,
  toggleAngles,
  cancelDrawing
} = useStraightLineTool({
  canvas,
  enabled: true,
  lineColor: '#000000',
  lineThickness: 2,
  saveCurrentState: () => {}
});
```

#### Parameters

- `canvas`: The Fabric.js canvas instance
- `enabled`: Boolean indicating if the tool is enabled
- `lineColor`: String color value for the line
- `lineThickness`: Number for line thickness in pixels
- `saveCurrentState`: Function to save canvas state for undo/redo

#### Return Values

- `isEnabled`: Boolean indicating if the tool is enabled
- `isActive`: Boolean indicating if the tool is active
- `isDrawing`: Boolean indicating if the user is currently drawing
- `currentLine`: Reference to the current line being drawn
- `inputMethod`: Current input method (MOUSE, TOUCH, PENCIL)
- `isPencilMode`: Boolean indicating if using a stylus/pencil
- `snapEnabled`: Boolean indicating if grid snapping is enabled
- `anglesEnabled`: Boolean indicating if angle snapping is enabled
- `measurementData`: Object containing measurement information
- `toggleGridSnapping`: Function to toggle grid snapping
- `toggleAngles`: Function to toggle angle snapping
- `cancelDrawing`: Function to cancel the current drawing operation

### useLineState

Manages the internal state of the line drawing operation:

```typescript
const lineState = useLineState({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
});
```

## Example Usage

```typescript
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';

function DrawingComponent() {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new FabricCanvas(canvasRef.current);
      setCanvas(fabricCanvas);
    }
  }, []);
  
  const {
    isDrawing,
    measurementData
  } = useStraightLineTool({
    canvas,
    enabled: true,
    lineColor: '#000000',
    lineThickness: 2,
    saveCurrentState: () => console.log('Canvas state saved')
  });
  
  return (
    <div>
      <canvas ref={canvasRef} />
      {isDrawing && (
        <div>Drawing line... Length: {measurementData.distance}px</div>
      )}
    </div>
  );
}
```

## Integration with Input Methods

The hooks automatically detect and handle different input methods:

- Mouse interaction (default)
- Touch input on mobile devices
- Stylus/Apple Pencil with pressure sensitivity

## Error Handling

All hooks include robust error handling using the logger utility:

```typescript
try {
  // Hook operation
} catch (error) {
  logger.error('Error in straight line tool', error);
  // Handle error or fallback
}
```

## Events and Lifecycle

The hooks manage their own lifecycle:

1. **Initialization**: Setting up when the tool is enabled
2. **Event Attachment**: Adding event listeners to the canvas
3. **Drawing Operations**: Handling user interactions
4. **Cleanup**: Removing event listeners and resources when disabled

## Best Practices

1. Always clean up event handlers when the component unmounts
2. Use the provided hooks together for complete functionality
3. Implement proper error boundaries around components using these hooks
4. Test with different input methods when making changes
