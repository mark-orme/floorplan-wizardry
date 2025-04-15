
# Drawing Feature

## Overview

The drawing feature provides interactive canvas-based tools for creating and manipulating vector and raster graphics. This module is designed for floor plan editing, architectural drawing, and general-purpose vector graphics creation.

## Key Components

### Tools

- **Selection Tool**: Select, move, resize and rotate objects
- **Drawing Tool**: Freehand drawing with pressure sensitivity support
- **Straight Line Tool**: Create precise straight lines with measurements
- **Wall Tool**: Specialized tool for architectural walls with thickness
- **Eraser Tool**: Remove drawing elements
- **Hand Tool**: Pan and navigate around the canvas

### Utilities

- **Grid System**: Customizable grid with snapping capabilities
- **Measurement System**: Real-time measurements for drawing operations
- **Layer Management**: Organize drawings with multiple layers
- **History Management**: Undo/redo support for all operations

## Technology

The drawing feature is built using:

- **Fabric.js**: Core canvas manipulation library
- **React**: Component-based UI architecture
- **TypeScript**: Type-safe development
- **Sentry**: Error tracking and performance monitoring

## Usage

The drawing feature is typically used through the `CanvasApp` component, which provides a complete drawing environment. Individual tools can be accessed through the `Toolbar` component.

```tsx
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { Toolbar } from "@/components/canvas/Toolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { useState } from "react";

function DrawingPage() {
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  
  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        activeTool={tool}
        onToolChange={setTool}
        lineThickness={lineThickness}
        onLineThicknessChange={setLineThickness}
        lineColor={lineColor}
        onLineColorChange={setLineColor}
      />
      <div className="flex-1">
        <CanvasApp 
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
        />
      </div>
    </div>
  );
}
```

## Architecture

The drawing feature follows a modular architecture:

1. **Components**: UI elements for interaction
2. **Hooks**: Reusable logic for canvas manipulation
3. **Utils**: Helper functions for geometry, measurement, etc.
4. **Contexts**: State management for drawing operations
5. **Constants**: Configuration values for consistent behavior

## Monitoring

The drawing feature has comprehensive Sentry integration for monitoring:

- Tool usage metrics
- Drawing operations
- Performance metrics
- Error tracking with detailed context

Each drawing operation and tool change is tracked with appropriate context to help debug issues and understand user behavior.
