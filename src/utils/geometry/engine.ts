/**
 * Geometry Engine Utilities
 * Core geometry calculation functions
 */
import { Point, LineSegment, Polygon } from '@/types/core/Geometry';

/**
 * Calculate the area of a polygon
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
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
 * @returns Distance between the points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
}

/**
 * Check if a point is inside a polygon
 * @param point The point to check
 * @param polygon Array of points defining the polygon
 * @returns True if the point is inside the polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const intersect = 
      ((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
      (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / 
      (polygon[j].y - polygon[i].y) + polygon[i].x);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Find the center point of a polygon
 * @param points Array of points defining the polygon
 * @returns Center point of the polygon
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
 * Simplify a path using the Douglas-Peucker algorithm
 * @param points Original path points
 * @param tolerance Simplification tolerance
 * @returns Simplified path points
 */
export function simplifyPath(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  const findFurthestPoint = (start: Point, end: Point, points: Point[]): {index: number, distance: number} => {
    let maxDistance = 0;
    let index = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    return { index, distance: maxDistance };
  };
  
  // Recursive simplification
  const simplifyRecursive = (points: Point[], start: number, end: number): Point[] => {
    const startPoint = points[start];
    const endPoint = points[end];
    
    if (end - start <= 1) return [startPoint, endPoint];
    
    const { index, distance } = findFurthestPoint(startPoint, endPoint, points.slice(start, end + 1));
    const actualIndex = start + index;
    
    if (distance > tolerance) {
      // Recursive simplification
      const left = simplifyRecursive(points, start, actualIndex);
      const right = simplifyRecursive(points, actualIndex, end);
      
      // Combine results (avoid duplicating the middle point)
      return [...left.slice(0, -1), ...right];
    } else {
      return [startPoint, endPoint];
    }
  };
  
  return simplifyRecursive(points, 0, points.length - 1);
}

/**
 * Calculate perpendicular distance from a point to a line
 * @param point The point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length squared
  const lineLengthSq = dx * dx + dy * dy;
  
  if (lineLengthSq === 0) {
    // Line is a point, return distance to the point
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  // Calculate projection
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSq;
  
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
  
  // Projection point
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  // Return distance to projection
  return Math.sqrt(
    Math.pow(point.x - projX, 2) + 
    Math.pow(point.y - projY, 2)
  );
}

/**
 * Snap points to a grid
 * @param points Array of points
 * @param gridSize Grid size
 * @returns Snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number = 10): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

/**
 * Initialize geometry engine
 * This is a placeholder for async initialization if needed in the future
 */
export function initGeometryEngine(): Promise<boolean> {
  return Promise.resolve(true);
}
