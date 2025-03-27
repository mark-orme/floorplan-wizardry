
/**
 * Types related to debugging and diagnostics
 * @module types/debugTypes
 */

/**
 * Canvas dimensions structure
 */
export interface CanvasDimensions {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Performance statistics for tracking canvas performance
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Count of frames taking longer than target */
  longFrames?: number;
  /** Count of dropped frames */
  droppedFrames?: number;
  /** Memory usage in MB */
  memory?: number;
  /** Count of objects on canvas */
  objectCount?: number;
  /** Count of draw calls per frame */
  drawCalls?: number;
  /** Time spent rendering in milliseconds */
  renderTime?: number;
  /** Time spent processing events in milliseconds */
  eventTime?: number;
  /** Count of errors encountered */
  errorCount?: number;
  /** Count of retry attempts */
  retryCount?: number;
  [key: string]: number | undefined;
}

/**
 * Debug information state
 */
export interface DebugInfoState {
  /** Whether debug info is displayed */
  showDebugInfo: boolean;
  /** Whether canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether dimensions have been set */
  dimensionsSet: boolean;
  /** Whether grid has been created */
  gridCreated: boolean;
  /** Whether brush has been initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready for interaction */
  canvasReady: boolean;
  /** Whether canvas has been created */
  canvasCreated: boolean;
  /** Whether canvas has been loaded */
  canvasLoaded: boolean;
  /** Time of last initialization in ms since epoch */
  lastInitTime: number;
  /** Time of last grid creation in ms since epoch */
  lastGridCreationTime: number;
  /** Count of grid objects */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Whether an error has occurred */
  hasError: boolean;
  /** Error message if an error occurred */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: PerformanceStats;
  /** Whether grid has been initialized (optional) */
  gridInitialized?: boolean;
  /** Debug messages (optional) */
  messages?: string[];
  /** Count of objects on canvas (optional) */
  objectCount?: number;
  /** Canvas dimensions (optional) */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Currently active tool (optional) */
  currentTool?: string;
  /** Time taken for initialization in ms (optional) */
  initTime?: number;
  /** Count of grid objects (optional) */
  gridObjects?: number;
  /** Count of canvas objects (optional) */
  canvasObjects?: number;
  /** Canvas width (optional) */
  canvasWidth?: number;
  /** Canvas height (optional) */
  canvasHeight?: number;
  /** Device pixel ratio (optional) */
  devicePixelRatio?: number;
  /** Last error (optional) */
  lastError?: any;
  /** Time of last error in ms since epoch (optional) */
  lastErrorTime?: number;
}

/**
 * Point coordinate definition
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Drawing state information
 */
export interface DrawingState {
  /** Whether drawing is in progress */
  isDrawing: boolean;
  /** Starting point of the drawing operation */
  startPoint: Point | null;
  /** Current point of the drawing operation */
  currentPoint: Point | null;
  /** Middle point for operations requiring it */
  midPoint: Point | null;
  /** Whether a selection is currently active */
  selectionActive: boolean;
  /** Current zoom level */
  currentZoom: number;
  /** Collection of points for the current drawing operation */
  points: Point[];
  /** Distance measurement (if applicable) */
  distance: number | null;
  /** Current cursor position (optional) */
  cursorPosition?: Point | null;
}
