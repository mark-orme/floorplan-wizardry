
/**
 * Debug information state for canvas controller
 */
export interface DebugInfoState {
  canvasInitialized: boolean;
  dimensionsSet: boolean;
  gridCreated: boolean;
  eventHandlersSet: boolean;
  brushInitialized: boolean;
  canvasReady?: boolean;
}

/**
 * Create default debug info state
 * @returns Default debug info state
 */
export function createDefaultDebugInfoState(): DebugInfoState {
  return {
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    eventHandlersSet: false,
    brushInitialized: false,
    canvasReady: false,
  };
}
