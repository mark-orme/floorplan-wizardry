
/**
 * Grid snapping utilities
 * @module grid/snapping
 */
import { Point } from '@/types';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Snap a coordinate to the nearest grid line
 * 
 * @param {number} value - Value to snap
 * @param {number} gridSize - Grid size
 * @returns {number} Snapped value
 */
export const snapToGridValue = (value: number, gridSize: number = GRID_SPACING): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param {Point} point - Point to snap
 * @param {number} gridSize - Grid size
 * @returns {Point} Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING): Point => {
  return {
    x: snapToGridValue(point.x, gridSize),
    y: snapToGridValue(point.y, gridSize)
  } as Point;
};

/**
 * Snap an angle to standard angles (0, 45, 90, etc)
 * 
 * @param {number} angle - Angle in radians
 * @param {number} snapInterval - Snap interval in radians
 * @returns {number} Snapped angle
 */
export const snapToAngle = (angle: number, snapInterval: number = Math.PI / 4): number => {
  return Math.round(angle / snapInterval) * snapInterval;
};

/**
 * Check if a point is already on a grid intersection
 * 
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @param {number} tolerance - Tolerance in pixels
 * @returns {boolean} True if point is on grid
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = GRID_SPACING, 
  tolerance: number = 0.001
): boolean => {
  return (
    Math.abs(point.x % gridSize) < tolerance || 
    Math.abs(point.x % gridSize - gridSize) < tolerance
  ) && (
    Math.abs(point.y % gridSize) < tolerance || 
    Math.abs(point.y % gridSize - gridSize) < tolerance
  );
};

/**
 * Calculate the distance to the nearest grid line
 * 
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @returns {number} Distance to nearest grid line
 */
export const distanceToGridLine = (point: Point, gridSize: number = GRID_SPACING): number => {
  const xDist = Math.min(
    point.x % gridSize,
    gridSize - (point.x % gridSize)
  );
  
  const yDist = Math.min(
    point.y % gridSize,
    gridSize - (point.y % gridSize)
  );
  
  return Math.min(xDist, yDist);
};

/**
 * Snap a line to standard angles (horizontal, vertical, 45 degrees)
 * 
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @param {number} angleStep - Angle snap step in radians
 * @returns {Point} New end point after snapping
 */
export const snapLineToStandardAngles = (
  start: Point, 
  end: Point, 
  angleStep: number = Math.PI / 4
): Point => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate the angle of the line
  const angle = Math.atan2(dy, dx);
  
  // Snap the angle to the nearest standard angle
  const snappedAngle = snapToAngle(angle, angleStep);
  
  // Calculate the length of the line
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the new end point
  return {
    x: start.x + length * Math.cos(snappedAngle),
    y: start.y + length * Math.sin(snappedAngle)
  } as Point;
};

/**
 * Alias for snapToGrid for backward compatibility
 */
export const snapPointToGrid = snapToGrid;
