
# Floor Plan Feature

This module handles all floor plan functionality including:

- Floor plan creation and editing
- Floor plan storage and retrieval
- Floor plan visualization and rendering

## Components

- `FloorPlanCanvas` - Canvas for drawing/editing floor plans
- `FloorPlanList` - List of available floor plans
- `FloorPlanControls` - UI controls for floor plan manipulation

## Hooks

- `useFloorPlanQuery` - Data fetching hook for floor plans
- `useFloorPlanDrawing` - Hook for floor plan drawing operations
- `useSyncedFloorPlans` - Hook for syncing floor plans across devices

## Usage

Import components and hooks directly from the feature:

```tsx
import { FloorPlanCanvas, useFloorPlanDrawing } from '@/features/floorPlan';
```
