
/**
 * Type definitions for drawing state
 * @module drawingStateTypes
 */
import { Point } from './geometryTypes';

/**
 * Represents the current state of drawing
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
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
  selectionActive: boolean;
  currentZoom?: number;
}
