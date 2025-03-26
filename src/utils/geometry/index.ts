
/**
 * Geometry utilities index
 * Central export point for all geometry-related utility functions
 * @module geometry
 */

// Export from areaCalculations
export { calculateArea, calculateGIA } from './areaCalculations';

// Export from constants
export { PIXELS_PER_METER, GRID_SIZE, GRID_MAJOR_INTERVAL } from './constants';

// Export from coordinateTransforms
export { canvasToRealCoordinates, realToCanvasCoordinates } from './coordinateTransforms';

// Export from gridOperations - selectively export to avoid duplication
export { snapToGrid, roundToGrid } from './gridOperations';

// Export from lineOperations
export { 
  calculateDistance, 
  calculateMidpoint, 
  createLine,
  normalizePoints,
  calculateAngle,
  arePointsEqual, 
  isPointOnLine,
  isExactGridMultiple 
} from './lineOperations';

// Export from midpointCalculation
export { findMidpoint } from './midpointCalculation';
