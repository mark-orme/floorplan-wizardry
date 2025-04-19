
/**
 * Centralized type exports
 * All types should be exported from this file to prevent duplication and ensure consistency
 * @module types/index
 */

// Re-export types from core definitions
export type { DebugInfoState } from './core/DebugInfo';
export { DEFAULT_DEBUG_STATE } from './core/DebugInfo';

// Re-export drawing-related types
export type { 
  DrawingState,
} from './core/DrawingState';
export { createDefaultDrawingState } from './core/DrawingState';

// Re-export geometry types
export type { Point, Size, Rectangle, Line, CanvasDimensions } from './core/Geometry';

// Re-export grid types
export type { 
  GridCreationState, 
  GridCreationLock
} from './core/GridTypes';
export { 
  DEFAULT_GRID_CREATION_STATE,
  DEFAULT_GRID_CREATION_LOCK
} from './core/GridTypes';

// Re-export DrawingTool types - canonical source
export type { DrawingTool } from './core/DrawingTool';
export { 
  isValidDrawingTool, 
  getToolDisplayName, 
  parseDrawingTool, 
  getDefaultDrawingTool 
} from './core/DrawingTool';
export { DrawingMode } from '@/constants/drawingModes';

// Re-export canvas event types
export type { ZoomOptions } from './canvas-events/ZoomTypes';

// Re-export for backwards compatibility
export type { 
  ZoomDirection, 
  PerformanceStats,
  DistanceToolState
} from './drawingTypes';

// Re-export fabric types for easier access
export type {
  FabricCanvas,
  FabricObject,
  FabricBrush,
  FabricLine,
  FabricPoint,
  FabricObjectWithId,
  CustomFabricMouseEvent,
  CustomTouchEvent,
  FabricPointerEvent,
  CanvasReferences
} from './fabric';
export { isTouchEvent, isMouseEvent } from './fabric';
