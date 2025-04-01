
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
  createCompleteGrid,
  validateGrid,
  createBasicEmergencyGrid,
  createGrid,
  ensureGrid
} from './gridRenderers';

// Direct named exports from gridValidation
import {
  isCanvasValidForGrid as validateCanvas,
  isGridValid as validateGridState
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
  createCompleteGrid,
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
  createCompleteGrid,
  validateGrid
};
