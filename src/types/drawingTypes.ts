
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

// Export Point to make it available to importers of drawingTypes
export type { Point, DrawingState };

// Export other drawing related types here
