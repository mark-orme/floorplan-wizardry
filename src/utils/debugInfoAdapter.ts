
/**
 * Debug Info Adapter
 * Handles conversion between different DebugInfoState types
 */
import { DebugInfoState as CoreDebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';
import { DebugInfoState as DrawingDebugInfoState } from '@/types/drawingTypes';

/**
 * Converts Core DebugInfoState to Drawing DebugInfoState
 */
export const adaptCoreToDrawingDebugInfo = (coreDebugInfo: Partial<CoreDebugInfoState>): DrawingDebugInfoState => {
  // Create a baseline debug state with all required properties
  const baseState: DrawingDebugInfoState = {
    // Include all core required properties
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
    
    // Include all drawing-specific properties
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    canvasEventsRegistered: false,
    canvasReady: false,
    gridObjectCount: 0,
    fps: 0,
    visibleObjectCount: 0,
    zoomLevel: 1,
    gridVisible: true,
    objectsSelectedCount: 0,
    eventHandlersSet: false,
    gridRendered: false,
    toolsInitialized: false
  };
  
  // Merge with incoming partial state
  return {
    ...baseState,
    ...coreDebugInfo
  };
};

/**
 * Converts Drawing DebugInfoState to Core DebugInfoState
 */
export const adaptDrawingToCoreDebugInfo = (drawingDebugInfo: Partial<DrawingDebugInfoState>): CoreDebugInfoState => {
  // Start with default debug state to ensure all properties are present
  const fullDebugState: CoreDebugInfoState = {
    ...DEFAULT_DEBUG_STATE,
    ...drawingDebugInfo,
    // Ensure these required properties are always present
    hasError: drawingDebugInfo.hasError ?? DEFAULT_DEBUG_STATE.hasError,
    errorMessage: drawingDebugInfo.errorMessage ?? DEFAULT_DEBUG_STATE.errorMessage,
    lastInitTime: drawingDebugInfo.lastInitTime ?? DEFAULT_DEBUG_STATE.lastInitTime,
    lastGridCreationTime: drawingDebugInfo.lastGridCreationTime ?? DEFAULT_DEBUG_STATE.lastGridCreationTime,
    currentFps: drawingDebugInfo.fps ?? DEFAULT_DEBUG_STATE.currentFps,
    objectCount: drawingDebugInfo.visibleObjectCount ?? DEFAULT_DEBUG_STATE.objectCount,
    canvasDimensions: DEFAULT_DEBUG_STATE.canvasDimensions,
    flags: DEFAULT_DEBUG_STATE.flags
  };
  
  return fullDebugState;
};
