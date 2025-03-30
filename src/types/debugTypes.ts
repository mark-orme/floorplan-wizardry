
/**
 * Debug information types
 * @module types/debugTypes
 */

/**
 * Performance statistics interface
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of long frames (frames taking longer than 16ms) */
  longFrames?: number;
  /** Additional performance metrics */
  [key: string]: number | undefined;
}

/**
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether the application has an error */
  hasError: boolean;
  /** Error message if an error occurred */
  errorMessage: string;
  /** Time taken for last initialization */
  lastInitTime: number;
  /** Time taken for last grid creation */
  lastGridCreationTime: number;
  /** Whether event handlers have been set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether the grid has been rendered */
  gridRendered: boolean;
  /** Whether drawing tools have been initialized */
  toolsInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Performance statistics */
  performanceStats?: PerformanceStats;
  /** Show debug info flag */
  showDebugInfo?: boolean;
  /** Canvas initialization flag */
  canvasInitialized?: boolean;
  /** Dimensions set flag */
  dimensionsSet?: boolean;
  /** Brush initialized flag */
  brushInitialized?: boolean;
  /** Canvas ready flag */
  canvasReady?: boolean;
  /** Canvas created flag */
  canvasCreated?: boolean;
  /** Canvas loaded flag */
  canvasLoaded?: boolean;
  /** Grid object count */
  gridObjectCount?: number;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Additional debug properties */
  [key: string]: string | number | boolean | object | undefined;
}
