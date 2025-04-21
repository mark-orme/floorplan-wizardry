
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
