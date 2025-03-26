
/**
 * Geometry utilities index
 * Central export point for all geometry-related utility functions
 * @module geometry
 */

// Export from areaCalculations
export { calculateGIA } from './areaCalculations';

// Export from constants
export { 
  HORIZONTAL_BIAS,
  VERTICAL_BIAS,
  DISTANCE_PRECISION,
  MEASUREMENT_UPDATE_INTERVAL,
  SHAPE_CLOSE_THRESHOLD,
  MIN_LINE_LENGTH,
  MAX_ANGLE_DEVIATION,
  GRID_SPACING,
  CLOSE_POINT_THRESHOLD,
  FLOATING_POINT_TOLERANCE
} from './constants';

// Export from coordinateTransforms
export { screenToCanvasCoordinates } from './coordinateTransforms';

// Export from lineOperations
export { 
  calculateDistance,
  isExactGridMultiple
} from './lineOperations';

// Export from straightening
export { straightenStroke } from './straightening';
