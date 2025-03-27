
/**
 * Drawing type definitions
 * Common types used for drawing operations
 * @module drawingTypes
 */

/**
 * Point interface representing a 2D coordinate
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Drawing state interface
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether currently drawing */
  isDrawing: boolean;
  /** Starting point of the drawing */
  startPoint: Point | null;
  /** Current point of the drawing */
  currentPoint: Point | null;
  /** Midpoint for calculations */
  midPoint: Point | null;
  /** Array of all points in the current stroke */
  points: Point[];
}

/**
 * Debug information state
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether grid was created successfully */
  gridCreated: boolean;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Timestamp of last grid creation */
  lastGridCreationTime: number;
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  /** Error state */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
}

/**
 * Drawing operation mode
 * @type {DrawingMode}
 */
export type DrawingMode = 
  | 'draw'           // Free drawing
  | 'line'           // Straight line
  | 'rectangle'      // Rectangle
  | 'circle'         // Circle
  | 'polygon'        // Polygon
  | 'wall'           // Wall (architectural)
  | 'room'           // Room (architectural)
  | 'text'           // Text annotation
  | 'measure'        // Measurement
  | 'select'         // Selection
  | 'pan'            // Pan view
  | 'erase';         // Erase elements

/**
 * Operation result with status
 * @interface OperationResult
 */
export interface OperationResult<T> {
  /** Operation success status */
  success: boolean;
  /** Operation result data */
  data?: T;
  /** Error message if operation failed */
  error?: string;
}
