
/**
 * Grid utilities module
 * Re-exports grid functionality from specialized modules
 * @module grid
 */

// Export basic grid operations from core
export { 
  snapToGrid as snapPointToGrid,
  snapToGridPoints as snapPointsToGrid
} from './core';

// Export measurement functions
export * from './measurements';

// Export snapping utilities
export * from './snapping';

// Export safety utilities
export * from './gridSafety';

// Export error handling and validation
export * from './gridErrorHandling';
export * from './gridValidation';
