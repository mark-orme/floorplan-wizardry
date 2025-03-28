
/**
 * Types related to drawing operations
 * @module types/drawingTypes
 */
import { DrawingMode } from '@/constants/drawingModes';
import { DebugInfoState as CoreDebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';
import { DrawingState as CoreDrawingState, createDefaultDrawingState as originalCreateDefaultDrawingState } from '@/types/core/DrawingState';

/**
 * Point representation
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Canvas dimensions
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
}

/**
 * Re-export DebugInfoState from core
 */
export type DebugInfoState = CoreDebugInfoState;

/**
 * Re-export DrawingState from core
 */
export type DrawingState = CoreDrawingState;

/**
 * Re-export DEFAULT_DEBUG_STATE from core
 */
export { DEFAULT_DEBUG_STATE };

/**
 * Zoom direction enum
 * @type {string}
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom options
 * @interface ZoomOptions
 */
export interface ZoomOptions {
  /** Zoom level */
  level: number;
  /** Zoom center x coordinate */
  centerX?: number;
  /** Zoom center y coordinate */
  centerY?: number;
  /** Whether to skip rendering */
  skipRender?: boolean;
}

/**
 * Create a default drawing state
 * Re-exports the function from core/DrawingState.ts for backward compatibility
 * @returns {DrawingState} A default drawing state
 */
export const createDefaultDrawingState = (): CoreDrawingState => {
  return originalCreateDefaultDrawingState();
};

// Re-export the DrawingMode enum for backwards compatibility
export { DrawingMode };
