
/**
 * Drawing state type definition
 * @module core/DrawingState
 */

import type { Point } from './Geometry';
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from 'fabric';

/**
 * Drawing state interface
 * Tracks the current state of drawing operations
 * @interface DrawingState
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
  /** End X coordinate */
  endX?: number;
  /** End Y coordinate */
  endY?: number;
  /** Current path being drawn */
  currentPath?: FabricPath | null;
  /** Whether to use pressure sensitivity */
  usePressure?: boolean;
  /** Whether stylus is detected */
  stylusDetected?: boolean;
  /** Whether path dragging is enabled */
  pathDragging?: boolean;
  /** Whether shape creation is in progress */
  creatingShape?: boolean;
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
  /** Current zoom level for scaling display */
  currentZoom: number;
  /** Array of points for complex drawings */
  points: Point[];
  /** Distance between start and current points in current units */
  distance: number | null;
  /** Whether to snap to grid */
  snapToGrid?: boolean;
  /** Tool type being used */
  toolType?: string;
  /** Line width */
  width?: number;
  /** Line color */
  color?: string;
}

/**
 * Create a default drawing state
 * @returns {DrawingState} A new drawing state with default values
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  zoomLevel: 1,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  currentPath: null,
  usePressure: false,
  stylusDetected: false,
  pathDragging: false,
  creatingShape: false,
  startPoint: null,
  currentPoint: null,
  cursorPosition: null,
  midPoint: null,
  selectionActive: false,
  currentZoom: 1,
  points: [],
  distance: null,
  snapToGrid: true,
  toolType: 'line',
  width: 2,
  color: '#000000'
});
