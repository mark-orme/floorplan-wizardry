
import { Point } from './types';

/**
 * Generate grid points
 * @param width Grid width
 * @param height Grid height
 * @param spacing Grid spacing
 * @returns Array of grid points
 */
export const generateGridPoints = (
  width: number,
  height: number,
  spacing: number
): Point[] => {
  const points: Point[] = [];
  
  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height; y += spacing) {
      points.push({ x, y });
    }
  }
  
  return points;
};

/**
 * Get the nearest grid point
 * @param point Input point
 * @param gridSize Grid size
 * @returns Nearest grid point
 */
export const getNearestGridPoint = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Calculate grid cell indices for a point
 * @param point Input point
 * @param gridSize Grid size
 * @returns Grid cell indices
 */
export const getGridCell = (point: Point, gridSize: number): { row: number; col: number } => {
  return {
    row: Math.floor(point.y / gridSize),
    col: Math.floor(point.x / gridSize)
  };
};
