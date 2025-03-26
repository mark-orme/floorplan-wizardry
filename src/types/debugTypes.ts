
/**
 * Debug info state type for tracking canvas initialization
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether the canvas element is ready */
  canvasReady: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Timestamp of last initialization */
  lastInitTime: number;
  /** Timestamp of last grid creation */
  lastGridCreationTime: number;
  /** Whether canvas dimensions have been set (optional) */
  dimensionsSet?: boolean;
  /** Whether canvas has been initialized (optional) */
  canvasInitialized?: boolean;
}
