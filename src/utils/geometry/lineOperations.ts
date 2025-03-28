
/**
 * Line operation utilities
 * @module geometry/lineOperations
 */
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, DISTANCE_PRECISION } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in pixels
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted distance string
 */
export const formatDistance = (
  distance: number, 
  precision: number = DISTANCE_PRECISION
): string => {
  return distance.toFixed(precision);
};

/**
 * Check if a number is an exact multiple of grid size
 * @param {number} value - Value to check
 * @param {number} gridSize - Grid size
 * @returns {boolean} True if exact multiple
 */
export const isExactGridMultiple = (
  value: number, 
  gridSize: number = GRID_SPACING.SMALL
): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Calculate the angle between two points in degrees
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Angle in degrees (0-360)
 */
export const calculateAngle = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Calculate the midpoint between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate a point at a specific distance and angle from start
 * @param {Point} start - Start point
 * @param {number} distance - Distance
 * @param {number} angleDegrees - Angle in degrees
 * @returns {Point} Resulting point
 */
export const pointAtDistanceAndAngle = (
  start: Point,
  distance: number,
  angleDegrees: number
): Point => {
  const angleRadians = angleDegrees * (Math.PI / 180);
  return {
    x: start.x + Math.cos(angleRadians) * distance,
    y: start.y + Math.sin(angleRadians) * distance
  };
};

/**
 * Calculate length of a line
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Line length
 */
export const calculateLineLength = (start: Point, end: Point): number => {
  return calculateDistance(start, end);
};
