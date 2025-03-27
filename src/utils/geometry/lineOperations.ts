
/**
 * Line operation utilities module
 * Functions for calculating and manipulating lines
 * @module geometry/lineOperations
 */
import { Point } from '@/types/drawingTypes';
import { FLOATING_POINT_TOLERANCE, GRID_SPACING, DISTANCE_PRECISION } from './constants';

/**
 * Calculate distance between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance between points in the same units as input
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  if (!p1 || !p2) return 0;
  
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculate distance with higher precision
 * Used for critical measurements where precision is important
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Precise distance between points
 */
export const calculatePreciseDistance = (p1: Point, p2: Point): number => {
  if (!p1 || !p2) return 0;
  
  // Use higher precision calculation
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
};

/**
 * Format a distance measurement for display
 * Always show in meters for consistency (input should already be in meters)
 * 
 * @param {number} distance - Distance value in meters to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted distance string (e.g., "3.0m")
 */
export const formatDistance = (distance: number, precision: number = DISTANCE_PRECISION): string => {
  if (distance === null || distance === undefined || isNaN(distance)) return "0m";
  
  // Format consistently in meters with 1 decimal place
  return `${distance.toFixed(1)}m`;
};

/**
 * Check if a point is an exact multiple of the grid spacing
 * Used for checking if a point perfectly aligns with the grid
 * @param {number} value - Coordinate value to check
 * @returns {boolean} Whether value is an exact grid multiple
 */
export const isExactGridMultiple = (value: number): boolean => {
  const ratio = value / GRID_SPACING;
  const roundedRatio = Math.round(ratio);
  
  // Check if very close to an integer multiple
  return Math.abs(ratio - roundedRatio) < FLOATING_POINT_TOLERANCE;
};

/**
 * Calculate angle between two points in degrees
 * @param {Point} p1 - First point (start)
 * @param {Point} p2 - Second point (end)
 * @returns {number} Angle in degrees (0-360)
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  if (!p1 || !p2) return 0;
  
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians, then convert to degrees
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360 range
  if (angle < 0) angle += 360;
  
  return angle;
};

/**
 * Calculate the midpoint between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The midpoint between p1 and p2
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  if (!p1 || !p2) return { x: 0, y: 0 };
  
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Check if a point lies on a line segment within a certain tolerance
 * @param {Point} point - Point to check
 * @param {Point} lineStart - Start point of line
 * @param {Point} lineEnd - End point of line
 * @param {number} tolerance - Distance tolerance (default: 0.1)
 * @returns {boolean} Whether the point is on the line segment
 */
export const isPointOnLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  tolerance: number = 0.1
): boolean => {
  // Calculate distances
  const d1 = calculateDistance(point, lineStart);
  const d2 = calculateDistance(point, lineEnd);
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  // Check if point is outside the line segment bounds
  if (d1 > lineLength + tolerance || d2 > lineLength + tolerance) {
    return false;
  }
  
  // Calculate perpendicular distance to the line
  const A = lineEnd.y - lineStart.y;
  const B = lineStart.x - lineEnd.x;
  const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
  
  const perpDistance = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
  
  // Point is on line if perpendicular distance is within tolerance
  return perpDistance <= tolerance;
};
