
# Canvas Drawing Architecture

This document provides a comprehensive overview of the canvas drawing implementation architecture, explaining how different components interact to provide a robust drawing experience.

## Architecture Overview

The drawing functionality is built on top of Fabric.js, a powerful HTML5 canvas library that provides object modeling, interaction, and animation capabilities. Our architecture extends and organizes Fabric.js functionality into a cohesive system.

```
┌─────────────────────────────────────┐
│            React Components         │
│                                     │
│  ┌─────────────┐    ┌─────────────┐ │
│  │ToolbarPanel │    │CanvasApp    │ │
│  └─────────────┘    └─────────────┘ │
│           │               │         │
└───────────┼───────────────┼─────────┘
            │               │
            ▼               ▼
┌─────────────────────────────────────┐
│              Contexts               │
│                                     │
│ ┌─────────────┐   ┌──────────────┐  │
│ │DrawingContext│  │CanvasContext │  │
│ └─────────────┘   └──────────────┘  │
│          │               │          │
└──────────┼───────────────┼──────────┘
           │               │
           ▼               ▼
┌─────────────────────────────────────┐
│         Custom React Hooks          │
│                                     │
│ ┌─────────────┐   ┌──────────────┐  │
│ │useCanvasInit│   │useTool       │  │
│ └─────────────┘   └──────────────┘  │
│         │                │          │
└─────────┼────────────────┼──────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────┐
│           Fabric.js API             │
│                                     │
│  ┌─────────────┐   ┌─────────────┐  │
│  │Canvas       │   │Objects      │  │
│  └─────────────┘   └─────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## Core Components

### 1. Canvas Management

- **Canvas Initialization**: Handled by `useCanvasInitialization` hook which sets up the Fabric.js canvas with proper configuration.
- **Canvas Controller**: Provides high-level access to canvas operations and integrates with the React component lifecycle.
- **Canvas References**: Maintains references to both the HTML canvas element and the Fabric.js canvas instance to ensure proper cleanup and state management.

### 2. Drawing Tools

Each drawing tool follows a consistent pattern with these components:

- **Tool State Hook**: Manages the internal state for the tool (e.g., `useLineState` for the straight line tool).
- **Tool Events Hook**: Handles event listeners and interactions (e.g., `useLineEvents` for straight line tool events).
- **Tool Main Hook**: Combines state and events to provide a complete tool interface (e.g., `useStraightLineTool`).

### 3. Event Handling

- **Event Types**: Standardized in `fabric-events.d.ts` to ensure consistent event handling across the application.
- **Event Handlers**: Attached to canvas via the tool hooks.
- **Touch Gestures**: Handled in `gestures.ts` with special support for multitouch and Apple Pencil.

## Data Flow

1. **User Interaction**: User interacts with the canvas or tool controls
2. **Event Handling**: Fabric.js events are captured and processed by our custom hooks
3. **State Updates**: Tool state is updated based on the interaction
4. **Canvas Rendering**: Changes are rendered to the canvas
5. **History Management**: Changes are recorded for undo/redo functionality

## Type Definitions

Type definitions are critical for maintaining a robust codebase. Key type definition files include:

- **fabric.d.ts**: Core Fabric.js related interfaces
- **fabric-events.d.ts**: Event-related interfaces
- **core/Point.ts**: Point-related interfaces
- **drawingTypes.ts**: Drawing-specific interfaces

## Component Communication

Components communicate through a combination of:

1. **Context Providers**: Provide global state accessible to all components
2. **Props**: For direct parent-child communication
3. **Custom Events**: For specific cross-component communication
4. **Refs**: For direct access to DOM or Fabric.js objects

## Code Organization

```
src/
├── components/             # React components
│   ├── canvas/            # Canvas-specific components
│   └── toolbars/          # Tool control components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
│   ├── canvas-initialization/  # Canvas setup hooks
│   ├── straightLineTool/  # Straight line tool hooks
│   └── useCanvasState.ts  # Canvas state management
├── types/                 # TypeScript type definitions
│   ├── core/              # Core type definitions
│   ├── fabric.d.ts        # Fabric.js type extensions
│   └── fabric-events.d.ts # Fabric.js event type definitions
├── utils/                 # Utility functions
│   ├── canvas/            # Canvas-specific utilities
│   ├── fabric/            # Fabric.js extensions
│   └── geometryUtils.ts   # Geometry calculation utilities
└── eslint/                # ESLint configurations
```

## Common Patterns

### Tool Implementation Pattern

All drawing tools follow this implementation pattern:

1. **State Management**: A hook that manages the tool's state
2. **Event Handling**: A hook that connects user interactions to state changes
3. **Tool Integration**: A main hook that combines state and events into a cohesive tool

Example:
```typescript
// State management
const lineState = useLineState();

// Event handling
const lineEvents = useLineEvents(fabricCanvasRef, tool, lineColor, lineThickness, saveCurrentState, lineState);

// Tool integration used in components
const { isDrawing, cancelDrawing, isToolInitialized } = useStraightLineTool({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
});
```

### Canvas Initialization Pattern

Canvas initialization follows a defensive pattern with multiple validation steps:

1. **Reference Creation**: Create refs for HTML and Fabric canvas
2. **Canvas Setup**: Initialize Fabric.js with proper options
3. **Validation**: Verify canvas is properly initialized
4. **Error Handling**: Gracefully handle initialization failures
5. **Cleanup**: Properly dispose of canvas resources on unmount

## Best Practices

1. **Avoid Direct DOM Manipulation**: Use Fabric.js API for canvas operations
2. **Centralize Types**: Maintain type definitions in dedicated files
3. **Use Defensive Coding**: Check for null/undefined before accessing properties
4. **Consistent Event Handling**: Use the standardized event types and handlers
5. **Clean Lifecycle Management**: Initialize and clean up resources properly
6. **Use ESLint Rules**: Follow the strict typing rules to prevent common errors

## Debugging

Tools for troubleshooting canvas issues:

1. **DebugInfoState**: Contains detailed information about canvas state
2. **Grid Debug Panel**: Visual debug information for grid-related functionality
3. **Console Logs**: Structured logging with clear prefixes
4. **Canvas Inspection**: Direct inspection of canvas objects through developer tools

## Future Improvements

1. **Performance Optimizations**: Fine-tuned rendering for large floor plans
2. **Enhanced Touch Support**: Better multi-touch gesture recognition
3. **Modular Tool System**: Dynamically loadable drawing tools
4. **Advanced Grid System**: Configurable measurement units and scales

## Contributing Guidelines

When extending the canvas functionality:

1. **Maintain Type Safety**: Always update type definitions when adding new features
2. **Follow Existing Patterns**: Leverage established patterns for consistency
3. **Write Tests**: Ensure new features have proper test coverage
4. **Update Documentation**: Keep this architecture document up-to-date
5. **Use ESLint**: Follow the strict ESLint rules to prevent common errors
