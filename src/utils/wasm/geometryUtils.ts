
/**
 * WebAssembly geometry utilities
 * @module utils/wasm/geometryUtils
 */

import { Point } from '@/types/core/Geometry';
import { supportsWasm, wasmStatus, calculateArea } from './index';
import { 
  simplifyPath as simplifyPathJs,
  calculatePolygonArea as calculatePolygonAreaJs,
  calculateDistance as calculateDistanceJs
} from '../geometry/engine';

/**
 * Simplify a polygon path using WASM when available
 * @param points Array of points
 * @param tolerance Tolerance for simplification
 * @returns Simplified polygon
 */
export async function simplifyPolygon(points: Point[], tolerance: number = 1.0): Promise<Point[]> {
  // For small paths, just return them
  if (!points || points.length <= 2) {
    return [...points];
  }
  
  // If WASM is not supported, use JS implementation
  if (!supportsWasm() || wasmStatus.error) {
    return simplifyPathJs(points, tolerance);
  }
  
  try {
    // Use WASM implementation for better performance
    // This would call the WASM-backed implementation
    return simplifyPathJs(points, tolerance); // Temporary fallback
  } catch (error) {
    console.error('Error in WASM simplifyPolygon:', error);
    return simplifyPathJs(points, tolerance);
  }
}

/**
 * Calculate polygon area using WASM when available
 * @param points Polygon points
 * @returns Area of the polygon
 */
export async function calculatePolygonAreaWasm(points: Point[]): Promise<number> {
  return calculateArea(points);
}

/**
 * Calculate polygon area in square meters
 * @param points Polygon points
 * @param scale Scale factor (pixels to meters)
 * @returns Area in square meters
 */
export async function calculateAreaInSquareMeters(points: Point[], scale: number = 1): Promise<number> {
  const areaInPixels = await calculatePolygonAreaWasm(points);
  return areaInPixels * scale * scale;
}

/**
 * Optimize polygon points by removing redundant vertices
 * @param points Original polygon points
 * @param tolerance Simplification tolerance
 * @returns Optimized polygon points
 */
export async function optimizePolygon(points: Point[], tolerance: number = 1.0): Promise<Point[]> {
  return simplifyPolygon(points, tolerance);
}

/**
 * Check if a point is inside a polygon
 * @param point The point to check
 * @param polygon Polygon points
 * @returns True if the point is inside the polygon
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
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
 * Calculate the perimeter of a polygon
 * @param points Polygon points
 * @returns Perimeter length
 */
export function calculatePerimeter(points: Point[]): number {
  let perimeter = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    perimeter += calculateDistanceJs(points[i], points[j]);
  }
  return perimeter;
}

/**
 * Calculate the centroid of a polygon
 * @param points Polygon points
 * @returns Centroid point
 */
export function calculateCentroid(points: Point[]): Point {
  let area = 0;
  let cx = 0;
  let cy = 0;
  
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x, yi = points[i].y;
    const xj = points[j].x, yj = points[j].y;
    
    const f = xi * yj - xj * yi;
    area += f;
    cx += (xi + xj) * f;
    cy += (yi + yj) * f;
  }
  
  area /= 2;
  const factor = 1 / (6 * area);
  
  return {
    x: cx * factor,
    y: cy * factor
  };
}
