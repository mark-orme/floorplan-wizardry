
export interface DebugInfoState {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  renderTime?: number;
  eventCount?: number;
  memoryUsage?: number;
  canvasReady?: boolean;
  hasError?: boolean;
  canvasInitialized?: boolean;
  errorMessage?: string;
}
