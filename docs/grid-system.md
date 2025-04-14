
# Grid System Documentation

## Overview

The grid system is a fundamental component of the floor plan designer that provides visual guidance and measurement reference for users. It consists of two main grid types:

- **Small Grid**: Finer grid lines (0.1m) for detailed placement
- **Large Grid**: Major grid lines (1.0m) for primary measurements

## Architecture

The grid system is implemented using multiple layers:

```
┌─────────────────────────────────────┐
│           Grid Components           │
│  ┌─────────────┐    ┌─────────────┐ │
│  │GridDebugPanel│   │GridLayer    │ │
│  └─────────────┘    └─────────────┘ │
│           │               │         │
└───────────┼───────────────┼─────────┘
            │               │
            ▼               ▼
┌─────────────────────────────────────┐
│           Grid Utilities            │
│  ┌─────────────┐    ┌─────────────┐ │
│  │gridVisibility│   │gridRenderers│ │
│  └─────────────┘    └─────────────┘ │
│           │               │         │
└───────────┼───────────────┼─────────┘
            │               │
            ▼               ▼
┌─────────────────────────────────────┐
│        Fabric.js Integration        │
│                                     │
│      (Line, Text objects, etc)      │
│                                     │
└─────────────────────────────────────┘
```

## Grid Constants

Grid appearance and behavior are configured through constants defined in `src/constants/gridConstants.ts`. These constants include:

- Grid sizing (SMALL_GRID_SIZE, LARGE_GRID_SIZE)
- Grid styling (colors, line widths)
- Visibility settings
- Safety mechanisms

## Grid Rendering

Grid rendering is handled by the `createCompleteGrid` function in `gridRenderers.ts`, which:

1. Creates small grid lines
2. Creates large grid lines
3. Adds measurement markers
4. Sets appropriate visual properties

## Error Recovery

The grid system implements robust error recovery mechanisms:

- Automatic visibility checks
- Grid recreation when missing
- Multiple recreation attempts with delays
- Diagnostic tools for troubleshooting

## Grid Visibility Management

Grid visibility is managed through:

- `ensureGridVisibility`: Makes sure grid objects are visible
- `setGridVisibility`: Explicitly sets grid visibility
- `forceGridCreationAndVisibility`: Recreates grid from scratch
- `diagnoseGridState`: Provides diagnostic information for troubleshooting

## Debugging Tools

The `GridDebugOverlay` component provides:

- Real-time grid state information
- Controls for debugging grid issues
- One-click fixes for common problems
- Diagnostics and analysis tools

## Safeguards

Several safeguards ensure grid reliability:

- Regular visibility checks
- Auto-recreation of missing grid elements
- Emergency fix functions (window.fixGrid())
- Tracking of grid operation statistics

## Usage

Grid visibility can be controlled programmatically:

```typescript
// Make grid visible/invisible
setGridVisibility(canvas, true|false);

// Force recreation of grid
forceGridCreationAndVisibility(canvas);

// Run diagnostics
const gridState = diagnoseGridState(canvas);
```

For debugging emergencies, a global fix function is available:
```javascript
// In browser console:
window.fixGrid()
```
