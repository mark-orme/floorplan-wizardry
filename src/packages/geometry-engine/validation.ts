
/**
 * Geometry validation functions
 * @module geometry-engine/validation
 */
import { Point, Polygon, Line } from './types';
import { isPointInPolygon, findLineIntersection } from './core';

/**
 * Check if a polygon is closed (first and last points match)
 * @param points Points defining the polygon
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same
  const EPSILON = 0.001; // Small tolerance for floating point comparison
  return (
    Math.abs(first.x - last.x) < EPSILON && 
    Math.abs(first.y - last.y) < EPSILON
  );
}

/**
 * Check if a polygon is self-intersecting
 * @param points Points defining the polygon
 * @returns True if the polygon is self-intersecting
 */
export function isPolygonSelfIntersecting(points: Point[]): boolean {
  if (points.length < 4) return false;
  
  // Check each pair of non-adjacent edges for intersection
  for (let i = 0; i < points.length; i++) {
    const line1: Line = {
      start: points[i],
      end: points[(i + 1) % points.length]
    };
    
    for (let j = i + 2; j < points.length; j++) {
      // Skip adjacent edges
      if (i === 0 && j === points.length - 1) continue;
      
      const line2: Line = {
        start: points[j],
        end: points[(j + 1) % points.length]
      };
      
      // Check if these lines intersect
      const intersection = findLineIntersection(line1, line2);
      if (intersection) return true;
    }
  }
  
  return false;
}

/**
 * Validate a polygon for correctness
 * @param points Points defining the polygon
 * @returns Object with validation results
 */
export function validatePolygon(points: Point[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check minimum points
  if (points.length < 3) {
    errors.push('Polygon must have at least 3 points');
    return { valid: false, errors };
  }
  
  // Check if polygon is closed
  if (!isPolygonClosed(points)) {
    errors.push('Polygon is not closed (first and last points do not match)');
  }
  
  // Check for self-intersection
  if (isPolygonSelfIntersecting(points)) {
    errors.push('Polygon has self-intersections');
  }
  
  // Check for duplicate points
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (i !== j && 
          Math.abs(points[i].x - points[j].x) < 0.001 && 
          Math.abs(points[i].y - points[j].y) < 0.001) {
        errors.push(`Duplicate points found at indices ${i} and ${j}`);
        break;
      }
    }
  }
  
  return { 
    valid: errors.length === 0,
    errors 
  };
}

/**
 * Check if two lines are parallel
 * @param line1 First line
 * @param line2 Second line
 * @returns True if lines are parallel
 */
export function areLinesParallel(line1: Line, line2: Line): boolean {
  const dx1 = line1.end.x - line1.start.x;
  const dy1 = line1.end.y - line1.start.y;
  const dx2 = line2.end.x - line2.start.x;
  const dy2 = line2.end.y - line2.start.y;
  
  // Check if slopes are equal
  // Handle division by zero case
  if (dx1 === 0 && dx2 === 0) return true; // Both vertical
  if (dx1 === 0 || dx2 === 0) return false; // One vertical, one not
  
  const EPSILON = 0.0001; // Small tolerance for floating point comparison
  return Math.abs((dy1 / dx1) - (dy2 / dx2)) < EPSILON;
}

/**
 * Check if a point is on a line segment
 * @param point Point to check
 * @param line Line segment
 * @returns True if point is on the line segment
 */
export function isPointOnLine(point: Point, line: Line): boolean {
  const { start, end } = line;
  
  // Calculate distances
  const d1 = Math.sqrt((point.x - start.x) ** 2 + (point.y - start.y) ** 2);
  const d2 = Math.sqrt((point.x - end.x) ** 2 + (point.y - end.y) ** 2);
  const lineLength = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  
  // Check if point is on line segment (with small epsilon for floating point precision)
  const EPSILON = 0.001;
  return Math.abs(d1 + d2 - lineLength) < EPSILON;
}
