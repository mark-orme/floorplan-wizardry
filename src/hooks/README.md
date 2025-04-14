
# Hooks

This directory contains custom React hooks that provide reusable logic across the application.

## Core Principles

- **Single Responsibility**: Each hook should do one thing well
- **Composition**: Complex hooks should compose simpler hooks
- **Error Handling**: Hooks should gracefully handle errors and edge cases
- **Performance**: Hooks should be optimized for performance using proper dependencies

## Usage Patterns

### Rate Limiting

Use the `useRateLimitedUpdate` hook to prevent excessive state updates:

```tsx
const [canvasState, setCanvasState] = useState(initialState);
const updateCanvasState = useRateLimitedUpdate(setCanvasState, { 
  method: 'debounce', 
  delay: 100 
});

// Use the rate-limited function instead of setState directly
updateCanvasState(newState);
```

### Form Validation

Use the `useValidatedForm` hook for form handling with Zod validation:

```tsx
const { 
  values, errors, touched, 
  setFieldValue, handleSubmit 
} = useValidatedForm({
  initialValues: { name: '', email: '' },
  schema: userSchema,
  onSubmit: (values) => {
    // Handle form submission
  }
});
```

### Canvas Operations

Canvas operations are composed of multiple specialized hooks:

```tsx
const { 
  handleToolChange,
  handleUndo,
  handleRedo,
  handleZoom
} = useCanvasOperations({
  // Configuration options
});
```
