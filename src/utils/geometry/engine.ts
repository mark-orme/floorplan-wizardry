
/**
 * Geometry Engine
 * Core geometric calculations and utilities
 * @module utils/geometry/engine
 */

import { Point, LineSegment, Polygon, BoundingBox, Transform } from '@/types/core/Geometry';
import { GRID_SIZE, DEFAULT_GRID_SIZE, TOLERANCE, DEFAULT_TOLERANCE, PIXELS_PER_METER } from './constants';

/**
 * Calculate the area of a polygon using the Shoelace formula
 * @param points Array of points forming the polygon
 * @returns Area of the polygon in square units
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
};

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Alias for calculateDistance
 */
export const getDistance = calculateDistance;

/**
 * Format a distance for display with units
 * @param distance Distance in pixels
 * @param scale Scale factor (optional)
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number, scale: number = 1): string => {
  const meters = distance / (PIXELS_PER_METER * scale);
  return `${meters.toFixed(2)}m`;
};

/**
 * Format a distance for display in a user-friendly format
 * @param distance Distance in pixels
 * @param scale Scale factor (optional)
 * @returns Formatted distance string
 */
export const formatDisplayDistance = (distance: number, scale: number = 1): string => {
  const meters = distance / (PIXELS_PER_METER * scale);
  
  if (meters < 0.01) {
    return `${(meters * 100).toFixed(0)} cm`;
  } else if (meters < 1) {
    return `${(meters * 100).toFixed(0)} cm`;
  } else {
    return `${meters.toFixed(2)} m`;
  }
};

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin to rotate around
 * @param angle Angle in radians
 * @returns Rotated point
 */
export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + (dx * cos - dy * sin),
    y: origin.y + (dx * sin + dy * cos)
  };
};

/**
 * Translate a point by an offset
 * @param point Point to translate
 * @param dx X offset
 * @param dy Y offset
 * @returns Translated point
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
};

/**
 * Scale a point from an origin
 * @param point Point to scale
 * @param origin Origin to scale from
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @returns Scaled point
 */
export const scalePoint = (point: Point, origin: Point, scaleX: number, scaleY: number): Point => {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * scaleX,
    y: origin.y + dy * scaleY
  };
};

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Alias for calculateMidpoint
 */
export const getMidpoint = calculateMidpoint;

/**
 * Calculate the angle between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in radians
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Get bounding box of a polygon
 * @param points Polygon points
 * @returns Bounding box
 */
export const getBoundingBox = (points: Point[]): BoundingBox => {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
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
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Check if a polygon is closed
 * @param points Polygon points
 * @returns True if closed
 */
export const isPolygonClosed = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same
  return Math.abs(first.x - last.x) < 0.001 && Math.abs(first.y - last.y) < 0.001;
};

/**
 * Find the center of a polygon
 * @param points Polygon points
 * @returns Center point
 */
export const findCenter = (points: Point[]): Point => {
  if (points.length === 0) return { x: 0, y: 0 };
  
  const box = getBoundingBox(points);
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2
  };
};

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Polygon points
 * @returns True if point is inside
 */
export const isPointInsidePolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Validate a polygon
 * @param points Polygon points
 * @returns True if polygon is valid
 */
export const validatePolygon = (points: Point[]): boolean => {
  // Check minimum number of points
  if (points.length < 3) return false;
  
  // Check if polygon has positive area
  const area = calculatePolygonArea(points);
  if (area <= 0) return false;
  
  // Additional validation logic can be added here
  
  return true;
};

/**
 * Calculate perpendicular distance from a point to a line
 * @param point Point
 * @param lineStart Line start point
 * @param lineEnd Line end point
 * @returns Perpendicular distance
 */
export const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSq = dx * dx + dy * dy;
  
  if (lineLengthSq === 0) {
    // Line is actually a point
    return calculateDistance(point, lineStart);
  }
  
  // Calculate projection
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSq;
  
  if (t < 0) {
    // Point is beyond lineStart
    return calculateDistance(point, lineStart);
  } else if (t > 1) {
    // Point is beyond lineEnd
    return calculateDistance(point, lineEnd);
  }
  
  // Projected point on line
  const projectionX = lineStart.x + t * dx;
  const projectionY = lineStart.y + t * dy;
  
  // Distance to projection
  return calculateDistance(point, { x: projectionX, y: projectionY });
};

/**
 * Optimize a path using the Douglas-Peucker algorithm
 * @param points Array of points
 * @param tolerance Simplification tolerance
 * @returns Simplified array of points
 */
export const optimizePoints = (points: Point[], tolerance: number = DEFAULT_TOLERANCE): Point[] => {
  if (points.length <= 2) {
    return [...points];
  }
  
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
  if (maxDistance > tolerance) {
    // Recursive case: split and optimize both parts
    const firstPart = optimizePoints(points.slice(0, index + 1), tolerance);
    const secondPart = optimizePoints(points.slice(index), tolerance);
    
    // Concatenate the two parts, excluding the duplicate point
    return [...firstPart.slice(0, firstPart.length - 1), ...secondPart];
  } else {
    // Base case: just use the endpoints
    return [points[0], points[points.length - 1]];
  }
};

/**
 * Smooth a path using a simple moving average
 * @param points Array of points
 * @param windowSize Window size for averaging
 * @returns Smoothed array of points
 */
export const smoothPath = (points: Point[], windowSize: number = 3): Point[] => {
  if (points.length <= 2 || windowSize < 2) {
    return [...points];
  }
  
  const smoothed: Point[] = [];
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
    
    smoothed.push({
      x: sumX / count,
      y: sumY / count
    });
  }
  
  return smoothed;
};

/**
 * Simplify a path by removing collinear points
 * @param points Array of points
 * @param tolerance Tolerance for collinearity
 * @returns Simplified array of points
 */
export const simplifyPath = (points: Point[], tolerance: number = DEFAULT_TOLERANCE): Point[] => {
  if (points.length <= 2) {
    return [...points];
  }
  
  const simplified: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(
      points[i],
      simplified[simplified.length - 1],
      points[i + 1]
    );
    
    if (dist > tolerance) {
      simplified.push(points[i]);
    }
  }
  
  simplified.push(points[points.length - 1]);
  return simplified;
};

/**
 * Snap a point to grid
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = DEFAULT_GRID_SIZE): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Check if value is an exact multiple of grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is a multiple of grid size
 */
export const isExactGridMultiple = (value: number, gridSize: number = DEFAULT_GRID_SIZE): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  return meters * pixelsPerMeter;
};

/**
 * Calculate Gross Internal Area
 * @param polygons Array of polygons
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Area in square meters
 */
export const calculateGIA = (polygons: Point[][], pixelsPerMeter: number = PIXELS_PER_METER): number => {
  let totalArea = 0;
  
  for (const polygon of polygons) {
    totalArea += calculatePolygonArea(polygon);
  }
  
  return totalArea / (pixelsPerMeter * pixelsPerMeter);
};
