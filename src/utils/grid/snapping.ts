
/**
 * Utility functions for grid snapping
 * @module utils/grid/snapping
 */
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Point } from '@/types/core/Point';

/**
 * Snap a value to the grid
 * 
 * @param value Value to snap
 * @param gridSize Grid size to snap to
 * @returns Snapped value
 */
export const snap = (
  value: number, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a point to the grid
 * 
 * @param point Point to snap
 * @param gridSize Grid size to snap to (defaults to constant)
 * @returns Snapped point
 */
export const snapPointToGrid = (
  point: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Alternative naming for snapPointToGrid for compatibility
 */
export const snapToGrid = snapPointToGrid;

/**
 * Snap a line's endpoints to the grid
 * 
 * @param start Starting point
 * @param end Ending point
 * @param gridSize Grid size to snap to
 * @returns Object with snapped start and end points
 */
export const snapLineToGrid = (
  start: Point, 
  end: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): { start: Point, end: Point } => {
  return {
    start: snapPointToGrid(start, gridSize),
    end: snapPointToGrid(end, gridSize)
  };
};

/**
 * Snap line to standard angles (0, 45, 90, 135, 180...)
 * 
 * @param start Starting point
 * @param end Ending point
 * @param snapAngleDeg Angle in degrees to snap to (default: 45)
 * @returns Snapped end point with the original start point
 */
export const snapLineToStandardAngles = (
  start: Point,
  end: Point,
  snapAngleDeg: number = 45
): Point => {
  // Calculate the angle of the line
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Calculate the distance between points
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap angle to nearest snapAngleDeg degrees
  const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
  
  // Convert back to radians
  const radians = snappedAngle * (Math.PI / 180);
  
  // Calculate new endpoint based on snapped angle
  return {
    x: start.x + distance * Math.cos(radians),
    y: start.y + distance * Math.sin(radians)
  };
};

/**
 * Snap an angle to nearest multiple of specified degrees
 * Enhanced version that preserves the start point
 * 
 * @param start Starting point
 * @param end Ending point
 * @param angleDeg Angle in degrees to snap to (default: 45)
 * @returns Snapped end point
 */
export const snapToAngle = (
  start: Point,
  end: Point,
  angleDeg: number = 45
): Point => {
  return snapLineToStandardAngles(start, end, angleDeg);
};

/**
 * Constrain line to horizontal, vertical, or 45-degree angles
 * Used for shift-key drawing constraint
 * 
 * @param start Starting point
 * @param end Current end point (from mouse)
 * @returns Constrained end point
 */
export const constrainToMajorAngles = (
  start: Point,
  end: Point
): { start: Point, end: Point } => {
  // Calculate differences
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  
  let newEnd: Point;
  
  // Determine the dominant direction
  if (absDx > absDy * 2.5) {
    // Horizontal constraint (x-axis)
    newEnd = { x: end.x, y: start.y };
  } else if (absDy > absDx * 2.5) {
    // Vertical constraint (y-axis)
    newEnd = { x: start.x, y: end.y };
  } else {
    // 45-degree diagonal constraint
    const avgDist = (absDx + absDy) / 2;
    const signX = dx > 0 ? 1 : -1;
    const signY = dy > 0 ? 1 : -1;
    newEnd = {
      x: start.x + avgDist * signX,
      y: start.y + avgDist * signY
    };
  }
  
  return {
    start: { ...start },
    end: newEnd
  };
};

/**
 * Check if a point is already on a grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size
 * @param threshold Threshold for considering a point on grid
 * @returns Whether the point is on a grid intersection
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = GRID_CONSTANTS.GRID_SIZE,
  threshold: number = 0.5
): boolean => {
  const xOnGrid = Math.abs(point.x % gridSize) < threshold || 
                  Math.abs(point.x % gridSize - gridSize) < threshold;
  const yOnGrid = Math.abs(point.y % gridSize) < threshold || 
                  Math.abs(point.y % gridSize - gridSize) < threshold;
  
  return xOnGrid && yOnGrid;
};

/**
 * Get the nearest grid point to the given point
 * 
 * @param point Original point
 * @param gridSize Grid size
 * @returns Nearest grid point
 */
export const getNearestGridPoint = (
  point: Point,
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): Point => {
  // Find the nearest grid coordinates
  const x = Math.round(point.x / gridSize) * gridSize;
  const y = Math.round(point.y / gridSize) * gridSize;
  
  return { x, y };
};

/**
 * Calculate distance to nearest grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size
 * @returns Distance to nearest grid intersection
 */
export const distanceToGrid = (
  point: Point,
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): number => {
  const nearest = getNearestGridPoint(point, gridSize);
  const dx = point.x - nearest.x;
  const dy = point.y - nearest.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate distance to nearest grid lines
 * 
 * @param point Point to check  
 * @param gridSize Grid size
 * @returns Distance to nearest horizontal and vertical grid lines
 */
export const distanceToGridLine = (
  point: Point,
  gridSize: number = GRID_CONSTANTS.GRID_SIZE
): { x: number, y: number } => {
  // Find nearest grid lines
  const gridX = Math.round(point.x / gridSize) * gridSize;
  const gridY = Math.round(point.y / gridSize) * gridSize;
  
  // Calculate distances
  const distX = Math.abs(point.x - gridX);
  const distY = Math.abs(point.y - gridY);
  
  return { x: distX, y: distY };
};

// Add any other needed grid utilities here to ensure compatibility
