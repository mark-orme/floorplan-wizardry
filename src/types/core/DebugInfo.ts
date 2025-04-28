
/**
 * Debug info types
 */

export interface DebugInfoState {
  canvasDimensions: { width: number; height: number };
  objectCount: number;
  selectedObjectCount: number;
  lastRenderTime: number;
  isGridVisible: boolean;
  zoomLevel: number;
  currentTool: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  // Additional properties for the emergency provider
  fpsCounter?: boolean;
  gridHelper?: boolean;
  objectCounter?: boolean;
  renderingStats?: boolean;
  canvasEvents?: boolean;
  memoryUsage?: boolean;
  errorReporting?: boolean;
  canvasInitialized?: boolean;
  lastInitTime?: number;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasDimensions: { width: 0, height: 0 },
  objectCount: 0,
  selectedObjectCount: 0,
  lastRenderTime: 0,
  isGridVisible: true,
  zoomLevel: 1,
  currentTool: 'select',
  isLoading: false,
  hasError: false,
  errorMessage: '',
  fpsCounter: false,
  gridHelper: false,
  objectCounter: false,
  renderingStats: false,
  canvasEvents: false,
  memoryUsage: false,
  errorReporting: true
};
