/**
 * Geometry Engine
 * 
 * Core geometry calculation utilities for the application.
 * Provides functions for calculating areas, distances, and geometric transformations.
 * 
 * @module utils/geometry/engine
 */

import { Point, Polygon, LineSegment, Rectangle, Circle, TransformMatrix } from '@/types/core/Geometry';
import { GRID_SIZE, TOLERANCE, DEFAULT_GRID_SIZE, DEFAULT_TOLERANCE } from './constants';

// Re-export constants
export { GRID_SIZE, TOLERANCE, DEFAULT_GRID_SIZE, DEFAULT_TOLERANCE };

/**
 * Calculate the area of a polygon using the Shoelace formula (Gauss's area formula)
 * 
 * @param points - Array of points defining the polygon
 * @returns The area of the polygon
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
  
  return Math.abs(area) / 2;
}

/**
 * Calculate distance between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Alias for calculateDistance for backward compatibility
 */
export const getDistance = calculateDistance;

/**
 * Calculate angle between two points in radians
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Rotate a point around an origin by an angle
 * 
 * @param point - Point to rotate
 * @param origin - Origin point for rotation
 * @param angle - Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos
  };
}

/**
 * Translate a point by a specified amount
 * 
 * @param point - Point to translate
 * @param dx - X displacement
 * @param dy - Y displacement
 * @returns Translated point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Scale a point relative to an origin
 * 
 * @param point - Point to scale
 * @param origin - Origin point for scaling
 * @param scaleX - X scale factor
 * @param scaleY - Y scale factor
 * @returns Scaled point
 */
export function scalePoint(
  point: Point, 
  origin: Point, 
  scaleX: number, 
  scaleY: number = scaleX
): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Find the center point of a polygon
 * 
 * @param points - Array of polygon vertices
 * @returns Center point of the polygon
 */
export function findCenter(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0, sumY = 0;
  
  points.forEach(point => {
    sumX += point.x;
    sumY += point.y;
  });
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

/**
 * Alias for findCenter for backward compatibility
 */
export const calculateMidpoint = findCenter;

/**
 * Get the midpoint between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Calculate perpendicular distance from a point to a line
 * 
 * @param point - The point
 * @param lineStart - Line start point
 * @param lineEnd - Line end point
 * @returns Distance from point to line
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return distance to that point
  if (dx === 0 && dy === 0) {
    return calculateDistance(point, lineStart);
  }
  
  // Calculate the normal distance
  const norm = Math.sqrt(dx * dx + dy * dy);
  return Math.abs((point.y - lineStart.y) * dx - (point.x - lineStart.x) * dy) / norm;
}

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 * 
 * @param point - Point to check
 * @param polygon - Array of polygon vertices
 * @returns True if point is inside polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  if (!polygon || polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = 
      ((yi > point.y) !== (yj > point.y)) && 
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 * 
 * @param points - Array of points defining the path
 * @param tolerance - Simplification tolerance
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(
      points[i], 
      points[0], 
      points[points.length - 1]
    );
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const firstSegment = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondSegment = simplifyPath(points.slice(index), tolerance);
    
    // Concatenate the two segments, removing the duplicate point
    return [...firstSegment.slice(0, -1), ...secondSegment];
  }
  
  // If distance is less than tolerance, return just the endpoints
  return [points[0], points[points.length - 1]];
}

/**
 * Apply smoothing to a path using Bezier curve interpolation
 * 
 * @param points - Array of points defining the path
 * @param tension - Smoothing tension (0-1)
 * @returns Smoothed path with Bezier control points
 */
export function smoothPath(points: Point[], tension: number = 0.5): Point[] {
  if (points.length < 3) return [...points];
  
  const result: Point[] = [];
  
  // Add first point
  result.push({ ...points[0] });
  
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;
    
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    result.push({ x: cp1x, y: cp1y });
    result.push({ x: cp2x, y: cp2y });
    result.push({ ...p2 });
  }
  
  return result;
}

/**
 * Optimize a set of points by removing redundant ones
 * 
 * @param points - Array of points to optimize
 * @param tolerance - Distance tolerance for simplification
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  return simplifyPath(points, tolerance);
}

/**
 * Get bounding box of a set of points
 * 
 * @param points - Array of points
 * @returns Bounding box rectangle
 */
export function getBoundingBox(points: Point[]): Rectangle {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Check if a polygon is closed
 * 
 * @param points - Array of polygon vertices
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  // Check if first and last points match (within small tolerance)
  const tolerance = 0.001;
  return (
    Math.abs(firstPoint.x - lastPoint.x) < tolerance &&
    Math.abs(firstPoint.y - lastPoint.y) < tolerance
  );
}

/**
 * Validate a polygon (check for proper formation)
 * 
 * @param points - Array of polygon vertices
 * @returns True if polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  // Check for self-intersections
  for (let i = 0; i < points.length; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % points.length];
    
    for (let j = i + 2; j < points.length; j++) {
      const b1 = points[j];
      const b2 = points[(j + 1) % points.length];
      
      // Skip adjacent segments
      if ((j + 1) % points.length === i) continue;
      
      if (doLinesIntersect(a1, a2, b1, b2)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Check if two line segments intersect
 * 
 * @param a1 - First line segment start point
 * @param a2 - First line segment end point
 * @param b1 - Second line segment start point
 * @param b2 - Second line segment end point
 * @returns True if line segments intersect
 */
function doLinesIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
  const det = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  
  if (det === 0) return false; // Parallel lines
  
  const lambda = ((b2.y - b1.y) * (b2.x - a1.x) + (b1.x - b2.x) * (b2.y - a1.y)) / det;
  const gamma = ((a1.y - a2.y) * (b2.x - a1.x) + (a2.x - a1.x) * (b2.y - a1.y)) / det;
  
  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}

/**
 * Convert pixels to meters
 * 
 * @param pixels - Value in pixels
 * @param pixelsPerMeter - Conversion ratio
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
  return pixels / pixelsPerMeter;
}

/**
 * Convert meters to pixels
 * 
 * @param meters - Value in meters
 * @param pixelsPerMeter - Conversion ratio
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
  return meters * pixelsPerMeter;
}

/**
 * Format a distance for display
 * 
 * @param distance - Distance in real-world units
 * @param unit - Unit of measurement
 * @param precision - Decimal places
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, unit: string = 'm', precision: number = 2): string {
  return `${distance.toFixed(precision)} ${unit}`;
}

/**
 * Format distance for display in a user-friendly way
 * 
 * @param distanceM - Distance in meters
 * @returns Formatted string with appropriate units
 */
export function formatDisplayDistance(distanceM: number): string {
  // For very small distances, use centimeters
  if (distanceM < 0.01) {
    return `${(distanceM * 100).toFixed(0)} cm`;
  }
  
  // For small distances, use decimeters with more precision
  if (distanceM < 0.1) {
    return `${(distanceM * 100).toFixed(1)} cm`;
  }
  
  // For medium distances, use meters
  if (distanceM < 1000) {
    // Use appropriate precision based on magnitude
    const precision = distanceM < 1 ? 2 : distanceM < 10 ? 1 : 0;
    return `${distanceM.toFixed(precision)} m`;
  }
  
  // For large distances, use kilometers
  return `${(distanceM / 1000).toFixed(2)} km`;
}

/**
 * Calculate Gross Internal Area (GIA)
 * 
 * @param points - Array of polygon vertices
 * @param pixelsPerMeter - Conversion ratio
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], pixelsPerMeter: number = 100): number {
  const areaInPixels = calculatePolygonArea(points);
  return (areaInPixels / (pixelsPerMeter * pixelsPerMeter));
}

/**
 * Check if a value is an exact multiple of grid size
 * 
 * @param value - Value to check
 * @param gridSize - Grid size
 * @returns True if value is an exact multiple of grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  return Math.abs(value % gridSize) < 0.001;
}

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param point - Point to snap
 * @param gridSize - Grid size
 * @returns Snapped point
 */
export function snapPointToGrid(point: Point, gridSize: number = DEFAULT_GRID_SIZE): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snap a line to grid, while maintaining orientation
 * 
 * @param start - Line start point
 * @param end - Line end point
 * @param gridSize - Grid size
 * @returns Snapped line
 */
export function snapLineToGrid(
  start: Point, 
  end: Point, 
  gridSize: number
): { start: Point; end: Point } {
  // First, snap both endpoints to grid
  const snappedStart = snapPointToGrid(start, gridSize);
  const snappedEnd = snapPointToGrid(end, gridSize);
  
  return { start: snappedStart, end: snappedEnd };
}

/**
 * Snap a line to standard angles (0, 45, 90 degrees)
 * 
 * @param start - Line start point
 * @param end - Line end point
 * @returns Snapped line
 */
export function snapLineToStandardAngles(
  start: Point, 
  end: Point
): { start: Point; end: Point } {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // If too short, don't modify
  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    return { start, end };
  }
  
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap to 0, 45, 90, 135, 180, 225, 270, or 315 degrees
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  
  const snappedEnd = {
    x: start.x + Math.cos(snapAngle) * distance,
    y: start.y + Math.sin(snapAngle) * distance
  };
  
  return { start, end: snappedEnd };
}

/**
 * Snap an angle to standard increments
 * 
 * @param angle - Angle in radians
 * @param increment - Increment in radians
 * @returns Snapped angle in radians
 */
export function snapToAngle(angle: number, increment: number = Math.PI / 4): number {
  return Math.round(angle / increment) * increment;
}

/**
 * Check if a point is on a grid line or intersection
 * 
 * @param point - Point to check
 * @param gridSize - Grid size
 * @param tolerance - Distance tolerance
 * @returns True if point is on grid
 */
export function isPointOnGrid(point: Point, gridSize: number, tolerance: number = 1): boolean {
  const distX = Math.abs(Math.round(point.x / gridSize) * gridSize - point.x);
  const distY = Math.abs(Math.round(point.y / gridSize) * gridSize - point.y);
  
  return distX <= tolerance || distY <= tolerance;
}

/**
 * Get the nearest grid intersection point
 * 
 * @param point - Reference point
 * @param gridSize - Grid size
 * @returns Nearest grid intersection
 */
export function getNearestGridPoint(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Calculate distance from a point to nearest grid line
 * 
 * @param point - Reference point
 * @param gridSize - Grid size
 * @returns Distance to nearest grid line
 */
export function distanceToGrid(point: Point, gridSize: number): number {
  const distX = Math.abs((Math.round(point.x / gridSize) * gridSize) - point.x);
  const distY = Math.abs((Math.round(point.y / gridSize) * gridSize) - point.y);
  
  return Math.min(distX, distY);
}

/**
 * Calculate distance from a point to nearest grid line
 * 
 * @param point - Reference point
 * @param gridSize - Grid size
 * @returns Object containing distances to horizontal and vertical grid lines
 */
export function distanceToGridLine(point: Point, gridSize: number): { x: number; y: number } {
  return {
    x: Math.abs((Math.round(point.x / gridSize) * gridSize) - point.x),
    y: Math.abs((Math.round(point.y / gridSize) * gridSize) - point.y)
  };
}
