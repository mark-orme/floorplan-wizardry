
/**
 * Geometry utilities index
 * Central export point for all geometry-related utility functions
 * @module geometry
 */

// Export from areaCalculations
export { calculateGIA } from './areaCalculations';

// Export from constants
export { 
  GRID_SPACING,
  DISTANCE_PRECISION,
  CLOSE_POINT_THRESHOLD,
  FLOATING_POINT_TOLERANCE
} from './constants';

// Export from coordinateTransforms
export { screenToCanvasCoordinates } from './coordinateTransforms';

// Export from gridOperations - selectively export to avoid duplication
export { snapToGrid } from './gridOperations';

// Export from lineOperations
export { 
  calculateDistance,
  isExactGridMultiple
} from './lineOperations';

// Export from midpointCalculation
// Note: If midpointCalculation.ts doesn't export findMidpoint, we'll omit this export

/**
 * This serves as the central export point for geometry utilities.
 * We've cleaned up the exports to only include functions that actually exist
 * in the imported modules to avoid TypeScript errors.
 */
