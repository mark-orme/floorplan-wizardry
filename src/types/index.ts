
// Re-export types from core definitions
export type { DebugInfoState } from './core/DebugInfo';
export { DEFAULT_DEBUG_STATE } from './core/DebugInfo';

// Re-export drawing-related types
export type { 
  DrawingState, 
  PerformanceStats, 
  Point, 
  CanvasDimensions,
  ZoomDirection,
  DistanceToolState 
} from './drawingTypes';
export { createDefaultDrawingState } from './drawingTypes';

// Re-export DrawingTool types
export type { DrawingTool } from './core/DrawingTool';
export { DrawingMode } from '@/constants/drawingModes';

// Grid types
export type { GridCreationState, GridCreationLock } from './core/GridTypes';

// Canvas event types
export type { ZoomOptions } from './canvas-events/ZoomTypes';
