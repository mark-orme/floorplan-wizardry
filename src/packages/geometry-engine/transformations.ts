
/**
 * Geometry transformations and optimizations
 */

import { Point } from '@/types/floorPlanTypes';

/**
 * Optimize a set of points by removing redundant or closely spaced points
 * @param points - Array of points to optimize
 * @param tolerance - Distance tolerance (points closer than this are merged)
 * @returns Optimized points array
 */
export function optimizePoints(points: Point[], tolerance = 5): Point[] {
  if (!points || points.length <= 2) return points;

  const result: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - lastPoint.x, 2) + 
      Math.pow(currentPoint.y - lastPoint.y, 2)
    );

    if (distance >= tolerance) {
      result.push(currentPoint);
      lastPoint = currentPoint;
    }
  }

  // Always include the last point if it's different from the current last
  const lastOriginalPoint = points[points.length - 1];
  const lastResultPoint = result[result.length - 1];
  
  if (
    lastOriginalPoint.x !== lastResultPoint.x ||
    lastOriginalPoint.y !== lastResultPoint.y
  ) {
    result.push(lastOriginalPoint);
  }

  return result;
}

/**
 * Calculate the centroid of a set of points
 * @param points - Array of points
 * @returns Centroid point
 */
export function calculateCentroid(points: Point[]): Point {
  if (!points || points.length === 0) {
    return { x: 0, y: 0 };
  }

  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }),
    { x: 0, y: 0 }
  );

  return {
    x: sum.x / points.length,
    y: sum.y / points.length
  };
}

/**
 * Apply a transformation matrix to a point
 * @param point - Point to transform
 * @param matrix - Transformation matrix [a, b, c, d, e, f]
 * @returns Transformed point
 */
export function transformPoint(point: Point, matrix: number[]): Point {
  if (!point || !matrix || matrix.length !== 6) {
    return point;
  }

  const [a, b, c, d, e, f] = matrix;
  
  return {
    x: a * point.x + c * point.y + e,
    y: b * point.x + d * point.y + f
  };
}

/**
 * Snap points to the nearest grid intersection
 * @param points - Array of points to snap
 * @param gridSize - Size of the grid
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  if (!points || !Array.isArray(points)) return [];
  if (!gridSize || gridSize <= 0) return [...points];

  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
