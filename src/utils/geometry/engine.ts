
/**
 * Geometry calculation engine
 * @module utils/geometry/engine
 */

/**
 * Point interface representing a 2D coordinate
 */
export interface Point {
  x: number;
  y: number;
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
 * Calculate the perpendicular distance from a point to a line
 * @param point The point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns The perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Handle case where line is a point
  if (dx === 0 && dy === 0) {
    return calculateDistance(point, lineStart);
  }
  
  // Calculate perpendicular distance using the formula
  // |Ax + By + C| / sqrt(A² + B²)
  // where line equation is Ax + By + C = 0
  const A = dy;
  const B = -dx;
  const C = lineStart.x * lineEnd.y - lineEnd.x * lineStart.y;
  
  return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
}

/**
 * Calculate the area of a polygon
 * @param points Vertices of the polygon
 * @returns Area of the polygon
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  
  // Use the Shoelace formula (Gauss's area formula)
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  
  // Return absolute value of half the summation
  return Math.abs(area / 2);
}

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * @param points Original path points
 * @param tolerance Simplification tolerance (higher = more simplified)
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
    // Recursive case: split the path and simplify each part
    const firstPart = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondPart = simplifyPath(points.slice(index), tolerance);
    
    // Concatenate the two parts (avoiding duplicate points)
    return [...firstPart.slice(0, -1), ...secondPart];
  } else {
    // Base case: use only the endpoints
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Optimize a set of points by removing redundant vertices
 * @param points Original points
 * @param tolerance Optimization tolerance
 * @returns Optimized points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  return simplifyPath(points, tolerance);
}

/**
 * Snap points to a grid
 * @param points Points to snap
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
 * Smooth a path using Bezier curve interpolation
 * @param points Original path
 * @param tension Tension parameter (0-1)
 * @returns Smoothed path with added control points
 */
export function smoothPath(points: Point[], tension: number = 0.5): Point[] {
  if (points.length < 3) return [...points];
  
  const smoothed: Point[] = [];
  tension = Math.max(0, Math.min(1, tension)); // Clamp tension between 0 and 1
  
  // Add first point
  smoothed.push(points[0]);
  
  // Generate control points and bezier curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;
    
    // Calculate control points
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    // Add control points and destination
    smoothed.push({ x: cp1x, y: cp1y });
    smoothed.push({ x: cp2x, y: cp2y });
    smoothed.push(p2);
  }
  
  return smoothed;
}

/**
 * Format a distance for display
 * @param distance Distance in pixels
 * @param precision Decimal precision
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, precision: number = 2): string {
  return distance.toFixed(precision);
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param value The value to check
 * @param gridSize The grid size
 * @returns True if the value is an exact multiple
 */
export function isExactGridMultiple(value: number, gridSize: number): boolean {
  return Math.abs(value % gridSize) < 0.001;
}

/**
 * Calculate the midpoint between two points
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
 * Calculate the angle between two points in radians
 * @param point1 First point
 * @param point2 Second point
 * @returns Angle in radians
 */
export function calculateAngle(point1: Point, point2: Point): number {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

/**
 * Get the distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance between points
 */
export function getDistance(point1: Point, point2: Point): number {
  return calculateDistance(point1, point2);
}

/**
 * Format a distance for display with units
 * @param distance Distance in pixels
 * @param scale Scale factor (pixels to meters)
 * @param precision Decimal precision
 * @returns Formatted distance string with units
 */
export function formatDisplayDistance(distance: number, scale: number = 1, precision: number = 2): string {
  const meters = distance * scale;
  
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(precision)} km`;
  } else {
    return `${meters.toFixed(precision)} m`;
  }
}

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point
 * @param angle Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  // Translate point to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Rotate
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
  const rotatedY = translatedX * sinAngle + translatedY * cosAngle;
  
  // Translate back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
}

/**
 * Translate a point by a given offset
 * @param point Point to translate
 * @param offsetX X-axis offset
 * @param offsetY Y-axis offset
 * @returns Translated point
 */
export function translatePoint(point: Point, offsetX: number, offsetY: number): Point {
  return {
    x: point.x + offsetX,
    y: point.y + offsetY
  };
}

/**
 * Scale a point from an origin
 * @param point Point to scale
 * @param origin Origin point
 * @param scaleX X-axis scale factor
 * @param scaleY Y-axis scale factor
 * @returns Scaled point
 */
export function scalePoint(
  point: Point,
  origin: Point,
  scaleX: number,
  scaleY: number = scaleX
): Point {
  // Translate point to origin
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
}

/**
 * Validate a polygon for correctness
 * @param points Polygon vertices
 * @returns True if the polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  // Check if we have at least 3 points
  if (points.length < 3) return false;
  
  // Check if the polygon is closed
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const isClosed = firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y;
  
  // Check for self-intersection (simplified check)
  // A comprehensive check would be more complex
  
  return isClosed;
}

/**
 * Check if a polygon is closed
 * @param points Polygon vertices
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (points.length < 3) return false;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y;
}

/**
 * Get the bounding box of a set of points
 * @param points Collection of points
 * @returns Bounding box {minX, minY, maxX, maxY, width, height}
 */
export function getBoundingBox(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
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
 * Get the midpoint of a set of points
 * @param points Collection of points
 * @returns Midpoint
 */
export function getMidpoint(points: Point[]): Point {
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
 * Convert pixels to meters
 * @param pixels Distance in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Distance in meters
 */
export function pixelsToMeters(pixels: number, scale: number): number {
  return pixels / scale;
}

/**
 * Convert meters to pixels
 * @param meters Distance in meters
 * @param scale Scale factor (pixels per meter)
 * @returns Distance in pixels
 */
export function metersToPixels(meters: number, scale: number): number {
  return meters * scale;
}

/**
 * Calculate Gross Internal Area (GIA)
 * @param points Polygon vertices representing the internal area
 * @param scale Scale factor (pixels per meter)
 * @returns Area in square meters
 */
export function calculateGIA(points: Point[], scale: number): number {
  const pixelArea = calculatePolygonArea(points);
  return pixelArea / (scale * scale);
}
