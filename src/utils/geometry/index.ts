
/**
 * Geometry utilities index
 * @module utils/geometry
 */

// Export all from sub-modules
export * from './lineOperations';
export * from './pointOperations';
export * from './coordinateTransforms';

// Conditionally export from modules that might be missing
// If modules are missing, try-catch prevents app from crashing
try {
  const polygonOps = require('./polygonOperations');
  if (polygonOps) {
    Object.assign(exports, polygonOps);
  }
} catch (err) {
  console.warn('Failed to import polygonOperations module');
}

try {
  const polylineOps = require('./polylineOperations');
  if (polylineOps) {
    Object.assign(exports, polylineOps);
  }
} catch (err) {
  console.warn('Failed to import polylineOperations module');
}

try {
  const rectOps = require('./rectangleOperations');
  if (rectOps) {
    Object.assign(exports, rectOps);
  }
} catch (err) {
  console.warn('Failed to import rectangleOperations module');
}

try {
  const straightening = require('./straightening');
  if (straightening) {
    Object.assign(exports, straightening);
  }
} catch (err) {
  console.warn('Failed to import straightening module');
}

// Re-export renamed functions to avoid ambiguity
export {
  pixelsToMeters as convertPixelsToMeters,
  metersToPixels as convertMetersToPixels
} from './coordinateTransforms';
