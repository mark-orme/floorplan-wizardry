
/**
 * Debug info adapter
 * Converts debug info between interfaces and provides formatting
 * @module utils/debugInfoAdapter
 */
import { DebugInfoState } from '@/types/core/DebugInfo';

/**
 * Create a debug info state with default values
 * @returns A new debug info state
 */
export const createDebugInfoState = (): DebugInfoState => {
  return {
    hasError: false,
    errorMessage: '',
    lastInitTime: Date.now(),
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
    // Additional properties for compatibility
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
    }
  };
};

/**
 * Format debug info for display
 * @param debugInfo The debug info to format
 * @returns Formatted debug info
 */
export const formatDebugInfo = (debugInfo: DebugInfoState): Record<string, string> => {
  return {
    hasError: String(debugInfo.hasError),
    errorMessage: debugInfo.errorMessage,
    lastInitTime: new Date(debugInfo.lastInitTime).toLocaleTimeString(),
    lastGridCreationTime: debugInfo.lastGridCreationTime 
      ? new Date(debugInfo.lastGridCreationTime).toLocaleTimeString() 
      : 'Not created',
    currentFps: String(debugInfo.currentFps || 0),
    objectCount: String(debugInfo.objectCount),
    canvasDimensions: `${debugInfo.canvasDimensions.width}x${debugInfo.canvasDimensions.height}`,
    gridEnabled: String(debugInfo.flags.gridEnabled),
    snapToGridEnabled: String(debugInfo.flags.snapToGridEnabled),
    debugLoggingEnabled: String(debugInfo.flags.debugLoggingEnabled)
  };
};

/**
 * Update debug info with new values
 * @param prevState Previous debug info state
 * @param updates Updates to apply
 * @returns Updated debug info state
 */
export const updateDebugInfo = (
  prevState: DebugInfoState, 
  updates: Partial<DebugInfoState>
): DebugInfoState => {
  return {
    ...prevState,
    ...updates,
    flags: {
      ...prevState.flags,
      ...(updates.flags || {})
    },
    canvasDimensions: {
      ...prevState.canvasDimensions,
      ...(updates.canvasDimensions || {})
    },
    performanceStats: {
      ...prevState.performanceStats,
      ...(updates.performanceStats || {})
    }
  };
};
