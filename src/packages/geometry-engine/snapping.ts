
import { Point } from './types';

/**
 * Snap a point to the nearest grid point
 * @param point Point to snap
 * @param gridSize Size of grid cells
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a point to the nearest point in a set of points
 * @param point Point to snap
 * @param points Set of points to snap to
 * @param threshold Maximum distance for snapping
 * @returns Snapped point or original if no points are within threshold
 */
export const snapToPoints = (point: Point, points: Point[], threshold: number): Point => {
  let minDist = threshold;
  let closest = point;
  
  for (const p of points) {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < minDist) {
      minDist = dist;
      closest = p;
    }
  }
  
  return closest;
};

/**
 * Check if a point is within snapping distance of any points
 * @param point Point to check
 * @param points Array of points to check against
 * @param threshold Snapping threshold distance
 * @returns True if point is within threshold of any points
 */
export const isWithinSnappingDistance = (
  point: Point, 
  points: Point[], 
  threshold: number
): boolean => {
  for (const p of points) {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < threshold) {
      return true;
    }
  }
  
  return false;
};
