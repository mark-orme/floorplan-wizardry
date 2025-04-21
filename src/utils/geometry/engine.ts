import { Point } from "@/types/core/Geometry";

/**
 * Calculate the area of a polygon given an array of points
 * @param points Array of points forming the polygon
 * @returns The area of the polygon
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Calculate the distance between two points
 * @param point1 First point
 * @param point2 Second point 
 * @returns The distance between the points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find the center point of an array of points
 * @param points Array of points
 * @returns The center point
 */
export function findCenter(points: Point[]): Point {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  
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
 * Check if a point is inside a polygon
 * @param point The point to check
 * @param polygon Array of points forming the polygon
 * @returns True if the point is inside the polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
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
}

/**
 * Get the midpoint between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns The midpoint
 */
export function getMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Get the perpendicular distance from a point to a line defined by two points
 * @param point The point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns The perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSquared = dx * dx + dy * dy;
  
  if (lineLengthSquared === 0) {
    // Line is actually a point
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  // Calculate projection of point onto line
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Point is beyond lineStart
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  if (t > 1) {
    // Point is beyond lineEnd
    return Math.sqrt(
      Math.pow(point.x - lineEnd.x, 2) + 
      Math.pow(point.y - lineEnd.y, 2)
    );
  }
  
  // Perpendicular point on line
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  // Distance from point to this perpendicular point
  return Math.sqrt(
    Math.pow(point.x - projX, 2) + 
    Math.pow(point.y - projY, 2)
  );
}

/**
 * Optimize an array of points by removing redundant ones
 * @param points Array of points to optimize
 * @param tolerance Distance tolerance for simplification
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate distance between curr and line from prev to next
    const d = perpendicularDistance(curr, prev, next);
    
    if (d > tolerance) {
      result.push(curr);
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
}

/**
 * Snap points to a grid
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export function snapPointsToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
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
export function scalePoint(point: Point, origin: Point, scaleX: number, scaleY: number = scaleX): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Rotate a point around origin
 * @param point Point to rotate
 * @param origin Origin point
 * @param angle Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  
  // Translate point to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Rotate point
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;
  
  // Translate point back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
}

/**
 * Translate a point by a vector
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
 * Check if a polygon is valid
 * @param points Array of points forming the polygon
 * @returns True if the polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  // A polygon needs at least 3 points
  if (points.length < 3) return false;
  
  // Check if all points are valid
  for (const point of points) {
    if (typeof point.x !== 'number' || typeof point.y !== 'number' ||
        !isFinite(point.x) || !isFinite(point.y)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if a polygon is closed
 * @param points Array of points forming the polygon
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Calculate distance between first and last point
  const dx = first.x - last.x;
  const dy = first.y - last.y;
  const distanceSquared = dx * dx + dy * dy;
  
  // If distance is small enough, consider it closed
  return distanceSquared < 0.0001;
}

/**
 * Get the bounding box of a set of points
 * @param points Array of points
 * @returns Bounding box as {minX, minY, maxX, maxY}
 */
export function getBoundingBox(points: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
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
  
  return { minX, minY, maxX, maxY };
}

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
  return pixels / pixelsPerMeter;
}

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
  return meters * pixelsPerMeter;
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 * @param points Array of points defining the path
 * @param tolerance Simplification tolerance
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return points;
  
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
    // Recursive simplification
    const firstSegment = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondSegment = simplifyPath(points.slice(index), tolerance);
    
    // Concat the two simplified segments
    return [...firstSegment.slice(0, -1), ...secondSegment];
  } else {
    // If max distance is less than tolerance, all points between start and end can be removed
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Smooth a path using a moving average
 * @param points Array of points defining the path
 * @param windowSize Window size for moving average
 * @returns Smoothed path
 */
export function smoothPath(points: Point[], windowSize: number = 3): Point[] {
  if (points.length < windowSize) return points;
  
  const result: Point[] = [];
  
  // Keep first point
  result.push(points[0]);
  
  // Apply moving average
  for (let i = 1; i < points.length - 1; i++) {
    let sumX = 0;
    let sumY = 0;
    
    // Calculate window bounds
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(points.length - 1, i + Math.floor(windowSize / 2));
    
    // Calculate average
    for (let j = start; j <= end; j++) {
      sumX += points[j].x;
      sumY += points[j].y;
    }
    
    result.push({
      x: sumX / (end - start + 1),
      y: sumY / (end - start + 1)
    });
  }
  
  // Keep last point
  result.push(points[points.length - 1]);
  
  return result;
}

/**
 * Format a distance value with unit
 * @param distance Distance value
 * @param unit Unit string
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, unit: string = 'm'): string {
  return `${distance.toFixed(2)} ${unit}`;
}

/**
 * Calculate the GIA (Gross Internal Area) of a polygon
 * @param points Array of points forming the polygon
 * @param pixelsPerMeter Pixels per meter ratio
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], pixelsPerMeter: number = 100): number {
  const areaInPixels = calculatePolygonArea(points);
  return areaInPixels / (pixelsPerMeter * pixelsPerMeter);
}

/**
 * Check if a value is an exact multiple of grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is exact multiple of grid size
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  return Math.abs(Math.round(value / gridSize) * gridSize - value) < 0.001;
}

/**
 * Calculate the midpoint of a set of points
 * @param points Array of points
 * @returns Midpoint
 */
export function calculateMidpoint(points: Point[]): Point {
  return findCenter(points);
}

/**
 * Calculate angle between three points
 * @param p1 First point
 * @param p2 Second point (vertex)
 * @param p3 Third point
 * @returns Angle in radians
 */
export function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  
  let angle = angle2 - angle1;
  
  // Normalize angle
  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  
  return angle;
}

/**
 * Get distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance
 */
export function getDistance(p1: Point, p2: Point): number {
  return calculateDistance(p1, p2);
}

/**
 * Format distance for display
 * @param distance Distance value
 * @param precision Decimal precision
 * @returns Formatted distance string
 */
export function formatDisplayDistance(distance: number, precision: number = 2): string {
  const units = [
    { threshold: 0.01, unit: 'mm', factor: 1000 },
    { threshold: 1, unit: 'cm', factor: 100 },
    { threshold: 100, unit: 'm', factor: 1 },
    { threshold: 1000, unit: 'km', factor: 0.001 }
  ];
  
  let unitInfo = units[2]; // Default to meters
  
  for (let i = 0; i < units.length; i++) {
    if (distance < units[i].threshold) {
      unitInfo = i === 0 ? units[0] : units[i - 1];
      break;
    }
  }
  
  const convertedValue = distance * unitInfo.factor;
  return `${convertedValue.toFixed(precision)} ${unitInfo.unit}`;
}
