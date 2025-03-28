
/**
 * Grid snapping utilities
 * @module utils/grid/snapping
 */
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/core/Point';

/**
 * Snap a point to the grid
 * @param point The point to snap
 * @param gridSize Optional grid size
 * @returns Snapped point
 */
export function snapToGrid(point: Point | { x: number, y: number }, gridSize: number = GRID_SPACING.SMALL): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  } as Point;
}

/**
 * Snap a specific coordinate to grid
 * @param value Coordinate value
 * @param gridSize Grid size
 * @returns Snapped coordinate
 */
export function snapCoordinateToGrid(value: number, gridSize: number = GRID_SPACING.SMALL): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point to grid
 * @param point The point to snap
 * @param gridSize Optional grid size
 * @returns Snapped point
 */
export function snapPointToGrid(point: Point | { x: number, y: number }, gridSize: number = GRID_SPACING.SMALL): Point {
  return snapToGrid(point, gridSize);
}

/**
 * Check if a point lies on a grid intersection
 * @param point The point to check
 * @param gridSize Optional grid size
 * @param tolerance Optional tolerance
 * @returns True if point is on grid
 */
export function isPointOnGrid(point: Point | { x: number, y: number }, gridSize: number = GRID_SPACING.SMALL, tolerance: number = 0.001): boolean {
  const dx = Math.abs(Math.round(point.x / gridSize) * gridSize - point.x);
  const dy = Math.abs(Math.round(point.y / gridSize) * gridSize - point.y);
  return dx <= tolerance && dy <= tolerance;
}

/**
 * Calculate distance from point to nearest grid line
 * @param point The point to check
 * @param gridSize Optional grid size
 * @returns Distance to nearest grid line
 */
export function distanceToGridLine(point: Point | { x: number, y: number }, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } {
  const xDist = point.x % gridSize;
  const yDist = point.y % gridSize;
  
  return {
    x: Math.min(xDist, gridSize - xDist),
    y: Math.min(yDist, gridSize - yDist)
  };
}

/**
 * Snap an angle to the nearest standard angle
 * @param angle Angle in degrees
 * @param snap Angle snap increment
 * @returns Snapped angle
 */
export function snapToAngle(angle: number, snap: number = 45): number {
  return Math.round(angle / snap) * snap;
}

/**
 * Snap a line defined by start and end points to standard angles
 * @param start Start point
 * @param end End point
 * @param snapAngle Optional angle to snap to
 * @returns Snapped end point
 */
export function snapLineToStandardAngles(
  start: Point | { x: number, y: number }, 
  end: Point | { x: number, y: number }, 
  snapAngle: number = 45
): Point {
  // Calculate the angle between the two points
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Calculate the distance between the points
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap the angle to the nearest interval
  const snappedAngle = snapToAngle(angle, snapAngle);
  
  // Convert back to radians
  const radians = snappedAngle * (Math.PI / 180);
  
  // Calculate new end point using the snapped angle and original distance
  return {
    x: start.x + distance * Math.cos(radians),
    y: start.y + distance * Math.sin(radians)
  } as Point;
}

/**
 * Compatibility function to allow grid-related functions with both separate coordinates and point objects
 * @param x X-coordinate or point object
 * @param y Y-coordinate (optional if x is a point)
 * @param gridSize Grid size
 * @returns Snapped point
 */
export function snapToGridUnified(
  x: number | Point | { x: number, y: number }, 
  y?: number, 
  gridSize: number = GRID_SPACING.SMALL
): Point {
  if (typeof x === 'object') {
    // x is a Point or {x,y} object
    return snapToGrid(x, gridSize);
  } else {
    // x and y are separate coordinates
    return snapToGrid({ x, y: y || 0 }, gridSize);
  }
}
