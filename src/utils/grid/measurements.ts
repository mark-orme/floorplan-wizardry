
/**
 * Grid measurement operations
 * Functions for calculating distances and measurements related to the grid
 * @module grid/measurements
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';

/**
 * Calculate distance from a point to the nearest grid line
 * Used for implementing snap-to-grid functionality
 * 
 * @param point - The point to check (in meters)
 * @returns Distance to nearest grid line (in meters)
 */
export const distanceToNearestGridLine = (point: Point): number => {
  const xDist = point.x % GRID_SIZE;
  const yDist = point.y % GRID_SIZE;
  
  // Calculate distance to nearest grid line in each dimension
  const xDistToLine = Math.min(xDist, GRID_SIZE - xDist);
  const yDistToLine = Math.min(yDist, GRID_SIZE - yDist);
  
  // Return the minimum distance
  return Math.min(xDistToLine, yDistToLine);
};
