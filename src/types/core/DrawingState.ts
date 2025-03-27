
/**
 * Drawing state type definition
 * @module core/DrawingState
 */

import type { Point } from './Geometry';

/**
 * Drawing state interface
 * Tracks the current state of drawing operations
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** Starting point of the current drawing operation */
  startPoint: Point | null;
  /** Current point of the drawing operation */
  currentPoint: Point | null;
  /** Current cursor position */
  cursorPosition?: Point | null;
  /** Mid point between start and current points */
  midPoint: Point | null;
  /** Whether selection is active */
  selectionActive: boolean;
  /** Current zoom level */
  currentZoom: number;
  /** Array of points for complex drawings */
  points: Point[];
  /** Distance between start and current points in current units */
  distance: number | null;
}
