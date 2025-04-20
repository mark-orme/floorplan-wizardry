
import { Point } from './types';
import { calculateDistance } from './core';

/**
 * Snap a point to the grid
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snap a point to the nearest point in a collection
 * @param point Point to snap
 * @param points Collection of points to snap to
 * @param threshold Maximum snapping distance
 * @returns Snapped point or original point if no snap
 */
export function snapToPoints(
  point: Point,
  points: Point[],
  threshold: number
): Point {
  let closestPoint = point;
  let minDistance = threshold;
  
  for (const target of points) {
    const distance = calculateDistance(point, target);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = target;
    }
  }
  
  return closestPoint;
}

/**
 * Check if a point is within snapping distance of another point
 * @param point Point to check
 * @param target Target point
 * @param threshold Snapping threshold
 * @returns Whether the point is within snapping distance
 */
export function isWithinSnappingDistance(
  point: Point,
  target: Point,
  threshold: number
): boolean {
  return calculateDistance(point, target) <= threshold;
}
