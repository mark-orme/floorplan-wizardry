
/**
 * Geometry utilities index
 * @module utils/geometry
 */

// Export all from sub-modules, renaming where needed to avoid ambiguity
export * from './pointOperations';
export * from './lineOperations';
export * from './polygonOperations';
export * from './polylineOperations';
export * from './rectangleOperations';
export * from './straightening';

// Export renamed functions from coordinateTransforms to avoid ambiguity
export {
  pixelsToMeters as convertPixelsToMeters,
  metersToPixels as convertMetersToPixels,
  pixelsToGridUnits,
  gridUnitsToPixels
} from './coordinateTransforms';

// Explicitly re-export the original functions as well
export * from './coordinateTransforms';

// Export functions from lineOperations
export {
  calculateDistance,
  calculateMidpoint,
  isLineHorizontal,
  isLineVertical,
  formatDistance
} from './lineOperations';

// Export functions from straightening
export {
  straightenPolyline,
  arePointsAligned
} from './straightening';
