
/**
 * Geometry utilities index
 * @module utils/geometry
 */

// Export all from sub-modules
export * from './lineOperations';
export * from './pointOperations';
export * from './coordinateTransforms';

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

// Add any missing utility exports
export { 
  formatDistance, 
  isExactGridMultiple 
} from './pointOperations';
