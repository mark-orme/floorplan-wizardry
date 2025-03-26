
/**
 * Type definitions for drawing state
 * Defines core interfaces for tracking drawing state
 * @module drawingStateTypes
 */
import { Point } from './geometryTypes';

/**
 * Represents the current state of drawing
 * Tracks active drawing status, cursor position, and selection state
 * 
 * @typedef {Object} DrawingState
 * @property {boolean} isDrawing - Whether the user is currently drawing
 * @property {Point | null} startPoint - The starting point of the drawing
 * @property {Point | null} currentPoint - The current point of the drawing
 * @property {Point | null} cursorPosition - The current cursor position
 * @property {Point | null} midPoint - The midpoint between start and current point
 * @property {boolean} selectionActive - Whether a selection is active
 * @property {number} [currentZoom] - Current zoom level for scaling display
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
}
