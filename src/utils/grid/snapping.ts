
/**
 * Grid snapping operations
 * Functions for snapping points and shapes to the grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { snapToGrid } from './core';
import { FLOATING_POINT_TOLERANCE } from '../geometry/constants';

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
