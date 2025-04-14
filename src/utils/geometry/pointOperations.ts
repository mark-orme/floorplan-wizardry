
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Check if two points are equal
 * @param p1 First point
 * @param p2 Second point
 * @param threshold Optional threshold for comparison
 * @returns True if points are equal
 */
export const arePointsEqual = (p1: Point, p2: Point, threshold: number = 0.001): boolean => {
  return Math.abs(p1.x - p2.x) < threshold && Math.abs(p1.y - p2.y) < threshold;
};

/**
 * Check if a point is near another point
 * @param p1 First point
 * @param p2 Second point
 * @param threshold Distance threshold
 * @returns True if points are within threshold
 */
export const isPointNear = (p1: Point, p2: Point, threshold: number = SNAP_THRESHOLD): boolean => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distSquared = dx * dx + dy * dy;
  
  return distSquared <= threshold * threshold;
};

/**
 * Check if a point is on a grid intersection
 * @param point Point to check
 * @param gridSize Grid size
 * @param threshold Threshold for comparison
 * @returns True if point is on grid
 */
export const isPointOnGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL, threshold: number = 0.001): boolean => {
  const xMod = point.x % gridSize;
  const yMod = point.y % gridSize;
  
  const xOnGrid = xMod < threshold || (gridSize - xMod) < threshold;
  const yOnGrid = yMod < threshold || (gridSize - yMod) < threshold;
  
  return xOnGrid && yOnGrid;
};

/**
 * Snap a point to grid
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};
