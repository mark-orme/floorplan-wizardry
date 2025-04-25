
/**
 * Debug information state for canvas components
 */
export interface DebugInfoState {
  canvasReady?: boolean;
  canvasInitialized?: boolean;
  canvasCreated?: boolean;
  dimensionsSet?: boolean;
  errorCount?: number;
  lastError?: string;
  logs?: string[];
  metrics?: {
    fps?: number;
    objects?: number;
    renders?: number;
  };
}

/**
 * Default debug state with initial values
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  dimensionsSet: false,
  errorCount: 0,
  logs: [],
  metrics: {
    fps: 0,
    objects: 0,
    renders: 0
  }
};
