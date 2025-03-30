
/**
 * Grid exports helper
 * 
 * This file provides a clear way to import grid utilities
 * without ambiguity or naming conflicts.
 * 
 * @module grid/exports
 */

// Direct imports from gridCreationUtils
import { 
  createBasicEmergencyGrid,
  createCompleteGrid,
  verifyGridExists,
  validateGrid,
  retryWithBackoff,
  reorderGridObjects,
  ensureGrid,
  createGridLayer,
  createFallbackGrid,
  hasCompleteGrid,
  forceGridRender
} from '../gridCreationUtils';

// Direct named exports from gridValidation
import {
  validateCanvas,
  validateGridState
} from './gridValidation';

// Direct named exports from gridDebugUtils
import {
  dumpGridState,
  forceCreateGrid
} from './gridDebugUtils';

// Re-export with clear namespacing
export const GridCreation = {
  createSmallScaleGrid: createCompleteGrid,
  createLargeScaleGrid: createCompleteGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid
};

export const GridValidation = {
  validateGridObjects: validateGrid,
  validateCanvas,
  validateGridState
};

export const GridDebug = {
  dumpGridState,
  forceCreateGrid
};

// Also export individual functions for direct import
export {
  createCompleteGrid,
  createBasicEmergencyGrid,
  validateGrid,
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects,
  ensureGrid,
  createGridLayer,
  createFallbackGrid,
  validateCanvas,
  validateGridState,
  dumpGridState,
  forceCreateGrid,
  hasCompleteGrid,
  forceGridRender
};
