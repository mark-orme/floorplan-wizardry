
/**
 * Grid utilities module
 * Re-exports grid functionality from specialized modules
 * @module grid
 */

// Export basic grid operations from core
export { 
  snapToGrid,
  // Export other available functions from core without referencing snapToGridPoints
} from './core';

// Export measurement functions 
export * from './measurements';

// Export snapping utilities - explicitly export to avoid ambiguity
export {
  snapToGrid,
  snapToAngle,
  snapWithThreshold,
  getNearestGridIntersection,
  snapLineToStandardAngles,
  // Don't re-export distanceToNearestGridLine since it's also in measurements
} from './snapping';

// Export safety utilities
export * from './gridSafety';

// Export error handling and validation
export * from './gridErrorHandling';
export * from './gridValidation';

// Export grid creation utilities
export * from './gridCreation';

// Export type utilities
export * from './typeUtils';
