
/**
 * Debug information state interface
 */
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  viewportScale: number;
  isDrawingMode: boolean;
  selectionActive: boolean;
  renderedFrames: number;
  canvasReady?: boolean;
  canvasInitialized?: boolean;
  canvasCreated?: boolean;
  dimensionsSet?: boolean;
  gridCreated?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  lastInitTime?: number;
  lastGridCreationTime?: number;
  canvasEventsRegistered?: boolean;
  gridRendered?: boolean;
  toolsInitialized?: boolean;
}

/**
 * Default debug state for initialization
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fps: 0,
  objectCount: 0,
  viewportScale: 1,
  isDrawingMode: false,
  selectionActive: false,
  renderedFrames: 0
};
