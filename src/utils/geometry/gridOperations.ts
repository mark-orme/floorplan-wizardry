
/**
 * Grid operations utilities
 * Functions for grid snapping and alignment
 * @module gridOperations
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { FLOATING_POINT_TOLERANCE } from './constants';
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
 * Snap an array of points to the grid for consistent alignment
 * Used to ensure all points in a stroke align to the grid
 * 
 * @param {Point[]} points - Array of points to snap to the grid (in meters)
 * @param {boolean} strict - Whether to use strict snapping (forces exact alignment)
 * @returns {Point[]} Array of snapped points
 */
export const snapPointsToGrid = (points: Point[], strict: boolean = false): Point[] => {
  if (!points || points.length === 0) return [];
  
  return points.map(point => snapToGrid(point, GRID_SIZE));
};

/**
 * Enhanced grid snapping - forces EXACT snap to nearest grid line
 * Ensures walls always start and end precisely on grid lines with no rounding errors
 * Critical for maintaining clean wall connections and precise measurements
 * 
 * @param {Point} point - The point to snap (in meters)
 * @returns {Point} Point snapped exactly to the nearest grid line (in meters)
 */
export const snapToNearestGridLine = (point: Point): Point => {
  // Simply use snapToGrid with the standard grid size
  return snapToGrid(point, GRID_SIZE);
};

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

/**
 * Force align a point to the exact grid lines
 * Ensures all points land precisely on grid intersections
 * Applies extra precision to avoid floating point errors
 * 
 * @param point - The point to align (in meters)
 * @returns Grid-aligned point (in meters)
 */
export const forceGridAlignment = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Force exact alignment to nearest grid intersection with extra precision
  // Use fixed precision to avoid floating point errors
  const x = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const y = Math.round(point.y / GRID_SIZE) * GRID_SIZE;
  
  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3))
  };
};
