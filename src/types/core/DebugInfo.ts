
export interface DebugInfoState {
  objectCount: number;
  visibleObjects: number;
  zoomLevel: number;
  fps: number;
  lastRenderTime: number;
  canvasWidth: number;
  canvasHeight: number;
  viewportTransform?: number[];
  gridLines?: number;
  eventListeners?: number;
  memory?: {
    usedHeap?: number;
    totalHeap?: number;
  };
}
