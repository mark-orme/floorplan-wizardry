
# Grid Feature

This module handles the grid system for the canvas including:

- Grid creation and rendering
- Grid visibility and scaling
- Snapping functionality

## Components

- `GridLayer` - Component for rendering grid lines
- `GridManager` - Component for managing grid state
- `GridDebugPanel` - Panel for debugging grid issues

## Hooks and Utilities

- `useGridCreation` - Hook for grid creation
- `useGridManagement` - Hook for grid state management
- `createGrid` - Utility function to create grid objects

## Usage

Import components, hooks and utilities directly from the feature:

```tsx
import { GridLayer, useGridCreation, createGrid } from '@/features/grid';
```
