
/**
 * Utility functions for geometry calculations
 */

import { Point } from '@/types/core/Point';

/**
 * Calculate the distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns The distance between the points
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the angle between two points (in radians)
 * @param point1 - First point
 * @param point2 - Second point
 * @returns The angle in radians
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

/**
 * Calculate the angle between two points (in degrees)
 * @param point1 - First point
 * @param point2 - Second point
 * @returns The angle in degrees (0-360)
 */
export const calculateAngleDegrees = (point1: Point, point2: Point): number => {
  const radians = calculateAngle(point1, point2);
  let degrees = radians * (180 / Math.PI);
  
  // Normalize to 0-360
  if (degrees < 0) {
    degrees += 360;
  }
  
  return degrees;
};

/**
 * Check if two line segments intersect
 * @param a1 - Start point of first line
 * @param a2 - End point of first line
 * @param b1 - Start point of second line
 * @param b2 - End point of second line
 * @returns Whether the line segments intersect
 */
export const linesIntersect = (
  a1: Point, 
  a2: Point, 
  b1: Point, 
  b2: Point
): boolean => {
  // Implementation of line intersection check
  const det = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  
  if (det === 0) {
    return false; // Lines are parallel
  }
  
  const lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
  const gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;
  
  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
};

/**
 * Get the midpoint between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns The midpoint
 */
export const getMidpoint = (point1: Point, point2: Point): Point => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};
