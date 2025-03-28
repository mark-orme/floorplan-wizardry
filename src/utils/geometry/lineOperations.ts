
/**
 * Line operations utilities
 * @module utils/geometry/lineOperations
 */
import { Point } from '@/types/geometryTypes';

/**
 * Calculate angle between two points in radians
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in radians
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Calculate angle between two points in degrees
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export const calculateAngleDegrees = (p1: Point, p2: Point): number => {
  return (calculateAngle(p1, p2) * 180) / Math.PI;
};

/**
 * Calculate if a line is horizontal (or close to it)
 * @param p1 First point
 * @param p2 Second point
 * @param tolerance Angle tolerance in degrees
 * @returns True if the line is horizontal
 */
export const isHorizontalLine = (p1: Point, p2: Point, tolerance: number = 5): boolean => {
  const angle = Math.abs(calculateAngleDegrees(p1, p2));
  return (angle < tolerance || Math.abs(angle - 180) < tolerance);
};

/**
 * Calculate if a line is vertical (or close to it)
 * @param p1 First point
 * @param p2 Second point
 * @param tolerance Angle tolerance in degrees
 * @returns True if the line is vertical
 */
export const isVerticalLine = (p1: Point, p2: Point, tolerance: number = 5): boolean => {
  const angle = Math.abs(calculateAngleDegrees(p1, p2));
  return (Math.abs(angle - 90) < tolerance || Math.abs(angle - 270) < tolerance);
};

/**
 * Calculate the perpendicular distance from a point to a line
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param point Point to calculate distance from
 * @returns Perpendicular distance
 */
export const perpendicularDistance = (lineStart: Point, lineEnd: Point, point: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return 0;
  
  // Calculate perpendicular distance
  return Math.abs((dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / length);
};

/**
 * Calculate the closest point on a line to a given point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param point Point to find closest point to
 * @returns Closest point on the line
 */
export const closestPointOnLine = (lineStart: Point, lineEnd: Point, point: Point): Point => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lengthSquared = dx * dx + dy * dy;
  
  if (lengthSquared === 0) return lineStart; // Line is actually a point
  
  // Calculate projection of point onto line
  const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared));
  
  return {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy
  };
};

/**
 * Check if a point is on a line segment
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param point Point to check
 * @param tolerance Maximum distance to be considered "on" the line
 * @returns True if the point is on the line segment
 */
export const isPointOnLine = (lineStart: Point, lineEnd: Point, point: Point, tolerance: number = 1): boolean => {
  // Calculate perpendicular distance
  const distance = perpendicularDistance(lineStart, lineEnd, point);
  
  if (distance > tolerance) return false;
  
  // Check if point is within the bounds of the line segment
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lengthSquared = dx * dx + dy * dy;
  
  if (lengthSquared === 0) return false; // Line is actually a point
  
  // Calculate projection of point onto line
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared;
  
  // Check if projection is within [0, 1]
  return t >= 0 && t <= 1;
};
