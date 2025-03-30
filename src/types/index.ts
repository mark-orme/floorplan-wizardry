
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

// Re-export from useCanvasState for canonical DrawingTool definition
export type { DrawingTool } from '@/hooks/useCanvasState';
export { DrawingMode } from '@/hooks/useCanvasState';

// Re-export zoom-related types
export type {
  ZoomDirection,
  ZoomOptions
} from './zoomTypes';

// Re-export from drawingTypes - use export type for isolatedModules compatibility
export type {
  Point as DrawingPoint,
  CanvasDimensions as DrawingCanvasDimensions,
  DebugInfoState as DrawingDebugInfoState,
  DrawingState as DrawingStateType
} from './drawingTypes';

// Export createX functions separately to avoid ambiguity
export { createPoint } from './geometryTypes';
export type { PerformanceStats } from './core/DebugInfo';
export { createDefaultDrawingState } from './core/DrawingState';
export { createFloorPlan } from './core/FloorPlan';

// Drawing types
export type { default as GridCreationLock } from './grid/GridCreationLock';

// Use export type for isolatedModules compatibility
export type { FloorPlan as AppFloorPlan } from './floorPlanTypes';
export type { StrokeType, StrokeTypeLiteral, PaperSize, Wall, Room } from './floorPlanTypes';
export type { Point as GeometryPoint } from './geometryTypes';

// Export zoom constants and types
export { ZOOM_CONSTRAINTS } from './zoomTypes';
export type { ZoomDirection as ZoomDirectionType } from './zoomTypes';
