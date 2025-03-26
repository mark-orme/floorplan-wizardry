
/**
 * Re-exports all Fabric.js utilities
 * @module fabric
 */

// Export from fabricBrush
export { initializeDrawingBrush, addPressureSensitivity } from './fabricBrush';

// Export from fabric modules directory
export * from './fabric/index';

// Individual exports for backward compatibility
export { 
  setCanvasDimensions,
  getCanvasDimensions,
  resizeCanvasToContainer
} from './fabric/canvasDimensions';

export {
  isCanvasValid,
  safeGetObjectById,
  safeCanvasContains,
  isCanvasEmpty,
  verifyCanvasConfiguration,
  safelyGetCanvasElement,
  isCanvasDisposed
} from './fabric/canvasValidation';

export {
  clearCanvas,
  disposeCanvas,
  removeObjectsFromCanvas,
  resetCanvasTransform,
  forceCleanCanvasElement,
  resetCanvasStateTracker,
  isCanvasElementInitialized,
  markCanvasAsInitialized,
  isCanvasElementInDOM
} from './fabric/canvasCleanup';

export {
  clearCanvasObjects,
  canvasMoveTo,
  bringObjectToFront,
  sendObjectToBack
} from './fabric/objects';

export {
  registerCanvasElement,
  isCanvasRegistered,
  getCanvasRegistration
} from './fabric/registry';

export {
  getEnvVars,
  CANVAS_DIMENSIONS
} from './fabric/environment';
