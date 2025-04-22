
/**
 * WebAssembly geometry utilities
 * @module utils/wasm/geometryUtils
 */

import { Point } from '@/types/core/Geometry';
import { isWasmSupported, loadGeometryModule } from './wasmLoader';

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
  if (!isWasmSupported()) {
    return optimizePoints(points, tolerance);
  }
  
  try {
    const wasmModule = await loadGeometryModule();
    if (!wasmModule) {
      return optimizePoints(points, tolerance);
    }
    
    // This would be implemented using the WASM module
    // For now, fallback to JS implementation
    return optimizePoints(points, tolerance);
  } catch (error) {
    console.error('Error in WASM simplifyPolygon:', error);
    return optimizePoints(points, tolerance);
  }
}

/**
 * Optimize points by removing points that are too close together
 * or unnecessary for the shape.
 * @param points Array of points to optimize
 * @param tolerance Simplification tolerance
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return [...points];
  
  // Simple implementation of Ramer-Douglas-Peucker algorithm
  const result: Point[] = [];
  const stack: [number, number][] = [[0, points.length - 1]];
  const marked = new Set<number>();
  
  marked.add(0);
  marked.add(points.length - 1);
  
  while (stack.length > 0) {
    const [start, end] = stack.pop()!;
    
    if (end - start <= 1) continue;
    
    let maxDist = 0;
    let maxIndex = 0;
    
    const startPoint = points[start];
    const endPoint = points[end];
    
    // Find the point with the maximum distance
    for (let i = start + 1; i < end; i++) {
      const dist = perpendicularDistance(points[i], startPoint, endPoint);
      
      if (dist > maxDist) {
        maxDist = dist;
        maxIndex = i;
      }
    }
    
    // If the maximum distance is greater than the tolerance,
    // include the point and recursively process the segments
    if (maxDist > tolerance) {
      marked.add(maxIndex);
      stack.push([start, maxIndex]);
      stack.push([maxIndex, end]);
    }
  }
  
  // Collect all marked points
  for (let i = 0; i < points.length; i++) {
    if (marked.has(i)) {
      result.push(points[i]);
    }
  }
  
  return result;
}

/**
 * Calculate the perpendicular distance from a point to a line
 * @param point The point
 * @param lineStart Start of the line
 * @param lineEnd End of the line
 * @returns The perpendicular distance
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  const norm = Math.sqrt(dx * dx + dy * dy);
  
  // If the line is just a point, return the distance between points
  if (norm === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  // Calculate perpendicular distance
  const dist = Math.abs(
    (dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / norm
  );
  
  return dist;
}

/**
 * Calculate the distance between two points
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
 * Calculate the area of a polygon
 * @param points Polygon vertices
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
