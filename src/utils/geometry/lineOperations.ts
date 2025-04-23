
import { Point } from '@/types/core/Point';

/**
 * Calculate the angle between two points in degrees
 */
export const calculateAngle = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate angle in radians and convert to degrees
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Calculate the midpoint between two points
 */
export const calculateMidpoint = (start: Point, end: Point): Point => {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
};

/**
 * Calculate the distance between two points
 */
export const calculateDistance = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};
