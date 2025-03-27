
/**
 * Fabric.js utilities module
 * Provides a clean API for working with Fabric.js canvas and objects
 * @module fabric
 */

// Re-export only needed functionality from sub-modules
// This pattern prevents alias confusion and circular references

// Core canvas dimension utilities
export {
  setCanvasDimensions,
  getCanvasDimensions,
  resizeCanvasToContainer
} from './fabric/canvasDimensions';

// Canvas validation utilities
export {
  isCanvasValid,
  safeGetObjectById,
  safeCanvasContains,
  isCanvasEmpty,
  verifyCanvasConfiguration,
  safelyGetCanvasElement,
  isCanvasDisposed
} from './fabric/canvasValidation';

// Canvas cleanup utilities
export {
  clearCanvas,
  disposeCanvas,
  removeObjectsFromCanvas,
  resetCanvasTransform,
  forceCleanCanvasElement,
  resetCanvasStateTracker,
  isCanvasElementInitialized,
  markCanvasAsInitialized, // Fixed the name to match export
  isCanvasElementInDOM
} from './fabric/canvasCleanup';

// Object manipulation utilities
export {
  clearCanvasObjects,
  canvasMoveTo,
  bringObjectToFront,
  sendObjectToBack
} from './fabric/objects';

// Canvas registry functions
export {
  registerCanvasElement,
  isCanvasRegistered,
  getCanvasRegistration
} from './fabric/registry';

// Environment variables and constants
export {
  getEnvVars,
  CANVAS_DIMENSIONS
} from './fabric/environment';

// Selection mode utilities
export {
  enableSelection,
  disableSelection
} from './fabric/selection';

// Event type checking utilities
export {
  isTouchEvent,
  isMouseEvent,
  isKeyboardEvent,
  extractClientCoordinates,
  getTouchCount,
  isIOSPlatform,
  applyIOSEventFixes
} from './fabric/events';

// Export touch/gesture event functions without internal implementation details
export {
  initializeCanvasGestures
} from './fabric/gestures';

// Brush-related utilities
export { 
  initializeDrawingBrush, 
  addPressureSensitivity 
} from './fabricBrush';

