
/**
 * Shared type definitions for drawing functionality
 * @module drawingTypes
 */

/**
 * Point coordinates in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Drawing state during interactions
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint?: Point;
  currentPoint?: Point;
  midPoint?: Point;
  cursorPosition?: { x: number; y: number };
  lineLength?: number;
}

/**
 * Grid creation results
 */
export interface GridCreationResult {
  success: boolean;
  gridObjects: any[];
  smallGridLines: any[];
  largeGridLines: any[];
  markers: any[];
}

/**
 * Canvas performance metrics
 */
export interface CanvasLoadTimes {
  startTime: number;
  canvasReady: number;
  gridCreated: number;
}
