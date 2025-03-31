
/**
 * Geometry utility functions
 * @module utils/geometryUtils
 */
import { Point } from '@/types/core/Geometry';

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export const getMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate the angle between two points in degrees
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Check if two points are close to each other
 * @param p1 First point
 * @param p2 Second point
 * @param threshold Maximum distance to be considered close
 * @returns True if points are close
 */
export const arePointsClose = (p1: Point, p2: Point, threshold: number = 5): boolean => {
  return calculateDistance(p1, p2) <= threshold;
};

/**
 * Check if a point is close to being on a straight line
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param point Point to check
 * @param threshold Maximum distance to be considered on the line
 * @returns True if point is close to the line
 */
export const isPointNearLine = (lineStart: Point, lineEnd: Point, point: Point, threshold: number = 5): boolean => {
  const lengthSquared = Math.pow(calculateDistance(lineStart, lineEnd), 2);
  if (lengthSquared === 0) return calculateDistance(lineStart, point) <= threshold;
  
  // Calculate the projection of the point onto the line
  const t = Math.max(0, Math.min(1, (
    ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
     (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / lengthSquared
  )));
  
  const projection: Point = {
    x: lineStart.x + t * (lineEnd.x - lineStart.x),
    y: lineStart.y + t * (lineEnd.y - lineStart.y)
  };
  
  return calculateDistance(point, projection) <= threshold;
};
