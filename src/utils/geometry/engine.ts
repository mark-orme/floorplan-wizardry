/**
 * Core geometry engine functionality
 * @module utils/geometry/engine
 */

import { Point, Rectangle } from '@/types/core/Geometry';

/**
 * Calculate polygon area using the Shoelace formula
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export function calculatePolygonArea(points: Point[]): number {
  if (!points || points.length < 3) {
    return 0;
  }
  
  let area = 0;
  const numPoints = points.length;
  
  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  return area;
}

/**
 * Calculate gross internal area (GIA) - area adjusted for scale
 * @param points Array of points defining the polygon
 * @param pixelsPerMeter Scale factor (pixels per meter)
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], pixelsPerMeter: number): number {
  const areaInPixels = calculatePolygonArea(points);
  
  if (pixelsPerMeter <= 0) {
    return areaInPixels; // Return in pixels if scale is invalid
  }
  
  return areaInPixels / (pixelsPerMeter * pixelsPerMeter);
}

/**
 * Calculate distance between two points
 * @param start First point
 * @param end Second point
 * @returns Distance between points
 */
export function calculateDistance(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export function getDistance(p1: Point, p2: Point): number {
  return calculateDistance(p1, p2);
}

/**
 * Format distance for display
 * @param distanceInPixels Distance in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Formatted distance string
 */
export function formatDistance(distanceInPixels: number, pixelsPerMeter: number): string {
  if (pixelsPerMeter <= 0) return `${Math.round(distanceInPixels)}px`;
  
  const distanceInMeters = distanceInPixels / pixelsPerMeter;
  return `${distanceInMeters.toFixed(2)}m`;
}

/**
 * Format display distance with optional units
 * @param distanceInPixels Distance in pixels
 * @param pixelsPerMeter Conversion factor
 * @param showUnits Whether to include units
 * @returns Formatted distance string
 */
export function formatDisplayDistance(
  distanceInPixels: number,
  pixelsPerMeter: number,
  showUnits = true
): string {
  if (pixelsPerMeter <= 0) {
    return showUnits ? `${Math.round(distanceInPixels)}px` : `${Math.round(distanceInPixels)}`;
  }
  
  const distanceInMeters = distanceInPixels / pixelsPerMeter;
  return showUnits ? `${distanceInMeters.toFixed(2)}m` : `${distanceInMeters.toFixed(2)}`;
}

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number): number {
  if (pixelsPerMeter <= 0) return pixels;
  return pixels / pixelsPerMeter;
}

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Conversion factor
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number): number {
  if (pixelsPerMeter <= 0) return meters;
  return meters * pixelsPerMeter;
}

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point
 * @param angle Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const x = origin.x + (point.x - origin.x) * cos - (point.y - origin.y) * sin;
  const y = origin.y + (point.x - origin.x) * sin + (point.y - origin.y) * cos;
  
  return { x, y };
}

/**
 * Translate a point
 * @param point Point to translate
 * @param dx X displacement
 * @param dy Y displacement
 * @returns Translated point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Scale a point from an origin
 * @param point Point to scale
 * @param origin Origin point
 * @param scaleX Scale factor in X
 * @param scaleY Scale factor in Y
 * @returns Scaled point
 */
export function scalePoint(
  point: Point,
  origin: Point,
  scaleX: number,
  scaleY = scaleX
): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export function calculateMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Alias for calculateMidpoint
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return calculateMidpoint(p1, p2);
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
 * Check if a polygon is closed
 * @param points Polygon points
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same or very close
  const distance = calculateDistance(first, last);
  return distance < 0.001;
}

/**
 * Validate a polygon
 * @param points Polygon points
 * @returns True if the polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  return points.length >= 3;
}

/**
 * Get bounding box of a set of points
 * @param points Array of points
 * @returns Bounding rectangle
 */
export function getBoundingBox(points: Point[]): Rectangle {
  if (!points.length) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if the value is a multiple of the grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  if (gridSize <= 0) return false;
  return Math.abs(value % gridSize) < 0.001;
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 * @param points Path points
 * @param tolerance Simplification tolerance
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], tolerance = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  // Implementation of Douglas-Peucker algorithm
  const douglasPeucker = (points: Point[], tolerance: number): Point[] => {
    if (points.length <= 2) return points;
    
    let maxDistance = 0;
    let maxIndex = 0;
    
    const start = points[0];
    const end = points[points.length - 1];
    
    // Find point with maximum distance from line
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      const firstHalf = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
      const secondHalf = douglasPeucker(points.slice(maxIndex), tolerance);
      
      // Combine the results, avoiding duplicate points
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Otherwise, return just the endpoints
      return [start, end];
    }
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Smooth a path using Chaikin's algorithm
 * @param points Path points
 * @param iterations Number of smoothing iterations
 * @returns Smoothed path
 */
export function smoothPath(points: Point[], iterations = 1): Point[] {
  if (points.length <= 2 || iterations <= 0) return [...points];
  
  let result = [...points];
  
  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: Point[] = [];
    
    // Always keep the first point
    smoothed.push(result[0]);
    
    // Apply Chaikin's algorithm to each pair of points
    for (let i = 0; i < result.length - 1; i++) {
      const p0 = result[i];
      const p1 = result[i + 1];
      
      // Create new points at 1/4 and 3/4 positions
      const q = {
        x: p0.x * 0.75 + p1.x * 0.25,
        y: p0.y * 0.75 + p1.y * 0.25
      };
      
      const r = {
        x: p0.x * 0.25 + p1.x * 0.75,
        y: p0.y * 0.25 + p1.y * 0.75
      };
      
      smoothed.push(q, r);
    }
    
    // Always keep the last point
    smoothed.push(result[result.length - 1]);
    
    result = smoothed;
  }
  
  return result;
}

/**
 * Calculate perpendicular distance from point to line
 * @param point Point to check
 * @param lineStart Line start point
 * @param lineEnd Line end point
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSquared = dx * dx + dy * dy;
  
  if (lineLengthSquared === 0) {
    // Line is a point, return distance to that point
    return calculateDistance(point, lineStart);
  }
  
  // Calculate projection factor
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Point is beyond lineStart
    return calculateDistance(point, lineStart);
  }
  
  if (t > 1) {
    // Point is beyond lineEnd
    return calculateDistance(point, lineEnd);
  }
  
  // Perpendicular point on line
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  return calculateDistance(point, { x: projX, y: projY });
}

/**
 * Optimize points by removing redundant ones
 * @param points Array of points
 * @param tolerance Tolerance for optimization
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance = 1): Point[] {
  return simplifyPath(points, tolerance);
}

/**
 * Snap points to a grid
 * @param points Array of points
 * @param gridSize Grid size
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  if (gridSize <= 0) return [...points];
  
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
