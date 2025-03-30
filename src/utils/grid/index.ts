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
  ensureGrid,
  verifyGridExists,
  validateGrid,
  reorderGridObjects
} from './gridCreationUtils';

// Export from gridRenderers
export {
  createBasicEmergencyGrid,
  createCompleteGrid,
  createEnhancedGrid
} from './gridRenderers';

// Export from gridRetryUtils
export {
  retryWithBackoff,
  executeWithTimeout
} from './gridRetryUtils';

// Export from gridBasics
export {
  createBasicGrid,
  clearGrid,
  isCanvasValidForGrid,
  createSimpleGrid
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

// Export types
export type { GridOptions } from '../canvasGrid';
