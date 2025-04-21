
/**
 * Geometry Engine
 * 
 * A comprehensive utility for geometry calculations, transformations,
 * and optimizations used throughout the application.
 * 
 * @module utils/geometry/engine
 */

import { Point, LineSegment, Polygon, BoundingBox } from '@/types/core/Geometry';
import { GRID_SPACING, PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Calculate the area of a polygon in square pixels
 * 
 * @param points - Array of points defining the polygon
 * @returns Area in square pixels
 */
export function calculateArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  return Math.abs(area / 2);
}

/**
 * Calculate Gross Internal Area in square meters
 * 
 * @param polygons - Array of polygons to calculate GIA for
 * @returns Area in square meters
 */
export function calculateGIA(polygons: Polygon[]): number {
  let totalArea = 0;
  
  for (const polygon of polygons) {
    totalArea += calculateArea(polygon);
  }
  
  // Convert from square pixels to square meters
  return pixelsToSquareMeters(totalArea);
}

/**
 * Calculate the distance between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance in pixels
 */
export function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Format a distance for display
 * 
 * @param distance - Distance in pixels
 * @returns Formatted distance string
 */
export function formatDisplayDistance(distance: number): string {
  const meters = pixelsToMeters(distance);
  
  if (meters < 0.01) {
    return `${(meters * 100).toFixed(0)} cm`;
  }
  
  if (meters < 1) {
    return `${(meters * 100).toFixed(0)} cm`;
  }
  
  return `${meters.toFixed(2)} m`;
}

/**
 * Format a distance value
 * 
 * @param distance - Distance in pixels
 * @param precision - Number of decimal places
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, precision: number = 2): string {
  const meters = pixelsToMeters(distance);
  return `${meters.toFixed(precision)} m`;
}

/**
 * Calculate the angle between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Calculate the midpoint between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export function calculateMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Get the midpoint between two points
 * @alias for calculateMidpoint
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return calculateMidpoint(p1, p2);
}

/**
 * Translate a point by the given offsets
 * 
 * @param point - Point to translate
 * @param dx - X offset
 * @param dy - Y offset
 * @returns Translated point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Check if a polygon is closed
 * 
 * @param points - Array of points defining the polygon
 * @param tolerance - Distance tolerance for considering points equal
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[], tolerance: number = 1): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  return getDistance(first, last) <= tolerance;
}

/**
 * Get the bounding box of a set of points
 * 
 * @param points - Array of points
 * @returns Bounding box
 */
export function getBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const { x, y } = points[i];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Convert pixels to meters
 * 
 * @param pixels - Distance in pixels
 * @returns Distance in meters
 */
export function pixelsToMeters(pixels: number): number {
  return pixels / PIXELS_PER_METER;
}

/**
 * Convert square pixels to square meters
 * 
 * @param squarePixels - Area in square pixels
 * @returns Area in square meters
 */
export function pixelsToSquareMeters(squarePixels: number): number {
  return squarePixels / (PIXELS_PER_METER * PIXELS_PER_METER);
}

/**
 * Convert meters to pixels
 * 
 * @param meters - Distance in meters
 * @returns Distance in pixels
 */
export function metersToPixels(meters: number): number {
  return meters * PIXELS_PER_METER;
}

/**
 * Check if a value is an exact multiple of the grid size
 * 
 * @param value - Value to check
 * @param gridSize - Grid size
 * @returns True if the value is an exact multiple of the grid size
 */
export function isExactGridMultiple(value: number, gridSize: number = GRID_SPACING): boolean {
  const remainder = value % gridSize;
  return remainder < 0.001 || Math.abs(remainder - gridSize) < 0.001;
}

/**
 * Calculate the perpendicular distance from a point to a line
 * 
 * @param point - Point to measure from
 * @param lineStart - Start point of line
 * @param lineEnd - End point of line
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSq = dx * dx + dy * dy;
  
  if (lineLengthSq === 0) {
    // Line is actually a point, so return distance to that point
    return getDistance(point, lineStart);
  }
  
  // Calculate projection
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSq;
  
  if (t < 0) {
    // Point is beyond the start of the line
    return getDistance(point, lineStart);
  }
  
  if (t > 1) {
    // Point is beyond the end of the line
    return getDistance(point, lineEnd);
  }
  
  // Project the point onto the line
  const projectionX = lineStart.x + t * dx;
  const projectionY = lineStart.y + t * dy;
  
  // Return the distance to the projection
  return getDistance(point, { x: projectionX, y: projectionY });
}

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * 
 * @param points - Array of points to simplify
 * @param epsilon - Maximum distance for a point to be considered
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], epsilon: number = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let maxIndex = 0;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const firstHalf = simplifyPath(points.slice(0, maxIndex + 1), epsilon);
    const secondHalf = simplifyPath(points.slice(maxIndex), epsilon);
    
    // Concatenate the results, avoiding duplicating the point
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    // All points in this segment are within epsilon distance, so simplify to just the endpoints
    return [firstPoint, lastPoint];
  }
}

/**
 * Optimize points by removing redundant ones
 * 
 * @param points - Array of points to optimize
 * @param tolerance - Distance tolerance for considering points equal
 * @returns Optimized points array
 */
export function optimizePoints(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = result[result.length - 1];
    const currPoint = points[i];
    
    // Add point only if it's sufficiently far from the previous one
    if (getDistance(prevPoint, currPoint) > tolerance) {
      result.push(currPoint);
    }
  }
  
  return result;
}

/**
 * Smooth a path using a moving average
 * 
 * @param points - Array of points to smooth
 * @param windowSize - Size of the averaging window
 * @returns Smoothed path
 */
export function smoothPath(points: Point[], windowSize: number = 3): Point[] {
  if (points.length <= 2 || windowSize < 2) return [...points];
  
  const result: Point[] = [];
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    for (let j = Math.max(0, i - halfWindow); j <= Math.min(points.length - 1, i + halfWindow); j++) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }
    
    result.push({
      x: sumX / count,
      y: sumY / count
    });
  }
  
  return result;
}

/**
 * Snap points to a grid
 * 
 * @param points - Array of points to snap
 * @param gridSize - Grid size
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number = GRID_SPACING): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
