
/**
 * Debug information state
 * @module types/core/DebugInfo
 */

/**
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether an error has occurred */
  hasError: boolean;
  
  /** Error message if an error has occurred */
  errorMessage: string;
  
  /** Timestamp of last initialization */
  lastInitTime: number;
  
  /** Timestamp of last grid creation */
  lastGridCreationTime: number;
  
  /** Current frames per second - needed by debugInfoAdapter */
  currentFps: number;
  
  /** Number of objects in the canvas */
  objectCount: number;
  
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  
  /** Feature flags */
  flags: {
    gridEnabled: boolean;
    snapToGridEnabled: boolean;
    debugLoggingEnabled: boolean;
  };
  
  // Additional properties needed for components
  canvasInitialized?: boolean;
  dimensionsSet?: boolean;
  gridCreated?: boolean;
  canvasEventsRegistered?: boolean;
  canvasReady?: boolean;
  gridObjectCount?: number;
  visibleObjectCount?: number;
  zoomLevel?: number;
  gridVisible?: boolean;
  objectsSelectedCount?: number;
  eventHandlersSet?: boolean;
  gridRendered?: boolean;
  toolsInitialized?: boolean;
  fps?: number;
  lastRefresh?: number;
  
  // Performance metrics
  performanceStats?: {
    renderTime?: number;
    eventHandlingTime?: number;
    objectCreationTime?: number;
    lastFrameTime?: number;
    fps?: number;
    droppedFrames?: number;
    frameTime?: number;
    maxFrameTime?: number;
    longFrames?: number;
  };
  
  // Canvas properties
  canvasWidth?: number;
  canvasHeight?: number;
  devicePixelRatio?: number;
  
  // Error tracking
  lastError?: string;
  lastErrorTime?: number;
  
  // UI flags
  showDebugInfo?: boolean;
  
  // Brush state
  brushInitialized?: boolean;
  
  // Performance summary
  performance?: {
    fps: number;
    memory: number;
    renderTime: number;
  };
  
  // Canvas state properties needed by CanvasControllerEnhanced
  canvasCreated?: boolean;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  currentFps: 0,
  objectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  flags: {
    gridEnabled: true,
    snapToGridEnabled: false,
    debugLoggingEnabled: false
  },
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  canvasEventsRegistered: false,
  canvasReady: false,
  gridObjectCount: 0,
  visibleObjectCount: 0,
  zoomLevel: 1,
  gridVisible: true,
  objectsSelectedCount: 0,
  eventHandlersSet: false,
  gridRendered: false,
  toolsInitialized: false,
  fps: 0,
  lastRefresh: Date.now(),
  // Add newly required fields for compatibility
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
  canvasWidth: 0,
  canvasHeight: 0,
  devicePixelRatio: window.devicePixelRatio || 1,
  lastError: '',
  lastErrorTime: 0,
  showDebugInfo: false,
  brushInitialized: false,
  performance: {
    fps: 0,
    memory: 0,
    renderTime: 0
  },
  canvasCreated: false
};
