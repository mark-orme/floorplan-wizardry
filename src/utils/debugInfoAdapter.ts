
/**
 * Debug Info Adapter
 * Handles conversion between different DebugInfoState types
 */
import { DebugInfoState as CoreDebugInfoState } from '@/types/core/DebugInfo';
import { DebugInfoState as DrawingDebugInfoState } from '@/types/drawingTypes';

/**
 * Converts Core DebugInfoState to Drawing DebugInfoState
 */
export const adaptCoreToDrawingDebugInfo = (coreDebugInfo: Partial<CoreDebugInfoState>): DrawingDebugInfoState => {
  return {
    // Default values for drawingDebugInfo
    canvasInitialized: false,
    canvasReady: false,
    dimensionsSet: false,
    gridCreated: false,
    hasError: false,
    errorMessage: '',
    gridObjectCount: 0,
    fps: 0,
    visibleObjectCount: 0,
    zoomLevel: 1,
    gridVisible: true,
    objectsSelectedCount: 0,
    lastInitTime: coreDebugInfo.lastInitTime ?? Date.now(), // Use the value from core or default
    lastGridCreationTime: coreDebugInfo.lastGridCreationTime ?? Date.now(), // Use the value from core or default
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false,
    ...coreDebugInfo // Include all core properties
  };
};

/**
 * Converts Drawing DebugInfoState to Core DebugInfoState
 */
export const adaptDrawingToCoreDebugInfo = (drawingDebugInfo: Partial<DrawingDebugInfoState>): CoreDebugInfoState => {
  return {
    // Default values for coreDebugInfo
    canvasInitialized: false,
    canvasReady: false,
    dimensionsSet: false,
    gridCreated: false,
    hasError: false,
    errorMessage: '',
    gridObjectCount: 0,
    lastInitTime: drawingDebugInfo.lastInitTime ?? Date.now(),
    lastGridCreationTime: drawingDebugInfo.lastGridCreationTime ?? Date.now(),
    canvasEventsRegistered: drawingDebugInfo.canvasEventsRegistered ?? false,
    gridRendered: drawingDebugInfo.gridRendered ?? false,
    toolsInitialized: drawingDebugInfo.toolsInitialized ?? false,
    ...drawingDebugInfo // Include all drawing properties
  };
};
