
/**
 * Geometry engine utility functions
 * @module utils/geometry/engine
 */

import { Point, Rectangle } from '@/types/core/Geometry';

/**
 * Calculate area of a polygon using the Shoelace formula (Gauss's area formula)
 * 
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export function calculateArea(points: Point[]): number {
  return calculateAreaJs(points);
}

/**
 * Calculate area of a polygon using the Shoelace formula (Gauss's area formula)
 * Pure JavaScript implementation for fallback when WASM is not available
 * 
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export function calculateAreaJs(points: Point[]): number {
  // For empty or invalid polygons
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
 * Calculate Gross Internal Area (GIA)
 * @param points Array of points defining the polygon
 * @param pixelsPerMeter Scaling factor to convert pixels to meters
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], pixelsPerMeter: number = 100): number {
  const areaInPixels = calculateArea(points);
  return areaInPixels / (pixelsPerMeter * pixelsPerMeter);
}

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point for rotation
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
 * Translate a point by a vector
 * @param point Point to translate
 * @param dx X translation
 * @param dy Y translation
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
 * @param origin Origin point for scaling
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
 * Validate if a polygon is valid
 * @param points Polygon points
 * @returns True if the polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  return points.length >= 3;
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
  
  // Check if first and last points are the same
  return Math.abs(first.x - last.x) < 0.001 && Math.abs(first.y - last.y) < 0.001;
}

/**
 * Get bounding box of points
 * @param points Array of points
 * @returns Bounding rectangle
 */
export function getBoundingBox(points: Point[]): Rectangle {
  if (!points.length) return { x: 0, y: 0, width: 0, height: 0 };
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const point of points) {
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
 * Get midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Scaling factor
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
  return pixels / pixelsPerMeter;
}

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Scaling factor
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
  return meters * pixelsPerMeter;
}

/**
 * Simplify a path using Douglas-Peucker algorithm
 * @param points Array of points
 * @param tolerance Distance tolerance
 * @returns Simplified array of points
 */
export function simplifyPath(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  // Implementation of Douglas-Peucker algorithm
  const findPerpendicularDistance = (p: Point, p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    // If p1 and p2 are the same point
    if (dx === 0 && dy === 0) return Math.sqrt((p.x - p1.x) ** 2 + (p.y - p1.y) ** 2);
    
    const t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
    
    if (t < 0) return Math.sqrt((p.x - p1.x) ** 2 + (p.y - p1.y) ** 2);
    if (t > 1) return Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
    
    return Math.abs((dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x) / Math.sqrt(dx * dx + dy * dy));
  };
  
  const douglasPeucker = (points: Point[], tolerance: number): Point[] => {
    if (points.length <= 2) return points;
    
    // Find the point with the maximum distance
    let maxDistance = 0;
    let maxIndex = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = findPerpendicularDistance(points[i], points[0], points[points.length - 1]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      const firstSegment = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
      const secondSegment = douglasPeucker(points.slice(maxIndex), tolerance);
      
      // Concatenate the two segments without duplicate points
      return [...firstSegment.slice(0, -1), ...secondSegment];
    } else {
      // If all points are within tolerance, return just the endpoints
      return [points[0], points[points.length - 1]];
    }
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Smooth a path using Bezier curves
 * @param points Array of points
 * @param tension Tension parameter (0-1)
 * @returns Smoothed array of points
 */
export function smoothPath(points: Point[], tension: number = 0.5): Point[] {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [];
  const len = points.length;
  
  // Add first point
  result.push(points[0]);
  
  // Add intermediate points with smoothing
  for (let i = 0; i < len - 2; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < len - 2 ? points[i + 2] : p2;
    
    // Add several points for each segment
    for (let t = 0; t < 1; t += 0.1) {
      const t2 = t * t;
      const t3 = t2 * t;
      
      // Catmull-Rom to Cubic Bezier conversion
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      
      result.push({ x, y });
    }
  }
  
  // Add last point
  result.push(points[len - 1]);
  
  return result;
}

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Format distance value for display
 * @param distance Distance value in pixels
 * @param pixelsPerMeter Scaling factor
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, pixelsPerMeter: number = 100): string {
  const meters = pixelsToMeters(distance, pixelsPerMeter);
  
  if (meters < 1) {
    // Show in centimeters if less than 1 meter
    return `${Math.round(meters * 100)} cm`;
  } else {
    // Show in meters with 2 decimal places
    return `${meters.toFixed(2)} m`;
  }
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is an exact multiple of grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  const remainder = Math.abs(value) % gridSize;
  return remainder < 0.001 || Math.abs(remainder - gridSize) < 0.001;
}

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export function calculateMidpoint(p1: Point, p2: Point): Point {
  return getMidpoint(p1, p2);
}

/**
 * Calculate angle between three points
 * @param p1 First point
 * @param p2 Center point
 * @param p3 Third point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  return angle2 - angle1;
}

/**
 * Get distance between two points (alias for calculateDistance)
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export function getDistance(p1: Point, p2: Point): number {
  return calculateDistance(p1, p2);
}

/**
 * Format distance for display with different units
 * @param distance Distance in pixels
 * @param pixelsPerMeter Scaling factor
 * @returns Formatted distance string
 */
export function formatDisplayDistance(distance: number, pixelsPerMeter: number = 100): string {
  return formatDistance(distance, pixelsPerMeter);
}
