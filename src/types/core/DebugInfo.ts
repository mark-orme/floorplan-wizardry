
/**
 * Debug info state interface
 */
export interface DebugInfoState {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  mousePosition?: { x: number; y: number };
  zoomLevel?: number;
  gridSize?: number;
  canvasDimensions?: { width: number; height: number };
  canvasInitialized?: boolean;
  errorMessage?: string;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fps: 0,
  objectCount: 0,
  visibleObjectCount: 0,
  mousePosition: { x: 0, y: 0 },
  zoomLevel: 1,
  gridSize: 20,
  canvasDimensions: { width: 0, height: 0 },
  canvasInitialized: false,
  errorMessage: ''
};

export default DebugInfoState;
