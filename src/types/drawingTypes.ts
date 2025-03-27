
/**
 * Drawing information state type definitions
 * @module drawingTypes
 */

import { Point } from './core/Geometry';
import { PerformanceStats } from './core/DebugInfo';
import { DrawingState } from './core/DrawingState';

/**
 * Drawing mode enumeration
 */
export enum DrawingMode {
  /** Free drawing mode */
  FREE = 'free',
  /** Line drawing mode */
  LINE = 'line',
  /** Rectangle drawing mode */
  RECTANGLE = 'rectangle',
  /** Circle drawing mode */
  CIRCLE = 'circle',
  /** Text insertion mode */
  TEXT = 'text',
  /** Selection mode */
  SELECT = 'select'
}

// Export Point, DrawingState and other core types to make them available to importers of drawingTypes
export type { Point, DrawingState, PerformanceStats };
export type { DebugInfoState } from './core/DebugInfo';
export type { CanvasDimensions } from './core/Geometry';
