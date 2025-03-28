
/**
 * Grid snapping utilities
 * @module grid/snapping
 */
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap a point to the nearest grid point
 * 
 * @param {Point} point - Point to snap
 * @param {number} [gridSpacing] - Grid spacing to use
 * @returns {Point} Snapped point
 */
export const snapToGrid = (point: Point, gridSpacing = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSpacing) * gridSpacing,
    y: Math.round(point.y / gridSpacing) * gridSpacing
  };
};

/**
 * Alias for snapToGrid for backward compatibility
 */
export const snapPointToGrid = snapToGrid;

/**
 * Check if a point is on (or very close to) a grid point
 * 
 * @param {Point} point - Point to check
 * @param {number} [threshold] - Distance threshold
 * @param {number} [gridSpacing] - Grid spacing to use
 * @returns {boolean} Whether the point is on a grid point
 */
export const isPointOnGrid = (
  point: Point, 
  threshold = SNAP_THRESHOLD, 
  gridSpacing = GRID_SPACING.SMALL
): boolean => {
  const snapX = Math.round(point.x / gridSpacing) * gridSpacing;
  const snapY = Math.round(point.y / gridSpacing) * gridSpacing;
  
  return (
    Math.abs(point.x - snapX) <= threshold && 
    Math.abs(point.y - snapY) <= threshold
  );
};

/**
 * Calculate the distance from a point to the nearest grid line
 * 
 * @param {Point} point - Point to check
 * @param {number} [gridSpacing] - Grid spacing to use
 * @returns {number} Distance to nearest grid line
 */
export const distanceToGridLine = (
  point: Point,
  gridSpacing = GRID_SPACING.SMALL
): number => {
  // Distance to nearest horizontal grid line
  const distY = Math.min(
    point.y % gridSpacing,
    gridSpacing - (point.y % gridSpacing)
  );
  
  // Distance to nearest vertical grid line
  const distX = Math.min(
    point.x % gridSpacing,
    gridSpacing - (point.x % gridSpacing)
  );
  
  // Return minimum of the two distances
  return Math.min(distX, distY);
};

/**
 * Snap a point to standard angles (0, 45, 90, etc degrees)
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point to snap
 * @param {number} [angleStep] - Angle step in degrees
 * @returns {Point} Snapped end point
 */
export const snapToAngle = (
  start: Point, 
  end: Point, 
  angleStep = 45
): Point => {
  // Calculate angle
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return end;
  
  let angle = Math.atan2(dy, dx);
  
  // Snap angle to nearest angleStep
  const snapRadians = Math.round(angle / (angleStep * Math.PI / 180)) * (angleStep * Math.PI / 180);
  
  // Calculate new point
  return {
    x: start.x + distance * Math.cos(snapRadians),
    y: start.y + distance * Math.sin(snapRadians)
  };
};

/**
 * Snap a line by snapping both endpoints to the grid
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @param {number} [gridSpacing] - Grid spacing to use
 * @returns {Object} Object with snapped start and end points
 */
export const snapLineToGrid = (
  start: Point, 
  end: Point, 
  gridSpacing = GRID_SPACING.SMALL
): { start: Point; end: Point } => {
  return {
    start: snapToGrid(start, gridSpacing),
    end: snapToGrid(end, gridSpacing)
  };
};

/**
 * Snap a line to standard angles
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @param {number} [angleStep] - Angle step in degrees
 * @returns {Object} Object with start point and snapped end point
 */
export const snapLineToStandardAngles = (
  start: Point, 
  end: Point, 
  angleStep = 45
): { start: Point; end: Point } => {
  return {
    start,
    end: snapToAngle(start, end, angleStep)
  };
};
