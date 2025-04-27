
export interface DebugInfoState {
  fpsCounter: boolean;
  gridHelper: boolean;
  objectCounter: boolean;
  renderingStats: boolean;
  canvasEvents: boolean;
  memoryUsage: boolean;
  errorReporting: boolean;
  canvasDimensions: { width: number; height: number };
  canvasInitialized?: boolean;
  lastInitTime?: number;
  dimensionsSet?: boolean;
  gridCreated?: boolean;
  eventHandlersSet?: boolean;
  gridObjectCount?: number;
  hasError?: boolean;
  errorMessage?: string;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fpsCounter: false,
  gridHelper: false,
  objectCounter: false,
  renderingStats: false,
  canvasEvents: false,
  memoryUsage: false,
  errorReporting: true,
  canvasDimensions: { width: 800, height: 600 }
};
