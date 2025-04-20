
/**
 * Core geometry utilities
 * @module geometry-engine/core
 */
import { Point, LineSegment } from './types';

/**
 * Calculate the Euclidean distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the perpendicular distance from a point to a line segment
 * @param point The point
 * @param line The line segment
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, line: LineSegment): number {
  const { start, end } = line;
  
  // Line length squared
  const lenSq = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
  
  // If line is just a point, return distance to that point
  if (lenSq === 0) return calculateDistance(point, start);
  
  // Calculate projection of point onto line
  const t = ((point.x - start.x) * (end.x - start.x) + 
             (point.y - start.y) * (end.y - start.y)) / lenSq;
  
  // If projection is outside line segment, return distance to nearest endpoint
  if (t < 0) return calculateDistance(point, start);
  if (t > 1) return calculateDistance(point, end);
  
  // Calculate projection point
  const proj: Point = {
    x: start.x + t * (end.x - start.x),
    y: start.y + t * (end.y - start.y)
  };
  
  // Return distance from point to projection
  return calculateDistance(point, proj);
}

/**
 * Check if two line segments intersect
 * @param line1 First line segment
 * @param line2 Second line segment
 * @returns True if the lines intersect
 */
export function lineSegmentsIntersect(line1: LineSegment, line2: LineSegment): boolean {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;
  
  // Calculate direction vectors
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  // Calculate determinant
  const det = d1x * d2y - d1y * d2x;
  
  // If determinant is zero, lines are parallel
  if (Math.abs(det) < 1e-10) return false;
  
  // Calculate the parameters for the intersection point
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  const t = (dx * d2y - dy * d2x) / det;
  const u = (dx * d1y - dy * d1x) / det;
  
  // Check if intersection point is within both line segments
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/**
 * Find the intersection point of two line segments
 * @param line1 First line segment
 * @param line2 Second line segment
 * @returns Intersection point or null if no intersection
 */
export function findIntersectionPoint(line1: LineSegment, line2: LineSegment): Point | null {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;
  
  // Calculate direction vectors
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  // Calculate determinant
  const det = d1x * d2y - d1y * d2x;
  
  // If determinant is zero, lines are parallel
  if (Math.abs(det) < 1e-10) return null;
  
  // Calculate the parameters for the intersection point
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  const t = (dx * d2y - dy * d2x) / det;
  const u = (dx * d1y - dy * d1x) / det;
  
  // Check if intersection point is within both line segments
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * d1x,
      y: p1.y + t * d1y
    };
  }
  
  return null;
}
