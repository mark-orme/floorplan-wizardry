
# FloorPlan Designer Architecture

## System Architecture Diagram

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

## State Flow Diagram

```
┌─────────────────────┐
│                     │
│  User Interaction   │
│  (mouse/touch)      │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│                     │
│  React Event        │
│  Handlers           │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│                     │
│  Custom Hooks       │
│  (Drawing State)    │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│                     │
│  Canvas Updates     │
│  (Fabric.js)        │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│                     │
│  Render Canvas      │
│  (Visual Update)    │
│                     │
└─────────────────────┘
```

## Drawing Tool Selection Flow

```
┌───────────────────┐
│                   │
│  User selects     │
│  tool in toolbar  │
│                   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│                   │
│  onToolChange     │
│  (handleToolChange)│
│                   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │
│  Validate against │  No   │  Show error,      │
│  DrawingMode enum │──────▶│  log warning      │
│                   │       │                   │
└─────────┬─────────┘       └───────────────────┘
          │ Yes
          ▼
┌───────────────────┐
│                   │
│  Update tool      │
│  state            │
│                   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│                   │
│  Configure canvas │
│  for tool         │
│                   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│                   │
│  Show success     │
│  notification     │
│                   │
└───────────────────┘
```

## Key Components Hierarchy

```
App
├── CanvasApp
│   ├── CanvasToolbar
│   │   ├── DrawingTools
│   │   └── LineSettings
│   └── Canvas
│       ├── GridLayer
│       └── FabricCanvas
└── PropertyPanel
    ├── FloorPlanList
    ├── PropertyDetails
    └── MeasurementTools
```

## Hook Dependencies

```
useDrawingTool
└── useState (tool, isDrawing)

useCanvasToolState
├── fabricCanvasRef
├── tool
├── setTool
├── lineThickness
├── lineColor
└── zoomLevel

useStraightLineTool
├── useLineState
└── useLineEvents
    ├── fabricCanvasRef
    ├── tool
    ├── lineColor
    ├── lineThickness
    └── saveCurrentState
```
