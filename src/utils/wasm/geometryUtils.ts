
/**
 * WebAssembly geometry utilities
 * @module utils/wasm/geometryUtils
 */

import { Point } from '@/types/core/Geometry';
import { supportsWasm, wasmStatus, calculateArea } from './index';
import { simplifyPath as simplifyPathJs } from '../geometry/engine';

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
