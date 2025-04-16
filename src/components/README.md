
# Components

This directory contains reusable React components used throughout the application.

## Organization

- **ui/**: UI components following the shadcn/ui pattern
- **canvas/**: Canvas-specific components for drawing and rendering
- **forms/**: Form-related components with validation
- **layout/**: Layout components like containers, grids, etc.

## Key Components

### StraightLineToolDemo

A standalone component for demonstrating the straight line drawing functionality:

```typescript
import { StraightLineToolDemo } from '@/components/StraightLineToolDemo';

function MyPage() {
  return (
    <div className="container">
      <h1>Straight Line Tool Demo</h1>
      <StraightLineToolDemo />
    </div>
  );
}
```

Features:
- Canvas initialization
- Straight line drawing
- Color and thickness controls
- Canvas clearing functionality
- Status indicators

## Component Guidelines

1. **Keep components small and focused** (preferably <100 lines)
2. **Use composition over inheritance**
3. **Follow the shadcn/ui pattern** for consistency
4. **Apply proper error boundaries** for resilience
5. **Implement proper TypeScript typing**

## Example Usage

### Canvas Components

Canvas components should be wrapped in proper error boundaries:

```tsx
<ErrorBoundary componentName="DrawingTool">
  <StraightLineToolDemo />
</ErrorBoundary>
```

### Handling User Input

Components should provide appropriate feedback for user interactions:

```tsx
<Button 
  onClick={handleAction}
  disabled={isLoading}
>
  {isLoading ? 'Processing...' : 'Draw Line'}
</Button>
```

## State Management

Components should manage their state appropriately:

- Use `useState` for simple component state
- Use custom hooks for complex logic
- Implement proper cleanup in `useEffect` return functions

## Error Handling

Components should implement proper error handling:

```tsx
try {
  // Component operation
} catch (error) {
  logger.error('Component error', error);
  setError('Something went wrong. Please try again.');
}
```

## Styling

Components should follow the project's styling conventions:

- Use Tailwind CSS for styling
- Follow responsive design principles
- Ensure accessibility compliance
- Maintain consistent visual language
