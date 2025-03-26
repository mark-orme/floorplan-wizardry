
/**
 * Core grid operations 
 * Basic utilities for grid snapping and alignment
 * @module grid/core
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { FLOATING_POINT_TOLERANCE } from '../geometry/constants';
import logger from '../logger';

/** 
 * Snap a single point to the nearest grid intersection
 * Critical utility for ensuring walls start and end exactly on grid lines
 * Performs mathematical rounding to ensure precise alignment with grid
 * 
 * @param {Point} point - The point to snap (in meters)
 * @param {number} gridSize - Optional grid size in meters (defaults to GRID_SIZE constant)
 * @returns {Point} Snapped point with exact grid alignment (in meters)
 */
export function snapToGrid(point: Point, gridSize = GRID_SIZE): Point {
  if (!point) return { x: 0, y: 0 };

  const snappedX = Math.round(point.x / gridSize) * gridSize;
  const snappedY = Math.round(point.y / gridSize) * gridSize;

  const result = {
    x: snappedX,
    y: snappedY
  };

  if (process.env.NODE_ENV === 'development') {
    logger.debug(
      `SnapToGrid: (${point.x.toFixed(3)}m, ${point.y.toFixed(3)}m) → (${result.x.toFixed(3)}m, ${result.y.toFixed(3)}m) @ grid ${gridSize}m`
    );
  }

  return result;
}

/**
 * Checks if a value is an exact multiple of the grid size (0.1m)
 * Used to verify that points are precisely aligned to grid
 * 
 * @param value - The value to check (in meters)
 * @returns Whether the value is an exact multiple of grid size
 */
export const isExactGridMultiple = (value: number): boolean => {
  // Convert to string to handle floating point precision issues
  const rounded = Number((Math.round(value / GRID_SIZE) * GRID_SIZE).toFixed(3));
  return Math.abs(value - rounded) < FLOATING_POINT_TOLERANCE; // Allow tiny rounding error
};
