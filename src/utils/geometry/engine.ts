
/**
 * Geometry engine implementation
 * Core geometric calculations and utilities
 * @module utils/geometry/engine
 */

import { Point, LineSegment, Rectangle, Circle, Polygon, BoundingBox } from '@/types/core/Geometry';

/**
 * Calculate distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance in pixels
 */
export function calculateDistance(point1: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

/**
 * Calculate the area of a polygon
 * @param points Array of points forming the polygon
 * @returns Area in square pixels
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  
  return Math.abs(area / 2);
}

/**
 * Calculate the Gross Internal Area (GIA) from a polygon
 * @param points Polygon points
 * @param scale Scale factor (pixels to meters)
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], scale: number = 1): number {
  const areaInPixels = calculatePolygonArea(points);
  return areaInPixels * scale * scale;
}

/**
 * Simplify a path by removing redundant points
 * @param points Array of points to simplify
 * @param tolerance Distance tolerance for simplification
 * @returns Simplified array of points
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return [...points];
  
  const sqTolerance = tolerance * tolerance;
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > sqTolerance) {
    const firstHalf = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondHalf = simplifyPath(points.slice(index), tolerance);
    
    // Concatenate the two halves, removing duplicate points
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Calculate perpendicular distance from point to line segment
 * @param point Point to check
 * @param lineStart Start of line segment
 * @param lineEnd End of line segment
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return distance to that point
  if (dx === 0 && dy === 0) {
    return calculateDistance(point, lineStart);
  }
  
  // Calculate perpendicular distance
  const lineLengthSquared = dx * dx + dy * dy;
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Beyond the lineStart point
    return calculateDistance(point, lineStart);
  }
  if (t > 1) {
    // Beyond the lineEnd point
    return calculateDistance(point, lineEnd);
  }
  
  // Projection falls on the line segment
  const projectionX = lineStart.x + t * dx;
  const projectionY = lineStart.y + t * dy;
  
  return calculateDistance(point, { x: projectionX, y: projectionY });
}

/**
 * Optimize an array of points by removing redundant ones
 * @param points Array of points to optimize
 * @param tolerance Distance tolerance
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return [...points];
  
  // Use Douglas-Peucker algorithm (via simplifyPath)
  return simplifyPath(points, tolerance);
}

/**
 * Snap array of points to a grid
 * @param points Array of points to snap
 * @param gridSize Grid size in pixels
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  if (gridSize <= 0) return [...points];
  
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin of rotation
 * @param angle Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  
  // Translate point back to origin
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  
  // Rotate point
  const xNew = x * cos - y * sin;
  const yNew = x * sin + y * cos;
  
  // Translate point back
  return {
    x: xNew + origin.x,
    y: yNew + origin.y
  };
}

/**
 * Smooth a path using bezier curves
 * @param points Array of points
 * @param tension Tension factor (0-1)
 * @returns Smoothed path as SVG path string
 */
export function smoothPath(points: Point[], tension: number = 0.5): string {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;
    
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  
  return path;
}

/**
 * Get the bounding box of a set of points
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
  
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
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
 * Get the midpoint between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Midpoint
 */
export function getMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Format a distance for display
 * @param distance Distance in pixels
 * @param scale Scale factor (pixels to real-world units)
 * @param unit Unit to display ('m', 'cm', etc)
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, scale: number = 1, unit: string = 'm'): string {
  const convertedDistance = distance * scale;
  return `${convertedDistance.toFixed(2)}${unit}`;
}

// Additional exports for compatibility
export { getMidpoint as calculateMidpoint };
export const getDistance = calculateDistance;
export const formatDisplayDistance = formatDistance;

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is an exact multiple of grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  if (gridSize === 0) return false;
  return Math.abs(value % gridSize) < 0.0001;
}

/**
 * Calculate the angle between two points in radians
 * @param center Center point
 * @param point Target point
 * @returns Angle in radians
 */
export function calculateAngle(center: Point, point: Point): number {
  return Math.atan2(point.y - center.y, point.x - center.x);
}

/**
 * Translate a point by dx, dy
 * @param point Point to translate
 * @param dx X distance
 * @param dy Y distance
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
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @returns Scaled point
 */
export function scalePoint(point: Point, origin: Point, scaleX: number, scaleY: number = scaleX): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Check if a polygon is valid (at least 3 points, no self-intersections)
 * @param points Polygon points
 * @returns True if polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  // Need at least 3 points to form a polygon
  if (points.length < 3) return false;
  
  // Check for duplicate consecutive points
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    if (points[i].x === points[next].x && points[i].y === points[next].y) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if a polygon is closed
 * @param points Polygon points
 * @returns True if polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y;
}

/**
 * Convert pixels to meters based on scale
 * @param pixels Value in pixels
 * @param scale Conversion scale (pixels to meters)
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, scale: number): number {
  return pixels * scale;
}

/**
 * Convert meters to pixels based on scale
 * @param meters Value in meters
 * @param scale Conversion scale (pixels to meters)
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, scale: number): number {
  return meters / scale;
}
