
export interface DebugInfoState {
  fpsCounter: boolean;
  gridHelper: boolean;
  objectCounter: boolean;
  renderingStats: boolean;
  canvasEvents: boolean;
  memoryUsage: boolean;
  errorReporting: boolean;
  canvasInitialized?: boolean;
  dimensionsSet?: boolean;
  gridCreated?: boolean;
  eventHandlersSet?: boolean;
  gridObjectCount?: number;
  hasError?: boolean;
  errorMessage?: string;
  lastInitTime?: number;
  canvasDimensions?: { width: number; height: number };
}

export interface RenderingStats {
  fps: number;
  objectCount: number;
  renderTime: number;
  lastUpdate: number;
}

export interface CanvasEventLog {
  eventType: string;
  timestamp: number;
  details?: string;
}

export interface PerformanceMetrics {
  fps: number;
  renderDuration: number;
  objectCount: number;
  throttled: boolean;
  lastUpdate: number;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fpsCounter: false,
  gridHelper: false,
  objectCounter: false,
  renderingStats: false,
  canvasEvents: false,
  memoryUsage: false,
  errorReporting: true,
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  eventHandlersSet: false,
  gridObjectCount: 0,
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  canvasDimensions: { width: 0, height: 0 }
};
