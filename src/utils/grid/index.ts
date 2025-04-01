
/**
 * Grid utilities module
 * Exports all grid-related functionality
 * @module utils/grid
 */

// Export from error handling modules
export { 
  GridErrorSeverity, 
  categorizeGridError, 
  GRID_ERROR_MESSAGES 
} from './errorTypes';

export { 
  handleGridCreationError 
} from './errorHandlers';

export { 
  createGridRecoveryPlan 
} from './recoveryPlans';

export { 
  trackGridCreationPerformance 
} from './performanceTracking';

// Export from gridCreationUtils
export {
  ensureGrid
} from './gridRenderers';

// Export from gridRenderers
export {
  createCompleteGrid,
  createSimpleGrid,
  createBasicEmergencyGrid,
  createGrid
} from './gridRenderers';

// Export from gridRetryUtils
export {
  retryWithBackoff,
  executeWithTimeout
} from './gridRetryUtils';

// Export from gridBasics
export {
  clearGrid,
  isCanvasValidForGrid,
  reorderGridObjects
} from './gridBasics';

// Export from simpleGridCreator
export {
  createReliableGrid,
  ensureGridVisibility
} from './simpleGridCreator';

// Export from gridDiagnostics
export {
  runGridDiagnostics,
  applyGridFixes,
  emergencyGridFix
} from './gridDiagnostics';

// Export from exports
export { 
  GridCreation,
  GridValidation,
  GridDebug
} from './exports';

// Export types - Note the "export type" syntax
export type { GridOptions } from './gridRenderers';
