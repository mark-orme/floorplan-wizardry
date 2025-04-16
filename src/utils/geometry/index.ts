
/**
 * Central exports for geometry utilities
 * @module utils/geometry
 */
import { Point } from '@/types/core/Point';
import { calculateArea, calculateGIA } from './areaCalculation';
import { rotatePoint, translatePoint, scalePoint } from './transformations';
import { validatePolygon, isPolygonClosed } from './validation';
import { getBoundingBox, getMidpoint } from './boundingBox';
import { pixelsToMeters, metersToPixels } from './conversion';
import { simplifyPath, smoothPath } from './pathProcessing';
import { 
  snapToGrid,
  snapToAngle,
  calculateDistance,
  calculateAngle,
  isPointNear,
  roundToGrid,
  arePointsEqual,
  snapPointToGrid,
  calculateMidpoint
} from './pointOperations';

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
  
  // Point operations
  isPointNear,
  roundToGrid,
  arePointsEqual,
  snapPointToGrid,
  calculateMidpoint,
  
  // Line operations
  calculateDistance,
  calculateAngle,
  
  // Grid operations
  snapToGrid,
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
  // Simple distance formatter - implement actual conversion logic as needed
  if (pixels < 100) {
    return `${Math.round(pixels)}px`;
  } else {
    return `${(pixels / 100).toFixed(2)}m`;
  }
};
