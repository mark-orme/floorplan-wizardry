
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
 * Snap a point to grid with a threshold factor
 * Only snaps if the point is within the threshold distance of a grid line
 * @param {Point} point - Point to snap
 * @param {number} gridSize - Grid size in pixels
 * @param {number} thresholdFactor - Threshold as a factor of grid size (0-1)
 * @returns {Point} Snapped point or original if not within threshold
 */
export const snapWithThreshold = (
  point: Point,
  gridSize: number = GRID_SPACING,
  thresholdFactor: number = 0.3
): Point => {
  if (!point) return { x: 0, y: 0 };
  
  const threshold = gridSize * thresholdFactor;
  const result = { ...point };
  
  // Calculate distance to nearest grid line for x and y
  const xMod = point.x % gridSize;
  const yMod = point.y % gridSize;
  
  // Snap x if within threshold
  if (xMod <= threshold) {
    result.x = Math.floor(point.x / gridSize) * gridSize;
  } else if (gridSize - xMod <= threshold) {
    result.x = Math.ceil(point.x / gridSize) * gridSize;
  }
  
  // Snap y if within threshold
  if (yMod <= threshold) {
    result.y = Math.floor(point.y / gridSize) * gridSize;
  } else if (gridSize - yMod <= threshold) {
    result.y = Math.ceil(point.y / gridSize) * gridSize;
  }
  
  return result;
};

/**
 * Snap a line to standard angles (0°, 45°, 90°, etc)
 * @param {Point} startPoint - Line start point
 * @param {Point} endPoint - Line end point
 * @param {number[] | number} snapIncrement - Angle increment for snapping in degrees or array of allowed angles
 * @returns {Point} New end point with snapped angle
 */
export const snapLineToStandardAngles = (
  startPoint: Point, 
  endPoint: Point,
  snapIncrement: number[] | number = 45
): Point => {
  if (!startPoint || !endPoint) return endPoint;
  
  return applyAngleQuantization(startPoint, endPoint, 
    typeof snapIncrement === 'number' ? snapIncrement : undefined, 
    Array.isArray(snapIncrement) ? snapIncrement : undefined);
};

/**
 * Find the nearest grid intersection to a point
 * @param {Point} point - Point to find nearest intersection for
 * @param {number} gridSize - Grid size in pixels
 * @returns {Point} Nearest grid intersection
 */
export const getNearestGridIntersection = (
  point: Point,
  gridSize: number = GRID_SPACING
): Point => {
  return snapToGrid(point, gridSize);
};

/**
 * Calculate distance from point to nearest grid line
 * @param {Point} point - Point to measure from
 * @param {number} gridSize - Grid size in pixels
 * @returns {Object} Distance to nearest horizontal and vertical grid lines
 */
export const distanceToNearestGridLine = (
  point: Point,
  gridSize: number = GRID_SPACING
): { x: number, y: number } => {
  if (!point) return { x: Infinity, y: Infinity };
  
  // Calculate distance to nearest horizontal and vertical grid lines
  const xModGrid = point.x % gridSize;
  const yModGrid = point.y % gridSize;
  
  const xDistance = Math.min(xModGrid, gridSize - xModGrid);
  const yDistance = Math.min(yModGrid, gridSize - yModGrid);
  
  // Return the distances to nearest grid lines
  return { x: xDistance, y: yDistance };
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
  const distances = distanceToNearestGridLine(point, gridSize);
  const onGridLine = distances.x <= 2 || distances.y <= 2;
  
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
