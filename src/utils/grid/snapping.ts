
/**
 * Grid snapping utilities
 * @module grid/snapping
 */
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap a point to the grid
 * @param {Point} point - Point to snap
 * @param {number} gridSize - Grid size
 * @returns {Point} Snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Check if a point is already on a grid line
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @param {number} threshold - Snap threshold
 * @returns {boolean} Whether the point is on grid
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = GRID_SPACING.SMALL, 
  threshold: number = SNAP_THRESHOLD
): boolean => {
  const distX = Math.abs(point.x - Math.round(point.x / gridSize) * gridSize);
  const distY = Math.abs(point.y - Math.round(point.y / gridSize) * gridSize);
  
  return distX <= threshold && distY <= threshold;
};

/**
 * Calculate distance to nearest grid line
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @returns {Object} Distances to nearest grid lines
 */
export const distanceToGridLine = (
  point: Point, 
  gridSize: number = GRID_SPACING.SMALL
): { x: number, y: number } => {
  const nearestX = Math.round(point.x / gridSize) * gridSize;
  const nearestY = Math.round(point.y / gridSize) * gridSize;
  
  return {
    x: Math.abs(point.x - nearestX),
    y: Math.abs(point.y - nearestY)
  };
};

/**
 * Snap a line to the grid
 * @param {Point} start - Line start point
 * @param {Point} end - Line end point
 * @param {number} gridSize - Grid size
 * @returns {Object} Line with snapped points
 */
export const snapLineToGrid = (
  start: Point, 
  end: Point, 
  gridSize: number = GRID_SPACING.SMALL
): { start: Point; end: Point } => {
  return {
    start: snapPointToGrid(start, gridSize),
    end: snapPointToGrid(end, gridSize)
  };
};

/**
 * Check if a line should be snapped to grid
 * @param {Point} start - Line start point
 * @param {Point} end - Line end point
 * @param {number} gridSize - Grid size
 * @param {number} threshold - Snap threshold
 * @returns {boolean} Whether the line should be snapped
 */
export const shouldSnapLineToGrid = (
  start: Point,
  end: Point,
  gridSize: number = GRID_SPACING.SMALL,
  threshold: number = SNAP_THRESHOLD
): boolean => {
  const startDist = distanceToGridLine(start, gridSize);
  const endDist = distanceToGridLine(end, gridSize);
  
  return (
    (startDist.x <= threshold || startDist.y <= threshold) ||
    (endDist.x <= threshold || endDist.y <= threshold)
  );
};

/**
 * Snap a polygon to grid
 * @param {Point[]} points - Polygon points
 * @param {number} gridSize - Grid size
 * @returns {Point[]} Snapped points
 */
export const snapPolygonToGrid = (
  points: Point[],
  gridSize: number = GRID_SPACING.SMALL
): Point[] => {
  return points.map(point => snapPointToGrid(point, gridSize));
};

/**
 * Find the nearest grid intersection point
 * @param {Point} point - Reference point
 * @param {number} gridSize - Grid size
 * @returns {Point} Nearest grid intersection
 */
export const findNearestGridIntersection = (
  point: Point,
  gridSize: number = GRID_SPACING.SMALL
): Point => {
  return snapPointToGrid(point, gridSize);
};
