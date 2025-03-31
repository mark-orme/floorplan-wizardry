
/**
 * Drawing state types
 * Defines state interfaces for drawing operations
 * @module types/core/DrawingState
 */
import { Point } from './Geometry';

/**
 * Drawing state interface
 * Contains the current state of drawing operations on the canvas
 */
export interface DrawingState {
  /** Whether a drawing operation is in progress */
  isDrawing: boolean;
  /** Current path being drawn (Fabric.js path object) */
  currentPath: any | null;
  /** Starting point of the current path */
  pathStartPoint: Point | null;
  /** Current zoom level of the canvas */
  zoomLevel: number;
  /** Starting point for measurements/shapes */
  startPoint: Point | null;
  /** Current point during drawing operation */
  currentPoint: Point | null;
  /** Collection of points for complex paths */
  points: Point[];
  /** Current measured distance (for measurement tool) */
  distance: number | null;
  /** Current cursor position on canvas */
  cursorPosition: Point | null;
  /** Alias for zoom level for backward compatibility */
  currentZoom: number;
}

/**
 * Create a default drawing state with initial values
 * @returns A new DrawingState object with default values
 */
export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    currentPath: null,
    pathStartPoint: null,
    zoomLevel: 1,
    startPoint: null,
    currentPoint: null,
    points: [],
    distance: null,
    cursorPosition: null,
    currentZoom: 1
  };
}
