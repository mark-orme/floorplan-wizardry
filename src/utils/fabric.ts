
/**
 * Fabric.js utilities
 * Central export for all fabric-related utility functions
 * @module utils/fabric
 */

// Export canvas validation utilities
export {
  isValidObjectId,
  doesObjectExist,
  getObjectById,
  safeGetObjectById,
  isCanvasValid,
  safeCanvasContains,
  isCanvasEmpty,
  verifyCanvasConfiguration,
  safelyGetCanvasElement,
  isCanvasDisposed
} from './fabric/canvasValidation';

// Export object utilities
export * from './fabric/objects';

// Export cleanup utilities
export {
  clearCanvas,
  disposeCanvas,
  removeObjectsFromCanvas,
  resetCanvasTransform,
  isCanvasElementInitialized,
  markCanvasAsInitialized,
  isCanvasElementInDOM
} from './fabric/canvasCleanup';

// Export dimension utilities
export {
  setCanvasDimensions,
  resizeCanvasToContainer,
  zoomCanvas,
  getCanvasDimensions
} from './fabric/canvasDimensions';

// Export selection utilities
export {
  enableSelection,
  disableSelection
} from './fabric/selection';

// Re-export any additional fabric utilities
export * from './fabric/canvasObjectUtils';
export * from './fabric/canvasSerializationUtils';

// Re-export point converter utilities
export * from './fabricPointConverter';
