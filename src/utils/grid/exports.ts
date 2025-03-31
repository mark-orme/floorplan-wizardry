
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
  ensureGrid,
  createEnhancedGrid
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
  createBasicEmergencyGrid,
  ensureGrid,
  createEnhancedGrid
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
  createBasicEmergencyGrid,
  ensureGrid,
  validateCanvas,
  validateGridState,
  dumpGridState,
  forceCreateGrid,
  createEnhancedGrid
};
