
/**
 * Debug information type definitions
 * @module types/core/DebugInfo
 */

/**
 * Debug information state interface
 * Contains information about the canvas and grid state for debugging
 */
export interface DebugInfoState {
  /** Whether the canvas was created */
  canvasCreated: boolean;
  /** Whether the canvas was initialized */
  canvasInitialized: boolean;
  /** Whether the brush was initialized */
  brushInitialized: boolean;
  /** Whether dimensions were set */
  dimensionsSet: boolean;
  /** Whether event handlers were set */
  eventHandlersSet: boolean;
  /** Whether the grid was created */
  gridCreated: boolean;
  /** Number of grid objects created */
  gridObjectCount: number;
  /** Current canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  /** Whether the canvas is ready for drawing */
  canvasReady: boolean;
  /** Last error message */
  lastError: string | null;
  /** Timestamp of last refresh */
  lastRefresh: number;
}

/**
 * Default debug information state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasCreated: false,
  canvasInitialized: false,
  brushInitialized: false,
  dimensionsSet: false,
  eventHandlersSet: false,
  gridCreated: false,
  gridObjectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  canvasReady: false,
  lastError: null,
  lastRefresh: Date.now()
};
