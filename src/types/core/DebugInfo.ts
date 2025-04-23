
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
  canvasWidth?: number;
  canvasHeight?: number;
  devicePixelRatio?: number;
  lastError?: string;
  lastErrorTime?: number;
  currentFps?: number;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  fps: 0,
  objectCount: 0,
  viewportScale: 1,
  isDrawingMode: false,
  selectionActive: false,
  renderedFrames: 0,
  performanceStats: {
    fps: 0,
    droppedFrames: 0,
    frameTime: 0,
    maxFrameTime: 0,
    longFrames: 0
  }
};
