
# React Contexts

## Overview

This directory contains React contexts used for state management throughout the application. Contexts provide a way to share state and functionality across components without prop drilling.

## Core Contexts

### Canvas Context

The `CanvasContext` provides access to the Fabric.js canvas instance and related functionality:

```tsx
import { useCanvasContext } from '@/contexts/CanvasContext';

function MyComponent() {
  const { canvas, setCanvas, resetCanvas } = useCanvasContext();
  
  // Use canvas functions
}
```

### Drawing Context

The `DrawingContext` manages drawing state including selected tools, colors, and line properties:

```tsx
import { useDrawingContext } from '@/contexts/DrawingContext';

function MyComponent() {
  const { tool, setTool, lineColor, setLineColor } = useDrawingContext();
  
  // Use drawing state
}
```

### UI Context

The `UIContext` manages UI state such as sidebar visibility, modals, and tooltips:

```tsx
import { useUIContext } from '@/contexts/UIContext';

function MyComponent() {
  const { isSidebarOpen, toggleSidebar } = useUIContext();
  
  // Use UI state
}
```

### History Context

The `HistoryContext` manages undo/redo functionality:

```tsx
import { useHistoryContext } from '@/contexts/HistoryContext';

function MyComponent() {
  const { undo, redo, canUndo, canRedo } = useHistoryContext();
  
  // Use history functionality
}
```

## Architecture

Each context follows a similar pattern:

1. **Context Definition**: The context itself with default values
2. **Provider Component**: Wraps your application or a part of it
3. **Consumer Hook**: A custom hook for using the context

Example:

```tsx
// 1. Context Definition
const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

// 2. Provider Component
export function ExampleProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('default');
  
  return (
    <ExampleContext.Provider value={{ value, setValue }}>
      {children}
    </ExampleContext.Provider>
  );
}

// 3. Consumer Hook
export function useExample() {
  const context = useContext(ExampleContext);
  if (context === undefined) {
    throw new Error('useExample must be used within an ExampleProvider');
  }
  return context;
}
```

## Best Practices

When creating or using contexts:

1. **Keep context values minimal**: Only include what's needed
2. **Memoize expensive calculations**: Use `useMemo` for derived values
3. **Use multiple contexts**: Split logical concerns into separate contexts
4. **Consider performance**: Be aware of unnecessary re-renders
5. **Provide default values**: Make TypeScript happy and prevent errors
6. **Error handling**: Check for undefined contexts in consumer hooks

## Monitoring

Context state changes are monitored using Sentry to help debug issues:

```tsx
useEffect(() => {
  Sentry.setContext('drawingState', {
    tool,
    lineColor,
    lineThickness
  });
}, [tool, lineColor, lineThickness]);
```

This provides valuable context when analyzing errors and understanding application state at the time of errors.

## Context Composition

Contexts can be composed together:

```tsx
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CanvasProvider>
        <DrawingProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </DrawingProvider>
      </CanvasProvider>
    </UIProvider>
  );
}
```

This creates a hierarchy of state that can be accessed by components at any level.
