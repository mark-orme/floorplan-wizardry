
export interface DebugInfoState {
  // Core canvas state flags
  dimensionsSet: boolean;
  canvasCreated: boolean;
  gridCreated: boolean;
  canvasLoaded: boolean;
  canvasInitialized: boolean;
  brushInitialized: boolean;
  canvasReady: boolean;
  
  // Canvas dimensions
  canvasWidth: number;
  canvasHeight: number;
  
  // Grid and canvas objects count
  gridObjects?: number;
  canvasObjects?: number;
  
  // Performance tracking
  devicePixelRatio?: number;
  performanceStats?: {
    fps: number;
    droppedFrames: number;
    frameTime: number;
    maxFrameTime: number;
    longFrames: number;
  };
  
  // Error tracking
  lastError?: any;
  lastErrorTime?: number;
  gridCreationAttempts?: number;
  gridCreationFailures?: number;
  lastGridCreationTime?: number;
  dimensionAttempts?: number; // Added missing property
  initTime?: number; // Added missing property for initialization time tracking
  
  // Load times for performance tracking
  loadTimes: Record<string, number>;
}
