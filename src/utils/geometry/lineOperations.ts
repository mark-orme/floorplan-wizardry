
import { Point } from '@/types/core/Point';

/**
 * Snap a point to the nearest grid point
 * @param point The point to snap
 * @param gridSize The grid size to snap to
 * @returns The snapped point
 */
export function snapToGrid(point: Point, gridSize: number = 10): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snap a line to the grid
 * @param start Start point
 * @param end End point
 * @param gridSize Grid size
 * @returns Snapped line points
 */
export function snapLineToGrid(start: Point, end: Point, gridSize: number = 10): { start: Point, end: Point } {
  return {
    start: snapToGrid(start, gridSize),
    end: snapToGrid(end, gridSize)
  };
}

/**
 * Check if a coordinate is exactly at a grid multiple
 * @param value Coordinate value to check
 * @param gridSize Grid size
 * @returns True if the value is exactly at a grid multiple
 */
export function isExactGridMultiple(value: number, gridSize: number = 10): boolean {
  return Math.abs(value % gridSize) < 0.00001;
}

/**
 * Check if a line is aligned with the grid
 * @param start Start point
 * @param end End point
 * @param gridSize Grid size
 * @returns True if the line is aligned with the grid
 */
export function isLineAlignedWithGrid(start: Point, end: Point, gridSize: number = 10): boolean {
  // Line is aligned if both points are on grid points and the line is horizontal, vertical, or at 45 degrees
  const snapped = snapLineToGrid(start, end, gridSize);
  
  // Check if both points are already on grid points
  const startOnGrid = isExactGridMultiple(start.x, gridSize) && isExactGridMultiple(start.y, gridSize);
  const endOnGrid = isExactGridMultiple(end.x, gridSize) && isExactGridMultiple(end.y, gridSize);
  
  if (!startOnGrid || !endOnGrid) {
    return false;
  }
  
  // Check if line is horizontal, vertical, or diagonal (45 degrees)
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  return dx === 0 || dy === 0 || dx === dy;
}
