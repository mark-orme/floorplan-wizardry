/**
 * Re-export all types from a central location
 */

// Export floor plan types
export * from './floorPlan';
export * from './drawingTypes';
export { Point } from './core/Point';

// Add DebugInfoState for compatibility with existing imports
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  visibleObjects: number;
  gridCells: number;
  memoryUsage?: number;
  renderTime?: number;
}

// Other type exports can be added here in the future
