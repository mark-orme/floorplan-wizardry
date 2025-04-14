
import { Point } from '@/types/core/Point';

/**
 * Calculate the distance between two points
 * 
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance between the points
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the midpoint between two points
 * 
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Midpoint between the points
 */
export const getMidpoint = (point1: Point, point2: Point): Point => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};

/**
 * Calculate the angle between two points in degrees
 * 
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Angle in degrees
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * 180 / Math.PI;
};

/**
 * Calculate the Gross Internal Area (GIA) of a polygon
 * 
 * @param points - Array of points forming the polygon
 * @returns Area in square units
 */
export const calculateGIA = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area / 2);
};
