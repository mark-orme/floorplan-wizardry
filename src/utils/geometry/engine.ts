
/**
 * Geometry engine utilities
 * @module utils/geometry/engine
 */

import { Point, LineSegment, BoundingBox, Polygon } from '@/types/core/Geometry';
import logger from '@/utils/logger';

/**
 * Calculates the area of a polygon
 * @param points Array of vertices of the polygon
 * @returns Area of the polygon in square units
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  area = Math.abs(area) / 2.0;
  return area;
}

/**
 * Calculate the Gross Internal Area (GIA) in square meters
 * @param polygons Array of polygons representing rooms
 * @param pixelsPerMeter Conversion factor from pixels to meters
 * @returns GIA in square meters
 */
export function calculateGIA(polygons: Polygon[], pixelsPerMeter: number = 100): number {
  let totalArea = 0;
  
  for (const polygon of polygons) {
    const area = calculatePolygonArea(polygon.points);
    totalArea += area;
  }
  
  // Convert from square pixels to square meters
  return totalArea / (pixelsPerMeter * pixelsPerMeter);
}

/**
 * Calculate distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance between points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate midpoint between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Midpoint
 */
export function calculateMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Calculate angle between two points in degrees
 * @param point1 First point
 * @param point2 Second point
 * @returns Angle in degrees
 */
export function calculateAngle(point1: Point, point2: Point): number {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
}

/**
 * Remove redundant points from a path
 * @param points Array of points
 * @param tolerance Distance tolerance
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) {
    return [...points];
  }
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const current = points[i];
    const next = points[i + 1];
    
    // Skip point if it's too close to previous point
    if (calculateDistance(prev, current) < tolerance) {
      continue;
    }
    
    result.push(current);
  }
  
  // Add the last point
  if (points.length > 1) {
    result.push(points[points.length - 1]);
  }
  
  return result;
}

/**
 * Snap points to grid
 * @param points Array of points
 * @param gridSize Grid size
 * @returns Snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

/**
 * Calculate perpendicular distance from point to line segment
 * @param point Point
 * @param line Line segment
 * @returns Distance
 */
export function perpendicularDistance(point: Point, line: LineSegment): number {
  const { start, end } = line;
  
  // Line length squared
  const lineLength2 = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
  
  // If line is a point, return distance to the point
  if (lineLength2 === 0) {
    return calculateDistance(point, start);
  }
  
  // Calculate projection ratio (t) of the point onto the line
  const t = ((point.x - start.x) * (end.x - start.x) + 
            (point.y - start.y) * (end.y - start.y)) / lineLength2;
  
  // If t is outside [0,1], distance is to nearest endpoint
  if (t < 0) {
    return calculateDistance(point, start);
  }
  if (t > 1) {
    return calculateDistance(point, end);
  }
  
  // Closest point on line
  const closest: Point = {
    x: start.x + t * (end.x - start.x),
    y: start.y + t * (end.y - start.y)
  };
  
  // Return distance to closest point
  return calculateDistance(point, closest);
}

/**
 * Convert distance from pixels to meters
 * @param pixels Distance in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Distance in meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
  return pixels / pixelsPerMeter;
}

/**
 * Convert distance from meters to pixels
 * @param meters Distance in meters
 * @param pixelsPerMeter Conversion factor
 * @returns Distance in pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
  return meters * pixelsPerMeter;
}

/**
 * Format distance for display
 * @param distanceInPixels Distance in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Formatted distance string
 */
export function formatDistance(distanceInPixels: number, pixelsPerMeter: number = 100): string {
  const meters = pixelsToMeters(distanceInPixels, pixelsPerMeter);
  
  if (meters < 1) {
    const cm = Math.round(meters * 100);
    return `${cm} cm`;
  } else {
    return `${meters.toFixed(2)} m`;
  }
}

/**
 * Get bounding box for a set of points
 * @param points Array of points
 * @returns Bounding box
 */
export function getBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Rotate a point around origin
 * @param point Point to rotate
 * @param angle Angle in degrees
 * @param origin Origin point (default is {0,0})
 * @returns Rotated point
 */
export function rotatePoint(point: Point, angle: number, origin: Point = { x: 0, y: 0 }): Point {
  // Convert angle to radians
  const radians = (angle * Math.PI) / 180;
  
  // Translate point back to origin
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  
  // Rotate point
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  const rotatedX = x * cos - y * sin;
  const rotatedY = x * sin + y * cos;
  
  // Translate point back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
}

/**
 * Translate a point
 * @param point Point to translate
 * @param dx X-axis translation
 * @param dy Y-axis translation
 * @returns Translated point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Scale a point from origin
 * @param point Point to scale
 * @param scaleX X-axis scale factor
 * @param scaleY Y-axis scale factor (defaults to scaleX)
 * @param origin Origin point (default is {0,0})
 * @returns Scaled point
 */
export function scalePoint(
  point: Point, 
  scaleX: number, 
  scaleY: number = scaleX, 
  origin: Point = { x: 0, y: 0 }
): Point {
  // Translate point back to origin
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  
  // Scale point
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  
  // Translate point back
  return {
    x: scaledX + origin.x,
    y: scaledY + origin.y
  };
}

/**
 * Check if a polygon is closed (last point equals first point)
 * @param points Polygon points
 * @returns True if closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 4) {
    return false; // Need at least 3 points + closing point
  }
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are close enough
  const threshold = 1.0; // 1px threshold
  return calculateDistance(first, last) <= threshold;
}

/**
 * Validate a polygon (at least 3 points, not self-intersecting, etc.)
 * @param points Polygon points
 * @returns Validation object
 */
export function validatePolygon(points: Point[]): { valid: boolean; error?: string } {
  if (points.length < 3) {
    return { valid: false, error: 'Polygon must have at least 3 points' };
  }
  
  // Additional validation could be added here:
  // - Check for self-intersections
  // - Check for minimum area
  // - etc.
  
  return { valid: true };
}

/**
 * Get midpoint of a line segment
 * @param line Line segment
 * @returns Midpoint
 */
export function getMidpoint(line: LineSegment): Point {
  return calculateMidpoint(line.start, line.end);
}

/**
 * Simplify a path using Douglas-Peucker algorithm
 * @param points Array of points
 * @param tolerance Simplification tolerance
 * @returns Simplified array of points
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) {
    return [...points];
  }
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const line: LineSegment = {
    start: points[0],
    end: points[points.length - 1]
  };
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], line);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    // Recursive case
    const firstLine = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondLine = simplifyPath(points.slice(index), tolerance);
    
    // Combine the results
    return firstLine.slice(0, -1).concat(secondLine);
  } else {
    // Base case
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Apply smoothing to a path
 * @param points Array of points
 * @param factor Smoothing factor (0-1)
 * @returns Smoothed array of points
 */
export function smoothPath(points: Point[], factor: number = 0.2): Point[] {
  if (points.length < 3 || factor <= 0 || factor >= 1) {
    return [...points];
  }
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1];
    
    const smoothedX = current.x + factor * (next.x - prev.x) / 2;
    const smoothedY = current.y + factor * (next.y - prev.y) / 2;
    
    result.push({ x: smoothedX, y: smoothedY });
  }
  
  result.push(points[points.length - 1]);
  return result;
}

/**
 * Check if a point is on a grid
 * @param point Point to check
 * @param gridSize Grid size
 * @returns True if point is on grid
 */
export function isExactGridMultiple(point: Point, gridSize: number): boolean {
  return (
    Math.abs(point.x % gridSize) < 0.001 && 
    Math.abs(point.y % gridSize) < 0.001
  );
}

/**
 * Calculate distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance
 */
export function getDistance(point1: Point, point2: Point): number {
  return calculateDistance(point1, point2);
}

/**
 * Format display distance with the appropriate unit
 * @param distanceInPixels Distance in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Formatted distance string
 */
export function formatDisplayDistance(distanceInPixels: number, pixelsPerMeter: number = 100): string {
  return formatDistance(distanceInPixels, pixelsPerMeter);
}
