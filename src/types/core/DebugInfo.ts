
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
  brushInitialized: false
};
