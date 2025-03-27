
/**
 * Debug information state type definitions
 * @module debugTypes
 */

/**
 * Debug information state interface
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to show debug information */
  showDebugInfo: boolean;
  /** Whether canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether dimensions have been set */
  dimensionsSet: boolean;
  /** Grid initialization state */
  gridInitialized?: boolean;
  /** Custom debug messages */
  messages?: string[];
  /** Amount of objects on canvas */
  objectCount?: number;
  /** Canvas dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Current tool */
  currentTool?: string;
  /** Canvas initialization time */
  initTime?: number;
  
  // Additional properties needed for debug info
  /** Whether grid has been created */
  gridCreated?: boolean;
  /** Whether brush has been initialized */
  brushInitialized?: boolean;
  /** Number of grid objects */
  gridObjects?: number;
  /** Number of canvas objects */
  canvasObjects?: number;
  /** Canvas width */
  canvasWidth?: number;
  /** Canvas height */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Last error that occurred */
  lastError?: any;
  /** Timestamp of the last error */
  lastErrorTime?: number;
  /** Whether canvas is ready */
  canvasReady?: boolean;
  /** Whether canvas has been created */
  canvasCreated?: boolean;
  /** Whether canvas has been loaded */
  canvasLoaded?: boolean;
  /** Last initialization time */
  lastInitTime?: number;
  /** Last grid creation time */
  lastGridCreationTime?: number;
  /** Performance statistics */
  performanceStats?: {
    /** Frames per second */
    fps?: number;
    /** Rendering time */
    renderTime?: number;
    /** Grid creation time */
    gridCreationTime?: number;
    /** Object creation time */
    objectCreationTime?: number;
    /** Number of dropped frames */
    droppedFrames?: number;
    /** Average frame time */
    frameTime?: number;
    /** Maximum frame time */
    maxFrameTime?: number;
    /** Number of long frames */
    longFrames?: number;
  };
}
