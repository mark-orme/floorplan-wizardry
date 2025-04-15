
/**
 * Line operations utility functions
 * @module utils/geometry/lineOperations
 */

import { Point } from '@/types/core/Geometry';

/**
 * Calculate the distance between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Distance in pixels
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in degrees
 * @param {Point} start - Starting point
 * @param {Point} end - Ending point
 * @returns {number} Angle in degrees
 */
export function calculateAngle(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate angle in radians
  let angle = Math.atan2(dy, dx);
  
  // Convert to degrees
  angle = angle * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
}

/**
 * Get the midpoint between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {Point} Midpoint
 */
export function getMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Check if two line segments intersect
 * @param {Point} line1Start - First line start point
 * @param {Point} line1End - First line end point
 * @param {Point} line2Start - Second line start point
 * @param {Point} line2End - Second line end point
 * @returns {boolean} True if lines intersect
 */
export function doLinesIntersect(
  line1Start: Point, 
  line1End: Point, 
  line2Start: Point, 
  line2End: Point
): boolean {
  // Calculate line directions
  const dir1 = {
    x: line1End.x - line1Start.x,
    y: line1End.y - line1Start.y
  };
  
  const dir2 = {
    x: line2End.x - line2Start.x,
    y: line2End.y - line2Start.y
  };
  
  // Calculate determinant
  const det = dir1.x * dir2.y - dir1.y * dir2.x;
  
  // Lines are parallel if determinant is zero
  if (Math.abs(det) < 0.001) return false;
  
  // Calculate differences
  const d1 = {
    x: line2Start.x - line1Start.x,
    y: line2Start.y - line1Start.y
  };
  
  // Calculate intersection parameters
  const t1 = (d1.x * dir2.y - d1.y * dir2.x) / det;
  const t2 = (d1.x * dir1.y - d1.y * dir1.x) / det;
  
  // Check if intersection occurs within line segments
  return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
}

/**
 * Find the intersection point of two line segments
 * @param {Point} line1Start - First line start point
 * @param {Point} line1End - First line end point 
 * @param {Point} line2Start - Second line start point
 * @param {Point} line2End - Second line end point
 * @returns {Point | null} Intersection point or null if no intersection
 */
export function findIntersectionPoint(
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): Point | null {
  // First check if lines intersect
  if (!doLinesIntersect(line1Start, line1End, line2Start, line2End)) {
    return null;
  }
  
  // Calculate line directions
  const dir1 = {
    x: line1End.x - line1Start.x,
    y: line1End.y - line1Start.y
  };
  
  const dir2 = {
    x: line2End.x - line2Start.x,
    y: line2End.y - line2Start.y
  };
  
  // Calculate determinant
  const det = dir1.x * dir2.y - dir1.y * dir2.x;
  
  // Calculate differences
  const d1 = {
    x: line2Start.x - line1Start.x,
    y: line2Start.y - line1Start.y
  };
  
  // Calculate intersection parameter
  const t1 = (d1.x * dir2.y - d1.y * dir2.x) / det;
  
  // Calculate intersection point
  return {
    x: line1Start.x + t1 * dir1.x,
    y: line1Start.y + t1 * dir1.y
  };
}
