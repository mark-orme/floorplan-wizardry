
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
// Don't re-export midpointCalculation since it has a duplicate calculateMidpoint
import * as MidpointCalculations from './midpointCalculation';
export { 
  // Only export what doesn't conflict
  MidpointCalculations
};
export * from './straightening';
