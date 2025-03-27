
/**
 * Debug information state type
 * @module core/DebugInfo
 */

/**
 * Performance statistics for debugging
 */
export interface PerformanceStats {
  gridCreationTime?: number;
  [key: string]: number | undefined;
}

/**
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether to show debug information */
  showDebugInfo: boolean;
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether canvas dimensions have been set */
  dimensionsSet: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether the brush has been initialized */
  brushInitialized: boolean;
  /** Whether the canvas has been created */
  canvasCreated: boolean;
  /** Whether the canvas has been loaded */
  canvasLoaded: boolean;
  /** Whether the canvas is ready for drawing */
  canvasReady: boolean;
  /** Canvas width */
  canvasWidth: number;
  /** Canvas height */
  canvasHeight: number;
  /** Time of last initialization */
  lastInitTime: number;
  /** Time of last grid creation */
  lastGridCreationTime: number;
  /** Count of grid objects */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Whether there is an error */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: PerformanceStats;
}
