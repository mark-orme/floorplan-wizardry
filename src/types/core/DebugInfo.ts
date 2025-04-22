
/**
 * Debug information structure for canvas components
 */

export interface DebugInfoState {
  canvasReady: boolean;
  canvasInitialized: boolean;
  canvasCreated: boolean;
  gridCreated: boolean;
  gridVisible: boolean;
  drawingToolsReady: boolean;
  dimensionsSet: boolean;
  eventHandlersAttached: boolean;
  canvasEventsRegistered: boolean;
  gridRendered: boolean;
  toolsInitialized: boolean;
  hasError: boolean;
  errorMessage: string;
  canvasDimensions?: { width: number; height: number };
  lastInitTime: number;
  lastGridCreationTime: number;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  gridCreated: false,
  gridVisible: true,
  drawingToolsReady: false,
  dimensionsSet: false,
  eventHandlersAttached: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0
};
