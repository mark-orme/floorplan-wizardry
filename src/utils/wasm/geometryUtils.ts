
/**
 * Enhanced geometry utilities using WebAssembly
 * @module utils/wasm/geometryUtils
 */

import { Point } from '@/types/core/Geometry';
import { calculateArea, simplifyPath } from './index';
import logger from '@/utils/logger';

/**
 * Calculate area of a polygon in square meters
 * @param points Array of points defining the polygon
 * @param pixelsPerMeter Conversion factor from pixels to meters
 * @returns Area in square meters
 */
export async function calculateAreaInSquareMeters(
  points: Point[],
  pixelsPerMeter: number = 100
): Promise<number> {
  try {
    // Calculate area in pixels using WASM when available
    const areaInPixels = await calculateArea(points);
    
    // Convert to square meters
    const areaInSquareMeters = areaInPixels / (pixelsPerMeter * pixelsPerMeter);
    
    // Round to 2 decimal places
    return Math.round(areaInSquareMeters * 100) / 100;
  } catch (error) {
    logger.error('Error calculating area in square meters:', error);
    return 0;
  }
}

/**
 * Check if a point is inside a polygon
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
 * Optimize a polygon path by removing redundant points
 * @param points Original points
 * @param tolerance Tolerance for simplification
 * @returns Optimized points
 */
export async function optimizePolygon(
  points: Point[],
  tolerance: number = 1.0
): Promise<Point[]> {
  try {
    // Use WASM-based simplification
    return await simplifyPath(points, tolerance);
  } catch (error) {
    logger.error('Error optimizing polygon:', error);
    return points;
  }
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
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
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
