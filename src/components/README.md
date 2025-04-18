
# Components

This directory contains reusable React components used throughout the application.

## Organization

- **ui/**: UI components following the shadcn/ui pattern
- **canvas/**: Canvas-specific components for drawing and rendering
- **forms/**: Form-related components with validation
- **layout/**: Layout components like containers, grids, etc.

## Key Components

### Canvas Components

The canvas components provide the core drawing functionality:

```typescript
import { CanvasApp } from '@/components/canvas/CanvasApp';
import { Toolbar } from '@/components/canvas/Toolbar';
import { GridLayer } from '@/components/canvas/grid/GridLayer';
```

Features:
- Canvas initialization
- Drawing tools integration
- Grid system
- Layer management
- Measurement tools
- History management

## Component Guidelines

1. **Keep components small and focused** (preferably <100 lines)
2. **Use composition over inheritance**
3. **Follow the shadcn/ui pattern** for consistency
4. **Apply proper error boundaries** for resilience
5. **Implement proper TypeScript typing**

## Error Handling

Components should implement proper error handling:

```tsx
<ErrorBoundary componentName="DrawingTool">
  <StraightLineToolDemo />
</ErrorBoundary>
```

## State Management

Components use a combination of:
- Local state with useState
- Application state with @tanstack/react-query
- Context for shared state
- Custom hooks for complex logic

## Styling

Components follow these styling principles:
- Use Tailwind CSS for styling
- Follow responsive design principles
- Ensure accessibility compliance
- Maintain consistent visual language
