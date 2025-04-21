
/**
 * Geometry utility functions
 * @module utils/geometry
 */

import { Point } from '@/types/core/Geometry';

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
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perimeter of a polygon
 * @param points Points defining the polygon
 * @returns Perimeter length
 */
export function calculatePerimeter(points: Point[]): number {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length]; // Loop back to first point
    perimeter += calculateDistance(p1, p2);
  }
  
  return perimeter;
}

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 * @param point Point to check
 * @param polygon Array of points defining the polygon
 * @returns True if the point is inside the polygon
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
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
 * Calculate center point of a polygon
 * @param points Points defining the polygon
 * @returns Center point
 */
export function calculateCentroid(points: Point[]): Point {
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
