
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
 * @property {number} zoomLevel - Current zoom level
 * @property {number} lastX - Last X coordinate
 * @property {number} lastY - Last Y coordinate
 * @property {number} startX - Start X coordinate
 * @property {number} startY - Start Y coordinate
 * @property {any} currentPath - Current path being drawn
 * @property {boolean} usePressure - Whether to use pressure sensitivity
 * @property {boolean} stylusDetected - Whether stylus is detected
 * @property {boolean} pathDragging - Whether path dragging is enabled
 * @property {boolean} creatingShape - Whether shape creation is in progress
 * @property {Point | null} startPoint - The starting point of the drawing
 * @property {Point | null} currentPoint - The current point of the drawing
 * @property {Point | null} cursorPosition - The current cursor position
 * @property {Point | null} midPoint - The midpoint between start and current point
 * @property {boolean} selectionActive - Whether a selection is active
 * @property {number} currentZoom - Current zoom level for scaling display
 * @property {Point[]} points - Array of all points in the current stroke
 * @property {number | null} distance - Distance between startPoint and currentPoint
 */
export interface DrawingState {
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** Current zoom level */
  zoomLevel: number;
  /** Last X coordinate */
  lastX: number;
  /** Last Y coordinate */
  lastY: number;
  /** Start X coordinate */
  startX: number;
  /** Start Y coordinate */
  startY: number;
  /** Current path being drawn */
  currentPath: any | null;
  /** Whether to use pressure sensitivity */
  usePressure: boolean;
  /** Whether stylus is detected */
  stylusDetected: boolean;
  /** Whether path dragging is enabled */
  pathDragging: boolean;
  /** Whether shape creation is in progress */
  creatingShape: boolean;
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
  currentZoom: number;
  /** Array of all points in the current stroke */
  points: Point[];
  /** Distance between startPoint and currentPoint */
  distance: number | null;
}
