
/**
 * Line operation utilities
 * @module lineOperations
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING, FLOATING_POINT_TOLERANCE } from './constants';

/**
 * Calculate the distance between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance in pixels
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  if (!p1 || !p2) return 0;
  
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a value is an exact multiple of the grid spacing
 * @param {number} value - Value to check
 * @returns {boolean} True if value is an exact multiple
 */
export const isExactGridMultiple = (value: number): boolean => {
  const remainder = Math.abs(value % GRID_SPACING);
  // Check if remainder is very close to 0 or very close to grid spacing
  return remainder < FLOATING_POINT_TOLERANCE || 
         Math.abs(remainder - GRID_SPACING) < FLOATING_POINT_TOLERANCE;
};

/**
 * Get the angle between two points in degrees
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Angle in degrees (0-360)
 */
export const getAngleBetweenPoints = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians and convert to degrees
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Check if a line is horizontal within a given tolerance
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @param {number} tolerance - Angle tolerance in degrees
 * @returns {boolean} True if line is horizontal
 */
export const isHorizontalLine = (p1: Point, p2: Point, tolerance = 5): boolean => {
  const angle = getAngleBetweenPoints(p1, p2);
  return (Math.abs(angle) < tolerance || Math.abs(angle - 180) < tolerance);
};

/**
 * Check if a line is vertical within a given tolerance
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @param {number} tolerance - Angle tolerance in degrees
 * @returns {boolean} True if line is vertical
 */
export const isVerticalLine = (p1: Point, p2: Point, tolerance = 5): boolean => {
  const angle = getAngleBetweenPoints(p1, p2);
  return (Math.abs(angle - 90) < tolerance || Math.abs(angle - 270) < tolerance);
};
