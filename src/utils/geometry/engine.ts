
/**
 * Geometry engine implementation
 * Core utility functions for geometric calculations
 */

import { Point } from '@/types/core/Geometry';

/**
 * Calculate polygon area using the Shoelace formula
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let total = 0;
  
  for (let i = 0, l = points.length; i < l; i++) {
    const addX = points[i].x;
    const addY = points[i === points.length - 1 ? 0 : i + 1].y;
    const subX = points[i === points.length - 1 ? 0 : i + 1].x;
    const subY = points[i].y;
    
    total += (addX * addY * 0.5);
    total -= (subX * subY * 0.5);
  }
  
  return Math.abs(total);
};

/**
 * Find the center point of a polygon
 * @param points Array of points defining the polygon
 * @returns Center point
 */
export const findCenter = (points: Point[]): Point => {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0;
  let sumY = 0;
  
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
};

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Scale a point relative to an origin
 * @param point Point to scale
 * @param origin Origin point for scaling
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @returns Scaled point
 */
export const scalePoint = (
  point: Point, 
  origin: Point, 
  scaleX: number, 
  scaleY: number
): Point => {
  // Translate to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Scale
  const scaledX = translatedX * scaleX;
  const scaledY = translatedY * scaleY;
  
  // Translate back
  return {
    x: scaledX + origin.x,
    y: scaledY + origin.y
  };
};

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point for rotation
 * @param angle Angle in radians
 * @returns Rotated point
 */
export const rotatePoint = (
  point: Point, 
  origin: Point, 
  angle: number
): Point => {
  // Translate to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Rotate
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;
  
  // Translate back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
};

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Array of points defining the polygon
 * @returns True if point is inside
 */
export const isPointInsidePolygon = (point: Point, polygon: Point[]): boolean => {
  if (!polygon || polygon.length < 3) return false;
  
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
 * Validate polygon geometry
 * @param points Array of points defining the polygon
 * @returns True if valid
 */
export const validatePolygon = (points: Point[]): boolean => {
  // Need at least 3 points for a polygon
  if (!points || points.length < 3) return false;
  
  // Check if any two consecutive points are the same
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    if (p1.x === p2.x && p1.y === p2.y) {
      return false;
    }
  }
  
  // Check for self-intersection
  for (let i = 0; i < points.length; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % points.length];
    
    for (let j = i + 1; j < points.length; j++) {
      const b1 = points[j];
      const b2 = points[(j + 1) % points.length];
      
      // Skip adjacent edges
      if (i === (j + 1) % points.length || j === (i + 1) % points.length) {
        continue;
      }
      
      if (doLinesIntersect(a1, a2, b1, b2)) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Check if two line segments intersect
 * @param a1 First point of first line
 * @param a2 Second point of first line
 * @param b1 First point of second line
 * @param b2 Second point of second line
 * @returns True if lines intersect
 */
const doLinesIntersect = (a1: Point, a2: Point, b1: Point, b2: Point): boolean => {
  // Line segment intersection using cross product
  const ccw = (p: Point, q: Point, r: Point): boolean => {
    return (r.y - p.y) * (q.x - p.x) > (q.y - p.y) * (r.x - p.x);
  };
  
  return ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2);
};

/**
 * Calculate GIA (Gross Internal Area)
 * @param points Array of points defining the polygon
 * @returns Area in square units
 */
export const calculateGIA = (points: Point[]): number => {
  return calculatePolygonArea(points);
};

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Conversion factor
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = 100): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Conversion factor
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number = 100): number => {
  return meters * pixelsPerMeter;
};

/**
 * Format distance for display
 * @param distance Distance value
 * @param unit Unit of measurement
 * @returns Formatted string
 */
export const formatDistance = (distance: number, unit: string = 'm'): string => {
  return `${distance.toFixed(2)} ${unit}`;
};

/**
 * Format display distance
 * @param distance Distance in pixels
 * @returns Formatted distance string
 */
export const formatDisplayDistance = (distance: number): string => {
  const meters = pixelsToMeters(distance);
  return formatDistance(meters);
};

/**
 * Get straight-line distance between points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance
 */
export const getDistance = calculateDistance;

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
 * Check if a polygon is closed
 * @param points Polygon points
 * @returns True if closed
 */
export const isPolygonClosed = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  // Check if first and last points are the same (closed)
  return Math.abs(firstPoint.x - lastPoint.x) < 0.001 && 
         Math.abs(firstPoint.y - lastPoint.y) < 0.001;
};

/**
 * Get bounding box of a set of points
 * @param points Array of points
 * @returns Bounding box {min, max}
 */
export const getBoundingBox = (points: Point[]): { min: Point, max: Point } => {
  if (!points || points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  
  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
};

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * @param points Path points
 * @param tolerance Simplification tolerance
 * @returns Simplified path
 */
export const simplifyPath = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return [...points];
  
  const distanceFromLine = (p: Point, line: [Point, Point]): number => {
    const [a, b] = line;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l2 = dx * dx + dy * dy;
    
    if (l2 === 0) return calculateDistance(p, a);
    
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
    if (t < 0) return calculateDistance(p, a);
    if (t > 1) return calculateDistance(p, b);
    
    return calculateDistance(p, {
      x: a.x + t * dx,
      y: a.y + t * dy
    });
  };
  
  const simplifyRecursive = (points: Point[], start: number, end: number, tolerance: number, result: Point[]): void => {
    let maxDistance = 0;
    let index = 0;
    
    for (let i = start + 1; i < end; i++) {
      const distance = distanceFromLine(points[i], [points[start], points[end]]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    if (maxDistance > tolerance) {
      simplifyRecursive(points, start, index, tolerance, result);
      simplifyRecursive(points, index, end, tolerance, result);
    } else {
      if (end - start > 1) {
        result.push(points[end]);
      }
    }
  };
  
  const result: Point[] = [points[0]];
  simplifyRecursive(points, 0, points.length - 1, tolerance, result);
  return result;
};

/**
 * Smooth a path using Bezier interpolation
 * @param points Path points
 * @param tension Tension parameter (0-1)
 * @returns Smoothed path
 */
export const smoothPath = (points: Point[], tension: number = 0.5): Point[] => {
  if (points.length < 3) return [...points];
  
  const result: Point[] = [];
  const len = points.length;
  
  // Add first point
  result.push({ ...points[0] });
  
  for (let i = 0; i < len - 2; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < len - 2 ? points[i + 2] : points[len - 1];
    
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    // Add midpoint
    result.push({
      x: (cp1x + cp2x) / 2,
      y: (cp1y + cp2y) / 2
    });
  }
  
  // Add last point
  result.push({ ...points[len - 1] });
  
  return result;
};

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if exact multiple
 */
export const isExactGridMultiple = (value: number, gridSize: number): boolean => {
  return Math.abs(value % gridSize) < 0.0001;
};

/**
 * Calculate angle between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in radians
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Translate a point
 * @param point Point to translate
 * @param dx X translation
 * @param dy Y translation
 * @returns Translated point
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
};
