
/**
 * Geometry Engine
 * Core geometry calculation utilities for the application
 */
import { Point, Rectangle, BoundingBox, Circle, Polygon, LineSegment } from '@/types/core/Geometry';

/**
 * Calculate distance between two points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate area of a polygon
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
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
}

/**
 * Calculate Gross Internal Area (GIA)
 */
export function calculateGIA(points: Point[], scale: number = 1): number {
  return calculatePolygonArea(points) / (scale * scale);
}

/**
 * Rotate a point around an origin
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  const x = origin.x + (point.x - origin.x) * cos - (point.y - origin.y) * sin;
  const y = origin.y + (point.x - origin.x) * sin + (point.y - origin.y) * cos;
  
  return { x, y };
}

/**
 * Translate a point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return { x: point.x + dx, y: point.y + dy };
}

/**
 * Scale a point from an origin
 */
export function scalePoint(point: Point, origin: Point, sx: number, sy: number): Point {
  return {
    x: origin.x + (point.x - origin.x) * sx,
    y: origin.y + (point.y - origin.y) * sy
  };
}

/**
 * Check if a polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  // Minimum 3 points required for a polygon
  if (points.length < 3) return false;
  
  // Check for self-intersection
  for (let i = 0; i < points.length; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % points.length];
    
    for (let j = i + 1; j < points.length; j++) {
      const b1 = points[j];
      const b2 = points[(j + 1) % points.length];
      
      // Skip adjacent edges
      if (j === (i + 1) % points.length || i === (j + 1) % points.length) continue;
      
      // Check if the segments intersect
      if (doLineSegmentsIntersect(a1, a2, b1, b2)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Check if a polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same or very close
  return calculateDistance(first, last) < 0.001;
}

/**
 * Get the bounding box of a set of points
 */
export function getBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
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
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
}

/**
 * Get the midpoint of a line segment
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Calculate midpoint between two points
 */
export function calculateMidpoint(p1: Point, p2: Point): Point {
  return getMidpoint(p1, p2);
}

/**
 * Convert pixels to meters using a scale factor
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
  return pixels / pixelsPerMeter;
}

/**
 * Convert meters to pixels using a scale factor
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
  return meters * pixelsPerMeter;
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return [...points];
  
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
    // Recursive call
    const firstHalf = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondHalf = simplifyPath(points.slice(index), tolerance);
    
    // Concat the two sets
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    // Return just the end points
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Optimize a set of points to reduce complexity
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  return simplifyPath(points, tolerance);
}

/**
 * Smooth a path by adding intermediate points
 */
export function smoothPath(points: Point[], smoothness: number = 0.5): Point[] {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [];
  
  // Add the first point
  result.push(points[0]);
  
  // Add intermediate points
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    
    // Add intermediate points using Catmull-Rom spline
    for (let t = 0; t < 1; t += 0.1) {
      const point = catmullRomPoint(p0, p1, p2, p3, t, smoothness);
      result.push(point);
    }
  }
  
  // Add the last point
  result.push(points[points.length - 1]);
  
  return result;
}

/**
 * Format a distance for display
 */
export function formatDistance(distance: number, unit: string = 'm'): string {
  return `${distance.toFixed(2)} ${unit}`;
}

/**
 * Format a distance for display with appropriate units
 */
export function formatDisplayDistance(distanceInPixels: number, scale: number = 1): string {
  const meters = pixelsToMeters(distanceInPixels, scale);
  
  if (meters < 1) {
    return `${(meters * 100).toFixed(0)} cm`;
  } else if (meters < 1000) {
    return `${meters.toFixed(2)} m`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}

/**
 * Check if a number is exactly divisible by a grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  return Math.abs(value % gridSize) < 0.001;
}

/**
 * Calculate the angle between two points
 */
export function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}

/**
 * Get distance between two points (alias for calculateDistance)
 */
export function getDistance(p1: Point, p2: Point): number {
  return calculateDistance(p1, p2);
}

/**
 * Find the center of a polygon
 */
export function findCenter(points: Point[]): Point {
  const bbox = getBoundingBox(points);
  return {
    x: (bbox.min.x + bbox.max.x) / 2,
    y: (bbox.min.y + bbox.max.y) / 2
  };
}

/**
 * Check if a point is inside a polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  // Ray casting algorithm
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Initialize the geometry engine (placeholder for future enhancements)
 */
export async function initGeometryEngine(): Promise<void> {
  // This is a placeholder for future WebAssembly or worker initialization
  console.log('Geometry engine initialized');
  return Promise.resolve();
}

// Helper functions

/**
 * Calculate the perpendicular distance of a point from a line
 */
function perpendicularDistance(p: Point, line1: Point, line2: Point): number {
  const area = Math.abs(
    (line2.y - line1.y) * p.x - 
    (line2.x - line1.x) * p.y + 
    line2.x * line1.y - 
    line2.y * line1.x
  ) / 2;
  
  const lineLength = calculateDistance(line1, line2);
  
  return area / lineLength * 2;
}

/**
 * Calculate a point on a Catmull-Rom spline
 */
function catmullRomPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number, alpha: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  
  // Catmull-Rom matrix coefficients
  const c1 = 2 * p1.x;
  const c2 = -p0.x + p2.x;
  const c3 = 2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x;
  const c4 = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
  
  const d1 = 2 * p1.y;
  const d2 = -p0.y + p2.y;
  const d3 = 2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y;
  const d4 = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
  
  const x = 0.5 * (c1 + t * c2 + t2 * c3 + t3 * c4);
  const y = 0.5 * (d1 + t * d2 + t2 * d3 + t3 * d4);
  
  return { x, y };
}

/**
 * Check if two line segments intersect
 */
function doLineSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  // Calculate the direction of the lines
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  // Calculate the determinant
  const det = d1x * d2y - d1y * d2x;
  
  // If det is zero, lines are parallel
  if (det === 0) return false;
  
  // Calculate the cross products
  const s = (d1x * (p1.y - p3.y) - d1y * (p1.x - p3.x)) / det;
  const t = (d2x * (p1.y - p3.y) - d2y * (p1.x - p3.x)) / det;
  
  // Check if the intersection is within the segments
  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}
