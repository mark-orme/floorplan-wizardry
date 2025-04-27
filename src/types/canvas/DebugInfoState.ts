
/**
 * Debug information state interface
 * @module types/canvas/DebugInfoState
 */

/**
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether to show FPS counter */
  fpsCounter: boolean;
  /** Whether to show grid helper */
  gridHelper: boolean;
  /** Whether to show object counter */
  objectCounter: boolean;
  /** Whether to show rendering stats */
  renderingStats: boolean;
  /** Whether to show canvas events */
  canvasEvents: boolean;
  /** Whether to show memory usage */
  memoryUsage: boolean;
  /** Whether to show error reporting */
  errorReporting: boolean;
  /** Current canvas dimensions */
  canvasDimensions?: { width: number; height: number };
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fpsCounter: false,
  gridHelper: false,
  objectCounter: false,
  renderingStats: false,
  canvasEvents: false,
  memoryUsage: false,
  errorReporting: true,
  canvasDimensions: { width: 0, height: 0 }
};
