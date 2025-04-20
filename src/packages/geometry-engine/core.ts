
/**
 * Core geometry functions
 * @module geometry-engine/core
 */
import { Point, LineSegment } from './types';

/**
 * Calculate Euclidean distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points in radians
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Calculate the perpendicular distance from a point to a line
 * @param point The point
 * @param line Line defined by two points
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, line: LineSegment): number {
  const { start, end } = line;
  
  // Line length
  const lineLength = calculateDistance(start, end);
  
  if (lineLength === 0) {
    return calculateDistance(point, start);
  }
  
  // Calculate the cross product
  const cross = 
    ((end.x - start.x) * (point.y - start.y)) - 
    ((end.y - start.y) * (point.x - start.x));
  
  return Math.abs(cross / lineLength);
}

/**
 * Check if two line segments intersect
 * @param line1 First line segment
 * @param line2 Second line segment
 * @returns True if the lines intersect
 */
export function linesIntersect(line1: LineSegment, line2: LineSegment): boolean {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;
  
  // Calculate direction vectors
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  // Calculate determinant
  const det = d1x * d2y - d1y * d2x;
  
  if (det === 0) {
    // Lines are parallel
    return false;
  }
  
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  const t1 = (dx * d2y - dy * d2x) / det;
  const t2 = (dx * d1y - dy * d1x) / det;
  
  return (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1);
}
