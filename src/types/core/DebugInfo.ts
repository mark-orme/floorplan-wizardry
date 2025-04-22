
/**
 * Debug information structure for canvas components
 */

export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of long frames (frames taking longer than 16ms) */
  longFrames?: number;
  /** Render time in milliseconds */
  renderTime?: number;
  /** Event handling time in milliseconds */
  eventHandlingTime?: number;
  /** Object creation time in milliseconds */
  objectCreationTime?: number;
  /** Last frame time in milliseconds */
  lastFrameTime?: number;
  /** Additional performance metrics */
  [key: string]: number | undefined;
}

export interface DebugInfoState {
  canvasReady: boolean;
  canvasInitialized: boolean;
  canvasCreated: boolean;
  gridCreated: boolean;
  gridVisible: boolean;
  drawingToolsReady: boolean;
  dimensionsSet: boolean;
  eventHandlersAttached: boolean;
  canvasEventsRegistered: boolean;
  gridRendered: boolean;
  toolsInitialized: boolean;
  hasError: boolean;
  errorMessage: string;
  canvasDimensions?: { width: number; height: number };
  lastInitTime: number;
  lastGridCreationTime: number;
  
  // Extended properties to match component usage
  fps: number;
  currentFps: number;
  performanceStats: PerformanceStats;
  objectCount: number;
  gridObjectCount: number;
  visibleObjectCount: number;
  zoomLevel: number;
  objectsSelectedCount: number;
  eventHandlersSet: boolean;
  brushInitialized: boolean;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio: number;
  showDebugInfo: boolean;
  lastError: string;
  lastErrorTime: number;
  flags: {
    gridEnabled: boolean;
    snapToGridEnabled: boolean;
    debugLoggingEnabled: boolean;
  };
}

export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  gridCreated: false,
  gridVisible: true,
  drawingToolsReady: false,
  dimensionsSet: false,
  eventHandlersAttached: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  performanceStats: {
    renderTime: 0,
    eventHandlingTime: 0,
    objectCreationTime: 0,
    lastFrameTime: 0,
    fps: 0,
    droppedFrames: 0,
    frameTime: 0,
    maxFrameTime: 0,
    longFrames: 0
  },
  fps: 0,
  currentFps: 0,
  objectCount: 0,
  gridObjectCount: 0,
  visibleObjectCount: 0,
  zoomLevel: 1,
  objectsSelectedCount: 0,
  eventHandlersSet: false,
  brushInitialized: false,
  canvasWidth: 0,
  canvasHeight: 0,
  devicePixelRatio: window.devicePixelRatio || 1,
  showDebugInfo: false,
  lastError: '',
  lastErrorTime: 0,
  canvasDimensions: { width: 0, height: 0 },
  flags: {
    gridEnabled: true,
    snapToGridEnabled: false,
    debugLoggingEnabled: false
  }
};
