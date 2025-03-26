
export interface DebugInfoState {
  dimensionsSet: boolean;
  canvasCreated: boolean;
  gridCreated: boolean;
  canvasLoaded: boolean;
  canvasInitialized: boolean;
  brushInitialized: boolean;
  canvasWidth: number;
  canvasHeight: number;
  loadTimes: Record<string, number>;
}
