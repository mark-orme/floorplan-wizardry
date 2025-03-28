
/**
 * Central type exports
 * Re-exports all types for easier imports
 */

// Core types - direct exports
export * from './core/Point';
export * from './core/FloorPlan';
export * from './core/Geometry';
export * from './core/GridState';
export * from './core/DebugInfo';

// Type shortcuts for backward compatibility
export type { Point } from './core/Point';
export type { FloorPlan } from './core/FloorPlan';

// Drawing types
export * from './drawingTypes';
export * from './floorPlanTypes';
export * from './geometryTypes';
export * from './gridTypes';
export * from './debugTypes';

// Export specific named exports to avoid ambiguity
export { createPoint } from './core/Point';
export { createFloorPlan } from './core/FloorPlan';
export { GridCreationState } from './core/GridState';
export { PerformanceStats } from './core/DebugInfo';
export { CanvasDimensions } from './core/Geometry';
