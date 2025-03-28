
/**
 * Fabric.js utilities
 * Central export for all fabric-related utility functions
 * @module utils/fabric
 */

// Export all canvas validation utilities
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
export * from './fabric/canvasCleanup';

// Re-export any additional fabric utilities
export * from './fabric/canvasObjectUtils';
export * from './fabric/canvasSerializationUtils';
