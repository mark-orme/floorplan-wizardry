
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
  validateGridObjects,
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
  createSmallScaleGrid,
  createLargeScaleGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid
};

export const GridValidation = {
  validateGridObjects,
  validateCanvas,
  validateGridState
};

export const GridDebug = {
  dumpGridState,
  forceCreateGrid
};

// Also export individual functions for direct import
export {
  createSmallScaleGrid,
  createLargeScaleGrid,
  createGridLayer,
  createFallbackGrid,
  createBasicEmergencyGrid,
  validateGridObjects,
  validateCanvas,
  validateGridState,
  dumpGridState,
  forceCreateGrid
};
