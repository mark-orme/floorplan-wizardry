
/**
 * Type definitions index
 * Re-exports all types from their respective modules
 * @module types
 */

// Re-export core types with explicit names to avoid conflicts
export type { DebugInfoState, PerformanceStats } from './core/DebugInfo';
export type { DrawingState } from './core/DrawingState';
export type { Point, CanvasDimensions } from './core/Geometry';
export * from './core/Geometry'; // For the type guards

// Re-export grid related types
export type { 
  GridConfig, 
  GridDimensions, 
  GridOptions, 
  GridParameters, 
  GridStyle,
  Grid,
  GridCreationState,
  GridCreationLock // Added export for GridCreationLock
} from './core/GridState';

// Re-export other types
export * from './drawingTypes';
export * from './floorPlanTypes';
export * from './fabricTypes';
export * from './propertyTypes';
export * from './performanceTypes';
export * from './gridTypes';
