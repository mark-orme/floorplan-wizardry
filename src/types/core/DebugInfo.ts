
export interface DebugInfoState {
  canvasReady: boolean;
  canvasInitialized: boolean;
  canvasCreated: boolean;
  dimensionsSet: boolean;
  gridCreated?: boolean;
  eventHandlersAttached?: boolean;
  activeToolSet?: boolean;
  performanceStats?: {
    fps: number;
    droppedFrames: number;
    frameTime: number;
    maxFrameTime: number;
    longFrames: number;
  };
  fps?: number;
  currentFps?: number;
  brushInitialized?: boolean;
  gridObjectCount?: number;
  objectCount?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasDimensions?: {
    width: number;
    height: number;
  };
  devicePixelRatio?: number;
  lastError?: string;
  lastErrorTime?: number;
  showDebugInfo?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  lastInitTime?: number;
  eventHandlersSet?: boolean;
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  dimensionsSet: false,
  showDebugInfo: process.env.NODE_ENV === 'development'
};
