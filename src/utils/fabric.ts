
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
  // Fix the import - CanvasDimensions is the interface, not a constant
  // Remove CANVAS_DIMENSIONS from here as it's now in environment.ts
} from './fabric/canvasDimensions';

export {
  isCanvasValid,
  safeGetObjectById,
  safeCanvasContains,
  isCanvasEmpty,
  getCanvasDimensions,
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
