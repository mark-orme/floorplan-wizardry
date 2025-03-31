
import { Point } from './Point';

/**
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  /** Whether currently drawing */
  isDrawing: boolean;
  /** Current path being drawn */
  currentPath: any | null;
  /** Starting point of the path */
  pathStartPoint: Point | null;
  /** Current zoom level */
  zoomLevel: number;
  /** Starting point */
  startPoint: Point | null;
  /** Current point */
  currentPoint: Point | null;
  /** Collection of points */
  points: Point[];
  /** Current distance measurement */
  distance: number | null;
  /** Current cursor position */
  cursorPosition: Point | null;
  /** Current zoom */
  currentZoom: number;
}

/**
 * Create a default drawing state
 * @returns {DrawingState} A new drawing state with default values
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
