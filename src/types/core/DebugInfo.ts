
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  viewportScale: number;
  isDrawingMode: boolean;
  selectionActive: boolean;
  renderedFrames: number;
  canvasReady?: boolean;
  canvasInitialized?: boolean;
  canvasCreated?: boolean;
  dimensionsSet?: boolean;
  gridCreated?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  lastInitTime?: number;
  lastGridCreationTime?: number;
  canvasEventsRegistered?: boolean;
  gridRendered?: boolean;
  toolsInitialized?: boolean;
  // Add performance stats
  performanceStats?: {
    fps: number;
    droppedFrames: number;
    frameTime: number;
    maxFrameTime: number;
    longFrames: number;
  };
  // Add missing properties
  brushInitialized?: boolean;
  gridObjectCount?: number;
  canvasDimensions?: {
    width: number;
    height: number;
  };
  devicePixelRatio?: number;
  lastError?: string;
  lastErrorTime?: number;
}
