
/**
 * Geometry utilities main module
 * Re-exports functionality from specialized geometry modules
 * @module geometry
 */

// Export constants from the constants module
export * from './constants';

// Export functionality from specialized modules
export * from './areaCalculations';
export * from './coordinateTransforms';
export * from './lineOperations';
export * from './midpointCalculation';
export * from './straightening';
export * from './boundingBox';
export * from './conversion';

// Re-export key utility functions directly
export {
  calculateDistance,
  calculateMidpoint,
  calculateAngle,
  formatDistance,
  isExactGridMultiple
} from './lineOperations';
