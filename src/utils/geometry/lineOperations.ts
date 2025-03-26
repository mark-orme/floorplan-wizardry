
import { Point } from '@/types/geometryTypes';
import { DISTANCE_PRECISION, GRID_SPACING, FLOATING_POINT_TOLERANCE } from './constants';

/**
 * Calculate the distance between two points in meters
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} - Distance in meters
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  if (!point1 || !point2) {
    console.warn("Invalid points in calculateDistance", { point1, point2 });
    return 0;
  }
  
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  
  // Calculate the Euclidean distance
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Debug log for distance calculation
  console.log("Distance calculation:", { point1, point2, distance });
  
  return distance;
};

/**
 * Format a distance value with proper precision for display
 * @param {number} distance - Distance in meters
 * @returns {string} - Formatted distance string with 1 decimal place
 */
export const formatDistance = (distance: number): string => {
  if (isNaN(distance) || distance === undefined) {
    console.warn("Invalid distance value in formatDistance:", distance);
    return "0.0";
  }
  
  // Always show 1 decimal place for wall measurements
  const formatted = distance.toFixed(1);
  
  // For debugging
  console.log("Formatting distance:", { raw: distance, formatted });
  
  return formatted;
};

/**
 * Calculate the midpoint between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {Point} - Midpoint coordinates
 */
export const calculateMidpoint = (point1: Point, point2: Point): Point => {
  if (!point1 || !point2) {
    console.warn("Invalid points in calculateMidpoint", { point1, point2 });
    return { x: 0, y: 0 };
  }
  
  const midpoint = {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
  
  // Debug log for midpoint calculation
  console.log("Midpoint calculation:", { point1, point2, midpoint });
  
  return midpoint;
};

/**
 * Check if a line is exactly on the grid
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {boolean} - True if the line follows grid multiples
 */
export const isExactGridMultiple = (point1: Point, point2: Point): boolean => {
  // Check if both points are at grid intersections
  const isPoint1OnGrid = 
    Math.abs(point1.x % GRID_SPACING) < FLOATING_POINT_TOLERANCE &&
    Math.abs(point1.y % GRID_SPACING) < FLOATING_POINT_TOLERANCE;
  
  const isPoint2OnGrid = 
    Math.abs(point2.x % GRID_SPACING) < FLOATING_POINT_TOLERANCE &&
    Math.abs(point2.y % GRID_SPACING) < FLOATING_POINT_TOLERANCE;
  
  return isPoint1OnGrid && isPoint2OnGrid;
};

/**
 * Calculate the angle of a line in degrees
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} - Angle in degrees (0-360)
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  
  // Calculate angle in radians and convert to degrees
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Calculate distance with a specific precision
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @param {number} precision - Number of decimal places
 * @returns {number} - Distance with specific precision
 */
export const calculatePreciseDistance = (
  point1: Point, 
  point2: Point, 
  precision: number = DISTANCE_PRECISION
): number => {
  const distance = calculateDistance(point1, point2);
  const factor = Math.pow(10, precision);
  return Math.round(distance * factor) / factor;
};
