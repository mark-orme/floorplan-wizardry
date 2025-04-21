
/**
 * Geometry engine core functions
 * @module utils/geometry/engine
 */

import { Point } from '@/types/core/Geometry';

/**
 * Calculate the area of a polygon using the Shoelace formula
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
 * Calculate Gross Internal Area (GIA) by converting pixel area to square meters
 * @param points Polygon points in pixel coordinates
 * @param scale Scale factor (pixels per meter, default 100)
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], scale: number = 100): number {
  const pixelArea = calculatePolygonArea(points);
  return pixelArea / (scale * scale);
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
 * Calculate the midpoint between two points
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
 * Calculate perpendicular distance from a point to a line segment
 * @param point The point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSquared = dx * dx + dy * dy;
  
  if (lineLengthSquared === 0) {
    // Line is actually a point
    return calculateDistance(point, lineStart);
  }
  
  // Calculate projection of point onto line
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
  
  // Distance from point to this perpendicular point
  return calculateDistance(point, { x: projX, y: projY });
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
  
  // Translate point to origin
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
 * Translate a point
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
 * Scale a point from origin
 * @param point Point to scale
 * @param origin Origin point
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @returns Scaled point
 */
export function scalePoint(point: Point, origin: Point, scaleX: number, scaleY: number): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Find the center of a polygon
 * @param points Polygon points
 * @returns Center point
 */
export function findCenter(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
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
}

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 * @param point Point to check
 * @param polygon Array of points defining the polygon
 * @returns True if point is inside
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  // Implementation of the ray-casting algorithm
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
}

/**
 * Check if a polygon is valid (at least 3 points, no self-intersections)
 * @param points Polygon points
 * @returns True if valid
 */
export function validatePolygon(points: Point[]): boolean {
  // A polygon needs at least 3 points
  if (points.length < 3) return false;
  
  // TODO: Implement self-intersection check if needed
  
  return true;
}

/**
 * Check if a polygon is closed (first and last points are the same)
 * @param points Polygon points
 * @returns True if closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same
  return first.x === last.x && first.y === last.y;
}

/**
 * Get the bounding box of a set of points
 * @param points Array of points
 * @returns Bounding box as {min, max}
 */
export function getBoundingBox(points: Point[]): { min: Point, max: Point } {
  if (points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const { x, y } = points[i];
    
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  
  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
}

/**
 * Convert pixels to meters
 * @param pixels Pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Meters
 */
export function pixelsToMeters(pixels: number, scale: number = 100): number {
  return pixels / scale;
}

/**
 * Convert meters to pixels
 * @param meters Meters
 * @param scale Scale factor (pixels per meter)
 * @returns Pixels
 */
export function metersToPixels(meters: number, scale: number = 100): number {
  return meters * scale;
}

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * @param points Path points
 * @param tolerance Tolerance for simplification
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const firstHalf = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondHalf = simplifyPath(points.slice(index), tolerance);
    
    // Concatenate the results, avoiding duplicate points
    return firstHalf.slice(0, -1).concat(secondHalf);
  } else {
    // If max distance is less than tolerance, return just the endpoints
    return [firstPoint, lastPoint];
  }
}

/**
 * Optimize an array of points by removing points that are too close
 * @param points Array of points
 * @param tolerance Minimum distance between points
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 5): Point[] {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [points[0]];
  let lastPoint = points[0];
  
  for (let i = 1; i < points.length; i++) {
    const distance = calculateDistance(points[i], lastPoint);
    
    if (distance >= tolerance) {
      result.push(points[i]);
      lastPoint = points[i];
    }
  }
  
  // Always include the last point
  if (points.length > 1 && result[result.length - 1] !== points[points.length - 1]) {
    result.push(points[points.length - 1]);
  }
  
  return result;
}

/**
 * Snap points to a grid
 * @param points Array of points
 * @param gridSize Size of grid cells
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

/**
 * Smooth a path using Bezier curve interpolation
 * @param points Path points
 * @param tension Tension factor (0-1)
 * @returns Smoothed path
 */
export function smoothPath(points: Point[], tension: number = 0.5): Point[] {
  // Implement path smoothing if needed
  // For now, just return the original points
  return [...points];
}

/**
 * Format distance for display
 * @param distance Distance in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, scale: number = 100): string {
  const meters = pixelsToMeters(distance, scale);
  
  if (meters < 0.01) {
    return `${(meters * 10).toFixed(1)} mm`;
  } else if (meters < 1) {
    return `${(meters * 100).toFixed(1)} cm`;
  } else {
    return `${meters.toFixed(2)} m`;
  }
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if exact multiple
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  const remainder = Math.abs(value) % gridSize;
  return remainder < 0.0001 || Math.abs(remainder - gridSize) < 0.0001;
}

/**
 * Calculate the midpoint of multiple points
 * @param points Array of points
 * @returns Midpoint
 */
export function calculateMidpoint(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
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
}

/**
 * Calculate angle between three points
 * @param p1 First point
 * @param p2 Middle point (vertex)
 * @param p3 Third point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  
  let angle = angle2 - angle1;
  
  // Normalize angle to be between 0 and 2*PI
  if (angle < 0) angle += 2 * Math.PI;
  
  return angle;
}

/**
 * Get distance between two points
 * Alias for calculateDistance to maintain compatibility
 */
export function getDistance(p1: Point, p2: Point): number {
  return calculateDistance(p1, p2);
}

/**
 * Format distance for display with appropriate units
 * @param distanceInPixels Distance in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Formatted string
 */
export function formatDisplayDistance(distanceInPixels: number, scale: number = 100): string {
  return formatDistance(distanceInPixels, scale);
}
