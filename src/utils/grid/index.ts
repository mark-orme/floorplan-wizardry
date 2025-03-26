
/**
 * Grid utilities module
 * Re-exports grid functionality from specialized modules
 * @module grid
 */

// Export basic grid operations
export { 
  createGrid,
  createGridLines,
  createGridWithSize,
  disposeGrid
} from './core';

// Export grid snapping functions with explicit names
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
