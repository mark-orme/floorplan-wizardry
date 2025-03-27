
/**
 * Debug-related type definitions
 * @module types/debugTypes
 */

/**
 * Debug information state
 */
export interface DebugInfoState {
  /** Whether canvas is initialized */
  canvasInitialized: boolean;
  /** Whether dimensions are set */
  dimensionsSet: boolean;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Whether to show debug info */
  showDebugInfo: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas is created */
  canvasCreated: boolean;
  /** Whether canvas is loaded */
  canvasLoaded: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Error state */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: {
    fps?: number;
    frameTime?: number;
    objectCount?: number;
    renderTime?: number;
    [key: string]: number | undefined;
  };
  /** Any additional debug info */
  [key: string]: boolean | number | string | object | undefined;
}

/**
 * Debug initialization state
 */
export interface DebugInitState {
  /** Whether initialization is in progress */
  initializationInProgress: boolean;
  /** Current initialization step */
  currentStep: string;
  /** Last error message */
  lastError: string | null;
  /** Initialization start time */
  startTime: number;
  /** Elapsed time in ms */
  elapsedTime: number;
}

/**
 * Debug grid state
 */
export interface DebugGridState {
  /** Number of small grid lines */
  smallGridLineCount: number;
  /** Number of large grid lines */
  largeGridLineCount: number;
  /** Total number of grid objects */
  totalGridObjects: number;
  /** Whether grid is locked */
  gridLocked: boolean;
  /** Grid creation time in ms */
  creationTime: number;
}
