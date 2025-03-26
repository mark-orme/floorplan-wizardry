
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
  safelyGetCanvasElement,
  isCanvasDisposed
} from './fabric/canvasValidation';

export {
  disposeCanvas,
  forceCleanCanvasElement,
  resetCanvasStateTracker
} from './fabric/canvasCleanup';

export {
  clearCanvasObjects,
  canvasMoveTo
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

