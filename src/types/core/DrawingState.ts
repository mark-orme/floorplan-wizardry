
/**
 * Drawing state definition
 * @module core/DrawingState
 */
import { Point } from './Point';

/**
 * Represents the current state of drawing
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** The starting point of the drawing */
  startPoint: Point | null;
  /** The current point of the drawing */
  currentPoint: Point | null;
  /** The current cursor position */
  cursorPosition: Point | null;
  /** The midpoint between start and current point */
  midPoint: Point | null;
  /** Whether a selection is active */
  selectionActive: boolean;
  /** Current zoom level for scaling display */
  currentZoom?: number;
  /** Array of all points in the current stroke */
  points?: Point[];
  /** Distance between startPoint and currentPoint */
  distance?: number | null;
}
