
/**
 * Debug information state
 * Used for tracking initialization and rendering state across components
 */
export interface DebugInfoState {
  /** Whether the canvas element is created */
  canvasCreated: boolean;
  /** Whether the canvas is initialized and ready */
  canvasReady: boolean;
  /** Whether the canvas is fully initialized with Fabric.js */
  canvasInitialized: boolean;
  /** Whether the grid is created */
  gridCreated: boolean;
  /** Count of grid objects */
  gridObjectCount: number;
  /** Whether the canvas dimensions are set */
  dimensionsSet: boolean;
  /** Whether to show debug info */
  showDebugInfo: boolean;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Whether the application has an error */
  hasError: boolean;
  /** Error message if an error occurred */
  errorMessage: string;
  /** Time taken for last initialization */
  lastInitTime: number;
  /** Time taken for last grid creation */
  lastGridCreationTime: number;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether the grid has been rendered */
  gridRendered: boolean;
  /** Whether drawing tools have been initialized */
  toolsInitialized: boolean;
  /** Performance statistics */
  performanceStats?: {
    fps?: number;
    droppedFrames?: number;
    frameTime?: number;
    maxFrameTime?: number;
    longFrames?: number;
    [key: string]: number | undefined;
  };
  /** Count of objects on canvas */
  objectCount?: number;
  /** Canvas width in pixels */
  canvasWidth?: number;
  /** Canvas height in pixels */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Last error object */
  lastError?: any;
  /** Timestamp of last error */
  lastErrorTime?: number;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
}

/**
 * Default debug info state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasCreated: false,
  canvasReady: false,
  canvasInitialized: false,
  gridCreated: false,
  gridObjectCount: 0,
  dimensionsSet: false,
  showDebugInfo: false,
  eventHandlersSet: false,
  brushInitialized: false,
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  canvasDimensions: { width: 0, height: 0 }
};

