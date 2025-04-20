
/**
 * Core geometry functions
 * @module geometry-engine/core
 */
import { Point, LineSegment } from './types';

/**
 * Calculate perpendicular distance from a point to a line segment
 * @param point - Point to calculate distance from
 * @param line - Line segment to calculate distance to
 * @returns Distance from point to line
 */
export function perpendicularDistance(point: Point, line: LineSegment): number {
  const { start, end } = line;
  
  // Line length
  const lineLength = Math.sqrt(
    Math.pow(end.x - start.x, 2) + 
    Math.pow(end.y - start.y, 2)
  );
  
  // If the line is actually a point, return distance to that point
  if (lineLength === 0) {
    return Math.sqrt(
      Math.pow(point.x - start.x, 2) + 
      Math.pow(point.y - start.y, 2)
    );
  }
  
  // Calculate perpendicular distance
  const area = Math.abs(
    (end.y - start.y) * point.x - 
    (end.x - start.x) * point.y + 
    end.x * start.y - 
    end.y * start.x
  );
  
  return area / lineLength;
}

/**
 * Calculate Euclidean distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + 
    Math.pow(p2.y - p1.y, 2)
  );
}

/**
 * Calculate angle between line and x-axis
 * @param line - Line segment 
 * @returns Angle in radians
 */
export function calculateAngle(line: LineSegment): number {
  const { start, end } = line;
  return Math.atan2(end.y - start.y, end.x - start.x);
}

/**
 * Check if two line segments intersect
 * @param line1 - First line segment
 * @param line2 - Second line segment
 * @returns True if lines intersect
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
  const determinant = d1x * d2y - d1y * d2x;
  
  // Lines are parallel
  if (Math.abs(determinant) < 1e-10) {
    return false;
  }
  
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  // Calculate parameters
  const t = (dx * d2y - dy * d2x) / determinant;
  const u = (dx * d1y - dy * d1x) / determinant;
  
  // Check if intersection is within both line segments
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
