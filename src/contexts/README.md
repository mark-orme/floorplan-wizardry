
# Contexts Directory

This directory contains React Context providers used for state management across the application.

## Available Contexts

### Drawing Context

The `DrawingContext` provides state management for the drawing tools and canvas:

- Current tool selection
- Drawing settings (color, thickness, etc.)
- Grid configuration
- Undo/redo state

### Canvas Context

The `CanvasContext` provides access to the Fabric.js canvas instance:

- Canvas reference
- Canvas operations (zoom, pan, etc.)
- Object management (selection, deletion, etc.)

## Usage Guidelines

### Using Contexts

To use a context in a component:

```jsx
import { useDrawingContext } from '@/contexts/DrawingContext';

const MyComponent = () => {
  const { tool, setTool, lineColor, lineThickness } = useDrawingContext();
  
  return (
    <button onClick={() => setTool(DrawingMode.STRAIGHT_LINE)}>
      Line Tool
    </button>
  );
};
```

### Creating New Contexts

When creating a new context:

1. Define the context type
2. Create a context provider component
3. Create a custom hook for accessing the context
4. Export both the provider and the hook

Example:

```tsx
import React, { createContext, useContext, useState } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('default');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};
```

## Context Architecture

Our application uses a hierarchical context structure:

1. `AppContext` at the root level for global app state
2. Feature-specific contexts (like `DrawingContext`) for domain-specific state
3. Component-specific contexts for localized state

This structure helps prevent unnecessary re-renders and keeps related state together.
