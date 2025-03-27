
/**
 * Grid utilities module
 * Re-exports grid functionality from specialized modules
 * @module grid
 */

// Export basic grid operations from core except snapToGrid
// to avoid duplicates with the one from snapping module
export { 
  // Don't export snapToGrid from core to avoid naming conflicts
  pixelsToMeters,
  metersToPixels,
  pointToMeters,
  pointToPixels,
  distance,
  angleBetweenPoints,
  straightenLine,
  approximatelyEqual,
  isOnGridIntersection,
  formatMeasurement,
  calculateGridLines
} from './core';

// Export measurement functions 
export * from './measurements';

// Export snapping utilities - explicitly export to avoid ambiguity
export {
  snapToGrid,
  snapToAngle,
  snapLineToStandardAngles,
  getNearestGridIntersection,
  getNearestPointOnGrid,
  distanceToNearestGridLine
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
