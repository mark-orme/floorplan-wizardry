
/**
 * Central exports for geometry utilities
 * @module utils/geometry
 */
import { Point } from '@/types/core/Point';
import { calculateArea, calculateGIA } from './geometry/areaCalculation';
import { rotatePoint, translatePoint, scalePoint } from './geometry/transformations';
import { validatePolygon, isPolygonClosed } from './geometry/validation';
import { getBoundingBox, getMidpoint } from './geometry/boundingBox';
import { pixelsToMeters, metersToPixels } from './geometry/conversion';
import { simplifyPath, smoothPath } from './geometry/pathProcessing';
import { 
  snapPointToGrid, 
  snapToAngle 
} from './grid/snapping';

// Import line operations
import {
  calculateDistance,
  formatDistance,
  isExactGridMultiple,
  calculateMidpoint,
  calculateAngle
} from './geometry/lineOperations';

// Re-export all geometry functions
export {
  // Area calculations
  calculateArea,
  calculateGIA,
  
  // Transformations
  rotatePoint,
  translatePoint,
  scalePoint,
  
  // Validation
  validatePolygon,
  isPolygonClosed,
  
  // Bounding box operations
  getBoundingBox,
  getMidpoint,
  
  // Conversion utilities
  pixelsToMeters,
  metersToPixels,
  
  // Path processing
  simplifyPath,
  smoothPath,
  
  // Line operations
  calculateDistance,
  formatDistance,
  isExactGridMultiple,
  calculateMidpoint,
  calculateAngle,
  
  // Grid operations
  snapPointToGrid as snapToGrid,
  snapToAngle
};

/**
 * Calculate straight-line distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export const getDistance = (p1: Point, p2: Point): number => {
  return calculateDistance(p1, p2);
};

/**
 * Format a distance for display
 * @param pixels Distance in pixels
 * @returns Formatted distance string with units
 */
export const formatDisplayDistance = (pixels: number): string => {
  return formatDistance(pixels);
};
