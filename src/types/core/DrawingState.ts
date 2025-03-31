
/**
 * Drawing state type definitions
 * @module types/core/DrawingState
 */
import { Point } from "./Point";

/**
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** Current path being drawn */
  currentPath: any | null;
  /** Starting point of the current path */
  pathStartPoint: Point | null;
  /** Current zoom level */
  zoomLevel: number;
  /** Starting point of the current drawing operation */
  startPoint: Point | null;
  /** Current point of the drawing operation */
  currentPoint: Point | null;
  /** Collection of points in the current drawing */
  points: Point[];
  /** Current measured distance */
  distance: number | null;
  /** Current cursor position */
  cursorPosition: Point | null;
  /** Current zoom level (duplicate for compatibility) */
  currentZoom: number;
}

/**
 * Create a default drawing state
 * @returns {DrawingState} Default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  zoomLevel: 1,
  currentPath: null,
  pathStartPoint: null,
  startPoint: null,
  currentPoint: null,
  points: [],
  distance: null,
  cursorPosition: null,
  currentZoom: 1
});
