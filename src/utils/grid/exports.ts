
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
  createEnhancedGrid,
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects,
  ensureGrid,
  validateGrid,
  createGridLayer,
  createFallbackGrid,
  hasCompleteGrid,
  forceGridRender,
  createCompleteGrid
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
  ensureGrid
};

export const GridValidation = {
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
  createEnhancedGrid,
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects,
  ensureGrid,
  validateCanvas,
  validateGridState,
  dumpGridState,
  forceCreateGrid,
  validateGrid,
  createGridLayer,
  createFallbackGrid,
  hasCompleteGrid,
  forceGridRender
};
