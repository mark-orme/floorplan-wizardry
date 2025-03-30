
# Component Design

## Component Architecture

The application follows a component-based architecture with clear separation of concerns:

### Presentational Components

- Focus on how things look
- Receive data and callbacks via props
- Don't depend on global state
- Are highly reusable

### Container Components

- Focus on how things work
- Provide data and behavior to presentational components
- Connect to state management
- Handle side effects

### Smart vs. Dumb Components

- **Smart Components**: Handle state, logic, and data fetching
- **Dumb Components**: Receive props and render UI elements

## Hook-Based Design

Most components use custom hooks to manage complex logic:

```typescript
// Component using hooks for logic separation
function FloorPlanCanvas({ propertyId }) {
  // Use specialized hooks
  const canvas = useCanvasInitialization();
  const grid = useReliableGrid({ fabricCanvasRef: canvas.ref });
  const drawing = useDrawingTools({ canvas: canvas.ref.current });
  
  // Component only handles rendering
  return (
    <div className="canvas-container">
      <canvas ref={canvas.htmlRef} />
      {/* Additional UI elements */}
    </div>
  );
}
```

## Canvas Components

Canvas components follow these patterns:

1. **Initialization**: Properly initialize and clean up canvas resources
2. **Layers**: Manage drawing in appropriate layers (grid, drawing, UI)
3. **Event Handling**: Normalize events across devices
4. **Performance**: Implement proper rendering optimization

## Grid Components

Grid components:

1. **Reliability**: Use retry and fallback mechanisms
2. **Visibility**: Track and ensure grid visibility
3. **Cleanup**: Properly remove grid objects when unmounting
4. **Integration**: Integrate with canvas lifecycle events

## Responsive Design

All components should:

1. Use Tailwind CSS for responsive layouts
2. Adapt to different screen sizes
3. Support touch, mouse, and stylus inputs
4. Optimize for different device capabilities
