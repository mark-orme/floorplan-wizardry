
/**
 * Central type exports
 * Re-exports all types for easier imports
 */

// Core types - direct exports using export type for isolatedModules compatibility
export type { Point } from './core/Point';
export type { FloorPlan } from './core/FloorPlan';
export type { CanvasDimensions } from './core/Geometry';
export type { DebugInfoState } from './core/DebugInfo';
export type { DrawingState } from './core/DrawingState';
export type { GridState, GridCreationState } from './core/GridState';

// Re-export drawing-related types
export type {
  ZoomDirection,
  ZoomOptions,
  Point as DrawingPoint,
  CanvasDimensions as DrawingCanvasDimensions,
  DebugInfoState as DrawingDebugInfoState,
  DrawingState as DrawingStateType
} from './drawingTypes';

// Export createX functions separately to avoid ambiguity
export { createPoint } from './core/Point';
export { createFloorPlan } from './core/FloorPlan';
export { PerformanceStats } from './core/DebugInfo';
export { createDefaultDrawingState } from './core/DrawingState';

// Drawing types
export * from './drawingTypes';
export * from './floorPlanTypes';
export * from './geometryTypes';
export * from './gridTypes';
export * from './debugTypes';

// Export zoom constants and types
export { ZOOM_CONSTRAINTS } from './zoomTypes';
export type { ZoomDirection as ZoomDirectionType } from './zoomTypes';
