
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
    ...drawingDebugInfo // Include all drawing properties
  };
};
