
import { Point } from '@/types/core/Point';

/**
 * Calculate the distance between two points
 */
export const calculateDistance = (startPoint: Point, endPoint: Point): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the angle between two points in degrees
 */
export const calculateAngle = (startPoint: Point, endPoint: Point, snapToDegrees?: number): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // Calculate the angle in radians and convert to degrees
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360 degrees range
  angle = (angle + 360) % 360;
  
  // Snap to nearest multiple of snapToDegrees if provided
  if (snapToDegrees) {
    const halfSnap = snapToDegrees / 2;
    angle = Math.round(angle / snapToDegrees) * snapToDegrees;
  }
  
  return angle;
};

/**
 * Snap an angle to the nearest 45 degrees
 */
export const snapAngleTo45Degrees = (angle: number): number => {
  const snapDegrees = 45;
  return Math.round(angle / snapDegrees) * snapDegrees;
};

/**
 * Calculate midpoint between two points
 */
export const calculateMidpoint = (startPoint: Point, endPoint: Point): Point => {
  return {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2
  };
};

/**
 * Get point at specific distance along a line
 */
export const getPointAtDistance = (
  startPoint: Point, 
  endPoint: Point, 
  distance: number,
  totalDistance?: number
): Point => {
  // Calculate total distance if not provided
  const lineDistance = totalDistance || calculateDistance(startPoint, endPoint);
  
  // If distance is zero or line has no length, return start point
  if (distance === 0 || lineDistance === 0) {
    return { ...startPoint };
  }
  
  // Calculate the ratio of the requested distance to the total distance
  const ratio = distance / lineDistance;
  
  // Interpolate between start and end points
  return {
    x: startPoint.x + (endPoint.x - startPoint.x) * ratio,
    y: startPoint.y + (endPoint.y - startPoint.y) * ratio
  };
};
