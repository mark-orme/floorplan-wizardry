
# Drawing Tools Documentation

This document outlines the usage patterns, design decisions, and best practices for the drawing tools within this application.

## Tool Architecture

The drawing functionality follows a modular design pattern with clear separation of concerns:

```
features/drawing/
├── components/       # UI components for drawing tools
├── hooks/            # Custom hooks for tool functionality
├── state/            # State management for drawings
├── tools/            # Individual drawing tool implementations
├── utils/            # Utility functions for drawing operations
└── types/            # TypeScript type definitions
```

## Rate Limiting Canvas Operations

Canvas operations are rate-limited to prevent performance issues:

- **Real-time drawing**: Throttled at ~60fps (16ms)
- **Shape manipulation**: Throttled at ~20fps (50ms)
- **Expensive operations**: Debounced at 100ms
- **Very expensive operations**: Debounced at 250ms
- **Auto-save**: Debounced at 2000ms (2 seconds)

Example usage:

```typescript
import { createRateLimitedCanvasOperation } from '@/utils/canvas/rateLimit';

// Create a rate-limited version of your function
const updateCanvasState = createRateLimitedCanvasOperation(
  (newState) => {
    // Update canvas state logic
  },
  'expensiveOperation'
);

// Use the rate-limited function directly
updateCanvasState(newData);
```

## Error Handling

Each drawing tool implements error handling with error boundaries:

```tsx
<ErrorBoundary componentName="PencilTool">
  <PencilToolComponent />
</ErrorBoundary>
```

Additionally, all tool operations use structured error handling:

```typescript
try {
  // Tool operation
} catch (error) {
  handleError(error, {
    component: 'PencilTool',
    operation: 'draw',
    context: { /* relevant context */ }
  });
}
```

## Security Considerations

1. **Input Validation**: All user inputs are validated using Zod schemas
2. **Content Sanitization**: HTML content is sanitized before rendering
3. **CSP Enforcement**: Content Security Policy headers protect against XSS

## Performance Optimization

1. **Canvas Initialization**: Optimized with lazy loading
2. **Tool Switching**: Uses React.memo and useCallback for efficient re-renders
3. **Large Canvas Rendering**: Implements virtualization for large canvases

## Best Practices

1. Always wrap tool components in error boundaries
2. Rate-limit expensive canvas operations
3. Validate all user input with proper schemas
4. Use the appropriate tool hooks for consistent behavior
5. Follow the established state management pattern

## Common Tool Patterns

### Creating a New Tool

1. Define the tool interface in `types/tools.ts`
2. Implement the tool in `tools/MyNewTool.tsx`
3. Create a custom hook in `hooks/useMyNewTool.ts`
4. Add the tool to the toolbar in `components/Toolbar.tsx`
5. Register the tool in `state/toolRegistry.ts`

### Working with Canvas Objects

```typescript
// Creating objects
const object = createObject({
  type: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  // Properties
});

// Adding to canvas
canvas.add(object);

// Rate-limited updates
const updateObject = createRateLimitedCanvasOperation(
  (obj, props) => {
    obj.set(props);
    canvas.renderAll();
  },
  'shapeManipulation'
);
```

## Debugging Tools

1. Enable debug mode: `localStorage.setItem('CANVAS_DEBUG', 'true')`
2. Use the canvas inspector: Press Ctrl+Shift+D
3. View performance metrics: Enable the FPS counter in settings
