
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
  
  /** Current frames per second */
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
  
  // Additional properties for DrawingDebugInfoState compatibility
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
  lastRefresh: Date.now()
};
