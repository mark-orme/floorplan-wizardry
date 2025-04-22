
import { Point } from '@/types/core/Point';

/**
 * Calculate the distance between two points
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the angle between two points in degrees
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize angle to 0-360
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};
