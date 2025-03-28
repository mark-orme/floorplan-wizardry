
/**
 * Line straightening utilities
 * @module geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { calculateAngle } from './lineOperations';

/**
 * Straighten a line to the nearest cardinal or ordinal direction
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {Point} New end point for straightened line
 */
export const straightenLine = (start: Point, end: Point): Point => {
  // Calculate angle and distance
  const angle = calculateAngle(start, end);
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  // Snap to nearest 45 degree angle
  const snapAngle = Math.round(angle / 45) * 45;
  const snapAngleRadians = (snapAngle * Math.PI) / 180;
  
  // Calculate new endpoint
  return {
    x: start.x + Math.cos(snapAngleRadians) * distance,
    y: start.y + Math.sin(snapAngleRadians) * distance
  };
};

/**
 * Check if a line is already straightened
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @param {number} [tolerance=5] - Angle tolerance in degrees
 * @returns {boolean} Whether the line is already straightened
 */
export const isLineStraight = (
  start: Point,
  end: Point,
  tolerance = 5
): boolean => {
  const angle = calculateAngle(start, end);
  const snapAngle = Math.round(angle / 45) * 45;
  
  return Math.abs(angle - snapAngle) <= tolerance;
};

/**
 * Get the nearest straight angle for a line
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Nearest standard angle in degrees
 */
export const getNearestStraightAngle = (start: Point, end: Point): number => {
  const angle = calculateAngle(start, end);
  return Math.round(angle / 45) * 45;
};

/**
 * Determines whether the given angle is close to horizontal or vertical
 * 
 * @param {number} angle - Angle in degrees
 * @param {number} [tolerance=10] - Tolerance in degrees
 * @returns {boolean} Whether the angle is close to horizontal or vertical
 */
export const isHorizontalOrVertical = (angle: number, tolerance = 10): boolean => {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Check if close to 0, 90, 180, or 270 degrees
  return (
    Math.abs(normalizedAngle) <= tolerance ||
    Math.abs(normalizedAngle - 90) <= tolerance ||
    Math.abs(normalizedAngle - 180) <= tolerance ||
    Math.abs(normalizedAngle - 270) <= tolerance ||
    Math.abs(normalizedAngle - 360) <= tolerance
  );
};
