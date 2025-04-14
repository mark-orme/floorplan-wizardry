
/**
 * Geometry utilities index
 * @module utils/geometry
 */

// Explicitly export from lineOperations with name resolution
export { 
  calculateAngle,
  formatDistance,
  isExactGridMultiple,
  snapToGrid
} from './lineOperations';

// Explicitly export from pointOperations
export {
  isPointNear,
  roundToGrid,
  arePointsEqual,
  snapPointToGrid
} from './pointOperations';

// Explicitly export with aliasing to avoid conflicts
export { 
  calculateDistance as pointDistance,
  calculateMidpoint as pointMidpoint
} from './pointOperations';

export { 
  calculateDistance as lineDistance,
  calculateMidpoint as lineMidpoint
} from './lineOperations';

// Export explicitly to avoid name conflicts
export {
  pixelsToMeters as convertPixelsToMeters,
  metersToPixels as convertMetersToPixels,
  pixelsToGridUnits,
  gridUnitsToPixels
} from './coordinateTransforms';

// Conditionally export from modules
try {
  const straightening = require('./straightening');
  if (straightening) {
    Object.assign(exports, straightening);
  }
} catch (err) {
  console.warn('Failed to import straightening module');
}
