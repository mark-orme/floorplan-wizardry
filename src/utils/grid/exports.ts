
/**
 * Grid exports helper
 * 
 * This file provides a clear way to import grid utilities
 * without ambiguity or naming conflicts.
 * 
 * @module grid/exports
 */

// Direct imports from gridRenderers
import { 
  createGrid,
  ensureGrid,
  createEnhancedGrid,
  validateGrid,
  createBasicEmergencyGrid
} from './gridRenderers';

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
  createBasicEmergencyGrid,
  ensureGrid,
  createEnhancedGrid,
  validateGrid,
  createGrid
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
  createGrid,
  createBasicEmergencyGrid,
  ensureGrid,
  validateCanvas,
  validateGridState,
  dumpGridState,
  forceCreateGrid,
  createEnhancedGrid,
  validateGrid
};
