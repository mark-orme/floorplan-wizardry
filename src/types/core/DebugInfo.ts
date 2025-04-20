
/**
 * Debug info state types
 * Provides types for debug information and state
 * @module types/core/DebugInfo
 */

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  /** Whether an error has occurred */
  hasError: boolean;
  
  /** Error message if an error has occurred */
  errorMessage: string;
  
  /** Time taken for last canvas initialization (ms) */
  lastInitTime: number;
  
  /** Time taken for last grid creation (ms) */
  lastGridCreationTime: number;
  
  /** Current rendering FPS */
  currentFps: number;
  
  /** Number of objects in canvas */
  objectCount: number;
  
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  
  /** Additional debug flags */
  flags: {
    /** Whether grid is enabled */
    gridEnabled: boolean;
    /** Whether snap to grid is enabled */
    snapToGridEnabled: boolean;
    /** Whether debug logging is enabled */
    debugLoggingEnabled: boolean;
  };
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
  }
};

/**
 * Debug logger function that only logs in development
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV !== 'production') {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
}
