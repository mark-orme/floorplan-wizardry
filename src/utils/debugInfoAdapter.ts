
/**
 * Debug info adapter
 * Handles compatibility between different DebugInfoState interfaces
 */
import { DebugInfoState as CoreDebugInfoState } from '@/types/core/DebugInfo';
import { DebugInfoState as DrawingDebugInfoState } from '@/types/drawingTypes';

/**
 * Convert core DebugInfoState to drawing DebugInfoState
 */
export const adaptCoreToDrawingDebugInfo = (coreDebugInfo: CoreDebugInfoState): DrawingDebugInfoState => {
  return {
    fps: coreDebugInfo.performanceStats?.fps || 0,
    objectCount: coreDebugInfo.objectCount || 0,
    visibleObjectCount: 0,
    zoomLevel: 1,
    gridVisible: Boolean(coreDebugInfo.gridRendered),
    canvasWidth: coreDebugInfo.canvasWidth || coreDebugInfo.canvasDimensions?.width || 0,
    canvasHeight: coreDebugInfo.canvasHeight || coreDebugInfo.canvasDimensions?.height || 0,
    lastRenderTime: 0,
    eventCount: 0,
    
    // Copy over core properties
    hasError: coreDebugInfo.hasError,
    errorMessage: coreDebugInfo.errorMessage,
    lastInitTime: coreDebugInfo.lastInitTime,
    lastGridCreationTime: coreDebugInfo.lastGridCreationTime,
    canvasEventsRegistered: coreDebugInfo.canvasEventsRegistered,
    gridRendered: coreDebugInfo.gridRendered,
    toolsInitialized: coreDebugInfo.toolsInitialized,
    gridCreated: coreDebugInfo.gridCreated,
    canvasInitialized: coreDebugInfo.canvasInitialized,
    dimensionsSet: coreDebugInfo.dimensionsSet,
    brushInitialized: coreDebugInfo.brushInitialized,
    canvasReady: coreDebugInfo.canvasReady,
    canvasCreated: coreDebugInfo.canvasCreated,
    performanceStats: coreDebugInfo.performanceStats,
    showDebugInfo: coreDebugInfo.showDebugInfo,
    lastError: coreDebugInfo.lastError,
    lastRefresh: coreDebugInfo.lastRefresh,
    lastErrorTime: coreDebugInfo.lastErrorTime
  };
};

/**
 * Convert drawing DebugInfoState to core DebugInfoState
 */
export const adaptDrawingToCoreDebugInfo = (drawingDebugInfo: DrawingDebugInfoState): CoreDebugInfoState => {
  return {
    hasError: drawingDebugInfo.hasError || false,
    errorMessage: drawingDebugInfo.errorMessage || '',
    lastInitTime: drawingDebugInfo.lastInitTime || 0,
    lastGridCreationTime: drawingDebugInfo.lastGridCreationTime || 0,
    canvasEventsRegistered: drawingDebugInfo.canvasEventsRegistered || false,
    gridRendered: drawingDebugInfo.gridRendered || false,
    toolsInitialized: drawingDebugInfo.toolsInitialized || false,
    gridCreated: drawingDebugInfo.gridCreated || false,
    canvasInitialized: drawingDebugInfo.canvasInitialized || false,
    dimensionsSet: drawingDebugInfo.dimensionsSet || false,
    brushInitialized: drawingDebugInfo.brushInitialized || false,
    canvasReady: drawingDebugInfo.canvasReady || false,
    canvasCreated: drawingDebugInfo.canvasCreated || false,
    gridObjectCount: drawingDebugInfo.gridObjectCount || 0,
    objectCount: drawingDebugInfo.objectCount || 0,
    canvasDimensions: {
      width: drawingDebugInfo.canvasWidth || 0,
      height: drawingDebugInfo.canvasHeight || 0
    },
    canvasWidth: drawingDebugInfo.canvasWidth || 0,
    canvasHeight: drawingDebugInfo.canvasHeight || 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    performanceStats: {
      fps: drawingDebugInfo.fps || 0,
      frameTime: 0,
      maxFrameTime: 0,
      longFrames: 0,
      errorCount: 0,
      retryCount: 0
    },
    showDebugInfo: drawingDebugInfo.showDebugInfo || process.env.NODE_ENV === 'development',
    lastError: drawingDebugInfo.lastError || '',
    lastRefresh: drawingDebugInfo.lastRefresh || Date.now()
  };
};
