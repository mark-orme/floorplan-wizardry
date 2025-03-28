
/**
 * Line geometry operations
 * @module geometry/lineOperations
 */
import { Point } from '@/types/core/Point';
import { SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a point is on a line segment
 * @param point - Point to check
 * @param lineStart - Line start point
 * @param lineEnd - Line end point
 * @param threshold - Distance threshold
 * @returns Whether point is on line
 */
export const isPointOnLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  threshold: number = SNAP_THRESHOLD
): boolean => {
  // Calculate distances
  const d1 = distance(point, lineStart);
  const d2 = distance(point, lineEnd);
  const lineLength = distance(lineStart, lineEnd);
  
  // If point is very close to start or end, it's on the line
  if (d1 <= threshold || d2 <= threshold) {
    return true;
  }
  
  // Check if point is on line segment using distance sum
  const sum = d1 + d2;
  return Math.abs(sum - lineLength) <= threshold;
};

/**
 * Calculate line direction (unit vector)
 * @param lineStart - Line start point
 * @param lineEnd - Line end point
 * @returns Direction vector
 */
export const lineDirection = (lineStart: Point, lineEnd: Point): Point => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return { x: 0, y: 0 };
  
  return {
    x: dx / length,
    y: dy / length
  };
};

/**
 * Calculate the nearest point on a line from a given point
 * @param point - Reference point
 * @param lineStart - Line start point
 * @param lineEnd - Line end point
 * @returns Nearest point on line
 */
export const nearestPointOnLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): Point => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If line is zero length, return line start
  if (dx === 0 && dy === 0) {
    return { ...lineStart };
  }
  
  // Calculate projection of point onto line
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy);
  
  // Clamp t to line segment
  const tClamped = Math.max(0, Math.min(1, t));
  
  // Calculate nearest point
  return {
    x: lineStart.x + tClamped * dx,
    y: lineStart.y + tClamped * dy
  };
};

/**
 * Calculate intersection of two lines
 * @param line1Start - First line start point
 * @param line1End - First line end point
 * @param line2Start - Second line start point
 * @param line2End - Second line end point
 * @returns Intersection point or null if no intersection
 */
export const lineIntersection = (
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): Point | null => {
  // Line 1 vector
  const dx1 = line1End.x - line1Start.x;
  const dy1 = line1End.y - line1Start.y;
  
  // Line 2 vector
  const dx2 = line2End.x - line2Start.x;
  const dy2 = line2End.y - line2Start.y;
  
  // Calculate determinant
  const det = dx1 * dy2 - dx2 * dy1;
  
  // If parallel (det=0), no intersection
  if (Math.abs(det) < 0.0001) {
    return null;
  }
  
  // Calculate parameters
  const c1 = line1Start.x * line1End.y - line1End.x * line1Start.y;
  const c2 = line2Start.x * line2End.y - line2End.x * line2Start.y;
  
  // Calculate intersection point
  const x = (dx1 * c2 - dx2 * c1) / det;
  const y = (dy1 * c2 - dy2 * c1) / det;
  
  return { x, y };
};
