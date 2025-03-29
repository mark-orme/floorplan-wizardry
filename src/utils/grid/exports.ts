
/**
 * Grid exports helper
 * 
 * This file provides a clear way to import grid utilities
 * without ambiguity or naming conflicts.
 * 
 * @module grid/exports
 */

// Direct named exports from gridCreation
import { 
  createSmallScaleGrid,
  createLargeScaleGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid
} from './gridCreation';

// Direct named exports from gridValidation
import {
  validateGridObjectIntegrity,
  isValidGridLine,
  checkGridConsistency
} from './gridValidation';

// Direct named exports from gridDebugUtils
import {
  logGridCreationAttempt,
  forceCreateGrid,
  analyzeGridPerformance
} from './gridDebugUtils';

// Re-export with clear namespacing
export const GridCreation = {
  createSmallScaleGrid,
  createLargeScaleGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid
};

export const GridValidation = {
  validateGridObjectIntegrity,
  isValidGridLine,
  checkGridConsistency
};

export const GridDebug = {
  logGridCreationAttempt,
  forceCreateGrid,
  analyzeGridPerformance
};

// Also export individual functions for direct import
export {
  createSmallScaleGrid,
  createLargeScaleGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid,
  validateGridObjectIntegrity,
  isValidGridLine,
  checkGridConsistency,
  logGridCreationAttempt,
  forceCreateGrid,
  analyzeGridPerformance
};
