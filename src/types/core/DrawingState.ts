
/**
 * Drawing state definition
 * @module types/core/DrawingState
 */
import { Object as FabricObject } from "fabric";

/**
 * Represents a point in 2D space
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  /** Whether user is currently drawing */
  isDrawing: boolean;
  /** Current path being drawn */
  currentPath: FabricObject | null;
  /** Starting point of current path */
  pathStartPoint: Point | null;
  /** Current zoom level */
  zoomLevel: number;
  /** Starting point for tools like lines, rectangles */
  startPoint: Point | null;
  /** Current point for interactive drawing */
  currentPoint: Point | null;
  /** Collection of points for multi-point operations */
  points: Point[];
  /** Distance measurement for measure tool */
  distance: number | null;
  /** Current cursor position on canvas */
  cursorPosition: Point | null;
  /** Current zoom factor */
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
