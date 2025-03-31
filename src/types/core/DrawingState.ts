
/**
 * Drawing state type definitions
 * Centralizes drawing state types to prevent inconsistencies
 * @module types/core/DrawingState
 */
import { Point } from './Geometry';

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
  /** Whether stylus is detected */
  stylusDetected?: boolean;
  /** Whether to use pressure sensitivity */
  usePressure?: boolean;
  /** Whether a selection is active */
  selectionActive?: boolean;
  /** The midpoint between start and current point */
  midPoint?: Point | null;
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
  currentZoom: 1,
  stylusDetected: false,
  usePressure: false,
  selectionActive: false,
  midPoint: null
});
