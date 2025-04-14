
/**
 * Grid snapping utilities
 * @module utils/grid/snapping
 */
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD, ANGLE_SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap a single value to the nearest grid line
 * 
 * @param value - The value to snap
 * @param gridSize - The grid size to snap to
 * @returns Value snapped to the nearest grid line
 */
export const snap = (value: number, gridSize: number = GRID_SPACING.SMALL): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param point - The point to snap
 * @param gridSize - The grid size to snap to
 * @returns Point snapped to the nearest grid intersection
 */
export const snapPointToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  const x = snap(point.x, gridSize);
  const y = snap(point.y, gridSize);
  
  return { x, y } as Point;
};

/**
 * Check if a point is on a grid intersection
 * 
 * @param point - The point to check
 * @param gridSize - The grid size to check against
 * @param threshold - The tolerance threshold
 * @returns True if the point is on a grid intersection
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = GRID_SPACING.SMALL, 
  threshold: number = SNAP_THRESHOLD
): boolean => {
  const xOnGrid = Math.abs(point.x % gridSize) < threshold || 
                 Math.abs(point.x % gridSize - gridSize) < threshold;
  const yOnGrid = Math.abs(point.y % gridSize) < threshold || 
                 Math.abs(point.y % gridSize - gridSize) < threshold;
                 
  return xOnGrid && yOnGrid;
};

/**
 * Calculate the distance from a point to the nearest grid lines
 * 
 * @param point - The point to calculate distance for
 * @param gridSize - The grid size
 * @returns Object with x and y distances to nearest grid lines
 */
export const distanceToGridLine = (point: Point, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } => {
  const xDist = Math.min(
    point.x % gridSize,
    gridSize - (point.x % gridSize)
  );
  
  const yDist = Math.min(
    point.y % gridSize,
    gridSize - (point.y % gridSize)
  );
  
  return { x: xDist, y: yDist };
};

/**
 * Snap a line to standard angles (0, 45, 90 degrees)
 * 
 * @param start - Start point of line
 * @param end - End point of line
 * @param angleThreshold - Angle threshold for snapping in degrees
 * @returns New end point for snapped line
 */
export const snapLineToStandardAngles = (
  start: Point, 
  end: Point, 
  angleThreshold: number = ANGLE_SNAP_THRESHOLD
): Point => {
  // Calculate dx and dy
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate length of line
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle in degrees
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Normalize angle to 0-360
  angle = (angle + 360) % 360;
  
  // Check if we need to snap to horizontal (0 or 180 degrees)
  if (Math.min(angle, 360 - angle) <= angleThreshold || 
      Math.abs(angle - 180) <= angleThreshold) {
    // Horizontal line
    return { x: start.x + length * (dx >= 0 ? 1 : -1), y: start.y } as Point;
  }
  
  // Check if we need to snap to vertical (90 or 270 degrees)
  if (Math.abs(angle - 90) <= angleThreshold || 
      Math.abs(angle - 270) <= angleThreshold) {
    // Vertical line
    return { x: start.x, y: start.y + length * (dy >= 0 ? 1 : -1) } as Point;
  }
  
  // Check if we need to snap to 45 degrees (45, 135, 225, or 315 degrees)
  if (Math.abs(angle - 45) <= angleThreshold || 
      Math.abs(angle - 135) <= angleThreshold || 
      Math.abs(angle - 225) <= angleThreshold || 
      Math.abs(angle - 315) <= angleThreshold) {
    // 45-degree line
    const sign = Math.cos(angle * Math.PI / 180) >= 0 ? 1 : -1;
    const sign2 = Math.sin(angle * Math.PI / 180) >= 0 ? 1 : -1;
    const d = length / Math.sqrt(2);
    return { 
      x: start.x + d * sign, 
      y: start.y + d * sign2 
    } as Point;
  }
  
  // No snapping needed
  return end;
};

/**
 * Snap a line to grid
 * 
 * @param start - Start point
 * @param end - End point
 * @param gridSize - Grid size (defaults to SMALL grid)
 * @returns Object with snapped start and end points
 */
export const snapLineToGrid = (
  start: Point, 
  end: Point, 
  gridSize: number = GRID_SPACING.SMALL
): { start: Point, end: Point } => {
  // Snap both points to grid
  const snappedStart = snapPointToGrid(start, gridSize);
  const snappedEnd = snapPointToGrid(end, gridSize);
  
  // Now check if we need to straighten the line
  const snappedEndWithAngle = snapLineToStandardAngles(snappedStart, snappedEnd);
  
  return {
    start: snappedStart,
    end: snappedEndWithAngle
  };
};

// Alias functions for backward compatibility
export const snapToGrid = snapPointToGrid;
export const snapToAngle = snapLineToStandardAngles;
