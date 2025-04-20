
/**
 * Validation utility functions for geometry
 * @module geometry-engine/validation
 */
import { Point, LineSegment } from './types';
import { calculateDistance } from './core';

/**
 * Check if a point is valid (has finite x and y coordinates)
 * @param point The point to validate
 * @returns True if the point is valid
 */
export function isValidPoint(point: any): boolean {
  if (!point || typeof point !== 'object') return false;
  
  const { x, y } = point;
  return (
    typeof x === 'number' &&
    typeof y === 'number' &&
    isFinite(x) &&
    isFinite(y)
  );
}

/**
 * Check if a line segment is valid
 * @param line The line segment to validate
 * @returns True if the line segment is valid
 */
export function isValidLine(line: any): boolean {
  if (!line || typeof line !== 'object') return false;
  
  const { start, end } = line;
  return isValidPoint(start) && isValidPoint(end);
}

/**
 * Check if a polygon is valid
 * @param points Array of points defining the polygon
 * @returns True if the polygon is valid
 */
export function isValidPolygon(points: any[]): boolean {
  // Need at least 3 points to form a polygon
  if (!Array.isArray(points) || points.length < 3) return false;
  
  // Check if all points are valid
  return points.every(isValidPoint);
}
