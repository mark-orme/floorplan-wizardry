
# Floor Plan Feature

This directory contains all components, hooks, and utilities related to floor plan management.

## Structure

- `components/`: Floor plan related components
- `hooks/`: Custom hooks for floor plan operations
- `utils/`: Floor plan specific utility functions
- `types/`: TypeScript type definitions for floor plan data

## Responsibilities

- Floor plan creation and editing
- Floor plan storage and retrieval
- GIA calculations
- Floor plan visualization
- Floor plan export and import

## Usage

```tsx
import { FloorPlanList, FloorPlanCanvas, FloorPlanActions } from '@/features/floorPlan';
import { useFloorPlanQuery } from '@/features/floorPlan';
import { type FloorPlan, type Room, type Wall } from '@/features/floorPlan';
```
