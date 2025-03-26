
/**
 * Grid operations index
 * Central export point for all grid-related utility functions
 * @module grid
 */

// Export from core
export { 
  snapToGrid,
  isExactGridMultiple
} from './core';

// Export from snapping
export {
  snapPointsToGrid,
  snapToNearestGridLine,
  forceGridAlignment
} from './snapping';

// Export from measurements
export {
  distanceToNearestGridLine
} from './measurements';
