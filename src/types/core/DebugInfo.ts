
export interface DebugInfoState {
  fpsCounter: boolean;
  gridHelper: boolean;
  objectCounter: boolean;
  renderingStats: boolean;
  canvasEvents: boolean;
  memoryUsage: boolean;
  errorReporting: boolean;
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
