
/**
 * Utility functions for grid snapping
 * @module utils/grid/snapping
 */
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Point } from '@/types/core/Point';

/**
 * Snap a point to the grid
 * 
 * @param point Point to snap
 * @param gridSize Grid size to snap to (defaults to constant)
 * @returns Snapped point
 */
export const snapPointToGrid = (
  point: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line's endpoints to the grid
 * 
 * @param start Starting point
 * @param end Ending point
 * @param gridSize Grid size to snap to
 * @returns Object with snapped start and end points
 */
export const snapLineToGrid = (
  start: Point, 
  end: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): { start: Point, end: Point } => {
  return {
    start: snapPointToGrid(start, gridSize),
    end: snapPointToGrid(end, gridSize)
  };
};

/**
 * Check if a point is already on a grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size
 * @param threshold Threshold for considering a point on grid
 * @returns Whether the point is on a grid intersection
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE,
  threshold: number = 0.5
): boolean => {
  const xOnGrid = Math.abs(point.x % gridSize) < threshold || 
                  Math.abs(point.x % gridSize - gridSize) < threshold;
  const yOnGrid = Math.abs(point.y % gridSize) < threshold || 
                  Math.abs(point.y % gridSize - gridSize) < threshold;
  
  return xOnGrid && yOnGrid;
};

/**
 * Snap an angle to nearest multiple of specified degrees
 * 
 * @param angleDegrees Angle in degrees
 * @param snapAngleDeg Angle increment to snap to
 * @returns Snapped angle in degrees
 */
export const snapAngleToIncrement = (
  angleDegrees: number, 
  snapAngleDeg: number = GRID_CONSTANTS.SNAP_ANGLE
): number => {
  return Math.round(angleDegrees / snapAngleDeg) * snapAngleDeg;
};

/**
 * Get the nearest grid point to the given point
 * 
 * @param point Original point
 * @param gridSize Grid size
 * @returns Nearest grid point
 */
export const getNearestGridPoint = (
  point: Point,
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): Point => {
  // Find the nearest grid coordinates
  const x = Math.round(point.x / gridSize) * gridSize;
  const y = Math.round(point.y / gridSize) * gridSize;
  
  return { x, y };
};

/**
 * Calculate distance to nearest grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size
 * @returns Distance to nearest grid intersection
 */
export const distanceToGrid = (
  point: Point,
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): number => {
  const nearest = getNearestGridPoint(point, gridSize);
  const dx = point.x - nearest.x;
  const dy = point.y - nearest.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};
