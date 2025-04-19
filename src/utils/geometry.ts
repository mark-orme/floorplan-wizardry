
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
  snapPointToGrid as gridSnapPointToGrid, 
  snapToAngle as gridSnapToAngle 
} from './grid/snapping';

// Import line operations
import {
  calculateDistance,
  calculateMidpoint,
  calculateAngle,
  formatDistance,
  isExactGridMultiple
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
  
  // Grid operations - renamed to avoid ambiguity
  gridSnapPointToGrid as snapToGrid,
  gridSnapToAngle
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

/**
 * JavaScript implementation of area calculation
 * Will be replaced by WASM implementation in the future
 * 
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export const calculateAreaJs = (points: { x: number, y: number }[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
};
