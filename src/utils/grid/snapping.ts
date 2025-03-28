
/**
 * Grid snapping utilities
 * @module grid/snapping
 */

import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snaps a value to the nearest grid coordinate
 * @param {number} value - The value to snap
 * @param {number} gridSize - The grid size to snap to (defaults to small grid)
 * @returns {number} The snapped value
 */
export const snapToGrid = (value: number, gridSize: number = GRID_SPACING.SMALL): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snaps a point to the nearest grid intersection
 * @param {Point} point - The point to snap
 * @param {number} gridSize - The grid size to snap to (defaults to small grid)
 * @returns {Point} The snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: snapToGrid(point.x, gridSize),
    y: snapToGrid(point.y, gridSize)
  };
};

/**
 * Snaps an angle to the nearest standard angle (0, 45, 90, 135, etc.)
 * @param {number} angle - The angle in degrees to snap
 * @param {number} step - The angular step size to snap to (default 45 degrees)
 * @returns {number} The snapped angle
 */
export const snapToAngle = (angle: number, step: number = 45): number => {
  return Math.round(angle / step) * step;
};

/**
 * Straightens a line to standard angles
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @returns {{ start: Point, end: Point }} Line with end point adjusted to standard angle
 */
export const snapLineToStandardAngles = (start: Point, end: Point): { start: Point, end: Point } => {
  // Calculate the angle and distance
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap the angle to the nearest 45-degree increment
  const snappedAngle = snapToAngle(angle);
  
  // Convert back to radians for calculation
  const snappedRadians = snappedAngle * (Math.PI / 180);
  
  // Calculate the new end point
  const newEnd = {
    x: start.x + Math.cos(snappedRadians) * distance,
    y: start.y + Math.sin(snappedRadians) * distance
  };
  
  return { start, end: newEnd };
};

/**
 * Check if a point is within the snapping threshold of a grid line
 * @param {number} value - The value to check
 * @param {number} gridSize - The grid size
 * @param {number} threshold - The snapping threshold
 * @returns {boolean} True if within threshold
 */
export const isNearGridLine = (
  value: number, 
  gridSize: number = GRID_SPACING.SMALL,
  threshold: number = SNAP_THRESHOLD
): boolean => {
  const nearestGridLine = snapToGrid(value, gridSize);
  return Math.abs(value - nearestGridLine) <= threshold;
};

/**
 * Check if two points are on the same grid line
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @param {number} gridSize - Grid size
 * @returns {boolean} True if on same grid line
 */
export const arePointsOnSameGridLine = (
  point1: Point, 
  point2: Point, 
  gridSize: number = GRID_SPACING.SMALL
): boolean => {
  return (
    snapToGrid(point1.x, gridSize) === snapToGrid(point2.x, gridSize) ||
    snapToGrid(point1.y, gridSize) === snapToGrid(point2.y, gridSize)
  );
};
