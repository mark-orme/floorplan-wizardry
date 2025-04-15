
/**
 * Debug information state
 * Tracks various debugging metrics for the canvas
 */
export interface DebugInfoState {
  /** Whether there's an error */
  hasError: boolean;
  /** Error message if any */
  errorMessage: string;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Whether event handlers are set */
  eventHandlersSet?: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Whether grid is created */
  gridCreated?: boolean;
  /** Whether canvas is initialized */
  canvasInitialized?: boolean;
  /** Whether dimensions are set */
  dimensionsSet?: boolean;
  /** Whether brush is initialized */
  brushInitialized?: boolean;
  /** Whether canvas is ready */
  canvasReady?: boolean;
  /** Whether canvas is created */
  canvasCreated?: boolean;
  /** Number of grid objects */
  gridObjectCount?: number;
  /** Canvas dimensions */
  canvasDimensions?: {
    width: number;
    height: number;
  };
  /** Last error */
  lastError?: string;
  /** Last error time */
  lastErrorTime?: number;
  /** Last refresh time */
  lastRefresh?: number;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  gridCreated: false,
  canvasInitialized: false,
  dimensionsSet: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  gridObjectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  lastError: '',
  lastRefresh: Date.now()
};
