
/**
 * Grid snapping utility functions
 * Provides functions for snapping points and lines to grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING } from '@/constants/numerics';
import { applyAngleQuantization } from '../geometry/straightening';

/**
 * Snap a point to the nearest grid intersection
 * @param {Point} point - Point to snap
 * @param {number} gridSize - Grid cell size in pixels
 * @returns {Point} Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING): Point => {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap an angle to the nearest standard angle
 * @param {number} angle - Angle in degrees
 * @param {number} snapIncrement - Angle increment for snapping in degrees
 * @returns {number} Snapped angle in degrees
 */
export const snapToAngle = (angle: number, snapIncrement: number = 45): number => {
  // Normalize angle to 0-360 range
  while (angle < 0) angle += 360;
  angle = angle % 360;
  
  // Snap to nearest increment
  return Math.round(angle / snapIncrement) * snapIncrement;
};

/**
 * Snap a line to standard angles (0°, 45°, 90°, etc)
 * @param {Point} startPoint - Line start point
 * @param {Point} endPoint - Line end point
 * @param {number} snapIncrement - Angle increment for snapping in degrees
 * @returns {Point} New end point with snapped angle
 */
export const snapLineToStandardAngles = (
  startPoint: Point, 
  endPoint: Point,
  snapIncrement: number = 45
): Point => {
  if (!startPoint || !endPoint) return endPoint;
  
  return applyAngleQuantization(startPoint, endPoint);
};

/**
 * Check if a point is on a grid line
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size in pixels
 * @param {number} tolerance - Tolerance in pixels
 * @returns {boolean} Whether the point is on a grid line
 */
export const isOnGridLine = (
  point: Point,
  gridSize: number = GRID_SPACING,
  tolerance: number = 2
): boolean => {
  if (!point) return false;
  
  // Check if point is close to a horizontal or vertical grid line
  const xModGrid = point.x % gridSize;
  const yModGrid = point.y % gridSize;
  
  return (
    xModGrid <= tolerance ||
    xModGrid >= gridSize - tolerance ||
    yModGrid <= tolerance ||
    yModGrid >= gridSize - tolerance
  );
};

/**
 * Calculate distance from point to nearest grid line
 * @param {Point} point - Point to measure from
 * @param {number} gridSize - Grid size in pixels
 * @returns {number} Distance to nearest grid line in pixels
 */
export const distanceToNearestGridLine = (
  point: Point,
  gridSize: number = GRID_SPACING
): number => {
  if (!point) return Infinity;
  
  // Calculate distance to nearest horizontal and vertical grid lines
  const xModGrid = point.x % gridSize;
  const yModGrid = point.y % gridSize;
  
  const xDistance = Math.min(xModGrid, gridSize - xModGrid);
  const yDistance = Math.min(yModGrid, gridSize - yModGrid);
  
  // Return the minimum of the two distances
  return Math.min(xDistance, yDistance);
};

/**
 * Get the nearest point on grid
 * Similar to snapToGrid but provides more context
 * @param {Point} point - Original point
 * @param {number} gridSize - Grid size in pixels
 * @returns {Object} Result with snapped point and snapping info
 */
export const getNearestPointOnGrid = (
  point: Point,
  gridSize: number = GRID_SPACING
): {
  point: Point;
  onGridIntersection: boolean;
  onGridLine: boolean;
  distanceToGrid: number;
} => {
  if (!point) {
    return {
      point: { x: 0, y: 0 },
      onGridIntersection: false,
      onGridLine: false,
      distanceToGrid: Infinity
    };
  }
  
  // Snap point to grid
  const snappedPoint = snapToGrid(point, gridSize);
  
  // Check if original point is on a grid line
  const onGridLine = isOnGridLine(point, gridSize);
  
  // Calculate distance to nearest grid intersection
  const distanceToGrid = Math.sqrt(
    Math.pow(point.x - snappedPoint.x, 2) +
    Math.pow(point.y - snappedPoint.y, 2)
  );
  
  // Check if point is on grid intersection
  const onGridIntersection = distanceToGrid < 2;
  
  return {
    point: snappedPoint,
    onGridIntersection,
    onGridLine,
    distanceToGrid
  };
};
