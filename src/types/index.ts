
/**
 * Central type exports
 * Re-exports all types for easier imports
 */

// Core types - direct exports using export type for isolatedModules compatibility
export type { Point } from './geometryTypes';
export type { FloorPlan } from './core/FloorPlan';
export type { CanvasDimensions } from './core/Geometry';
export type { DebugInfoState } from './core/DebugInfo';
export type { DrawingState } from './core/DrawingState';
export type { GridCreationState } from './gridTypes';

// Re-export zoom-related types
export type {
  ZoomDirection,
  ZoomOptions
} from './zoomTypes';

// Re-export from drawingTypes
export type {
  Point as DrawingPoint,
  CanvasDimensions as DrawingCanvasDimensions,
  DebugInfoState as DrawingDebugInfoState,
  DrawingState as DrawingStateType
} from './drawingTypes';

// Export createX functions separately to avoid ambiguity
export { createPoint } from './geometryTypes';
export { createFloorPlan } from './core/FloorPlan';
export { PerformanceStats } from './core/DebugInfo';
export { createDefaultDrawingState } from './core/DrawingState';

// Drawing types
export type { default as GridCreationLock } from './grid/GridCreationLock';

// Use export type for isolatedModules compatibility
export type * from './drawingTypes';
export type * from './floorPlanTypes';
export type * from './geometryTypes';
export type * from './gridTypes';
export type * from './debugTypes';

// Export zoom constants and types
export { ZOOM_CONSTRAINTS } from './zoomTypes';
export type { ZoomDirection as ZoomDirectionType } from './zoomTypes';
