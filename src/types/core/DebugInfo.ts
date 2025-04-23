
/**
 * Debug info state for canvas
 */
export interface DebugInfoState {
  canvasReady: boolean;
  canvasInitialized: boolean;
  canvasCreated: boolean;
  dimensionsSet: boolean;
  gridCreated?: boolean;
  eventHandlersAttached?: boolean;
  activeToolSet?: boolean;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  dimensionsSet: false,
  gridCreated: false,
  eventHandlersAttached: false,
  activeToolSet: false
};
