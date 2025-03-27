
/**
 * Grid snapping utilities
 * @module utils/grid/snapping
 */
import { Point } from '@/types/core/Point';
import { SMALL_GRID_SPACING, LARGE_GRID_SPACING } from '@/constants/numerics';
import { ensureGridSpacingNumber } from './gridUtils';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';
import { ANGLE_SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap a point to the nearest grid intersection
 * @param point - Point to snap
 * @param gridSize - Grid size (optional, defaults to SMALL_GRID_SPACING)
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = SMALL_GRID_SPACING): Point => {
  // Convert grid size to ensure it's a number
  const gridSizeNumber = ensureGridSpacingNumber(gridSize);
  
  // Calculate rounded coordinates
  const x = Math.round(point.x / gridSizeNumber) * gridSizeNumber;
  const y = Math.round(point.y / gridSizeNumber) * gridSizeNumber;
  
  return { x, y };
};

/**
 * Find the nearest grid intersection to a point
 * @param point - Point to find nearest intersection for
 * @param gridSize - Grid size (optional, defaults to SMALL_GRID_SPACING)
 * @returns Nearest grid intersection
 */
export const getNearestGridIntersection = (point: Point, gridSize: number = SMALL_GRID_SPACING): Point => {
  return snapToGrid(point, gridSize);
};

/**
 * Snap a line to standard angles (0, 45, 90, etc.)
 * @param start - Line start point
 * @param end - Line end point
 * @param standardAngles - Standard angles to snap to (optional)
 * @param threshold - Angle threshold for snapping (optional)
 * @returns New end point for snapped line
 */
export const snapLineToStandardAngles = (
  start: Point,
  end: Point,
  standardAngles: number[] = [0, 45, 90, 135, 180, 225, 270, 315],
  threshold: number = ANGLE_SNAP_THRESHOLD
): Point => {
  const angle = calculateAngle(start, end);
  const distance = calculateDistance(start, end);
  
  // Find the closest standard angle
  let closest = standardAngles[0];
  let minDiff = 360;
  
  for (const standardAngle of standardAngles) {
    const diff = Math.min(
      Math.abs(angle - standardAngle),
      Math.abs(angle - standardAngle + 360),
      Math.abs(angle - standardAngle - 360)
    );
    
    if (diff < minDiff) {
      minDiff = diff;
      closest = standardAngle;
    }
  }
  
  // If the difference is within threshold, snap to that angle
  if (minDiff <= threshold) {
    // Convert angle to radians for Math functions
    const radians = (closest * Math.PI) / 180;
    
    // Calculate new end point
    const newX = start.x + distance * Math.cos(radians);
    const newY = start.y + distance * Math.sin(radians);
    
    return { x: newX, y: newY };
  }
  
  // If angle difference exceeds threshold, return original end point
  return end;
};

/**
 * Calculate distance to nearest grid line
 * @param point - Point to check
 * @param gridSize - Grid size (optional, defaults to SMALL_GRID_SPACING)
 * @returns Distance to nearest grid line in both X and Y directions
 */
export const distanceToNearestGridLine = (
  point: Point, 
  gridSize: number = SMALL_GRID_SPACING
): { x: number, y: number } => {
  // Convert grid size to ensure it's a number
  const gridSizeNumber = ensureGridSpacingNumber(gridSize);
  
  // Calculate the closest grid line in the X direction
  const xMod = point.x % gridSizeNumber;
  const distanceX = Math.min(xMod, gridSizeNumber - xMod);
  
  // Calculate the closest grid line in the Y direction
  const yMod = point.y % gridSizeNumber;
  const distanceY = Math.min(yMod, gridSizeNumber - yMod);
  
  return { x: distanceX, y: distanceY };
};

/**
 * Check if a point is near a grid line
 * @param point - Point to check
 * @param threshold - Distance threshold (optional, defaults to 5)
 * @param gridSize - Grid size (optional, defaults to SMALL_GRID_SPACING)
 * @returns Whether the point is near a grid line
 */
export const isNearGridLine = (
  point: Point,
  threshold: number = 5,
  gridSize: number = SMALL_GRID_SPACING
): boolean => {
  const { x, y } = distanceToNearestGridLine(point, gridSize);
  return x < threshold || y < threshold;
};

/**
 * Snap a point to the nearest grid line (not intersection)
 * @param point - Point to snap
 * @param gridSize - Grid size (optional, defaults to SMALL_GRID_SPACING)
 * @returns Snapped point
 */
export const snapToGridLine = (
  point: Point,
  gridSize: number = SMALL_GRID_SPACING
): Point => {
  // Convert grid size to ensure it's a number
  const gridSizeNumber = ensureGridSpacingNumber(gridSize);
  
  // Find the closest grid lines
  const xFloor = Math.floor(point.x / gridSizeNumber) * gridSizeNumber;
  const xCeil = Math.ceil(point.x / gridSizeNumber) * gridSizeNumber;
  const yFloor = Math.floor(point.y / gridSizeNumber) * gridSizeNumber;
  const yCeil = Math.ceil(point.y / gridSizeNumber) * gridSizeNumber;
  
  // Calculate distances to nearest grid lines
  const distX = Math.min(
    Math.abs(point.x - xFloor),
    Math.abs(point.x - xCeil)
  );
  
  const distY = Math.min(
    Math.abs(point.y - yFloor),
    Math.abs(point.y - yCeil)
  );
  
  // Snap to the nearest grid line
  let snappedPoint = { ...point };
  
  if (distX < distY) {
    // Snap to X grid line
    snappedPoint.x = Math.abs(point.x - xFloor) < Math.abs(point.x - xCeil) ? xFloor : xCeil;
  } else {
    // Snap to Y grid line
    snappedPoint.y = Math.abs(point.y - yFloor) < Math.abs(point.y - yCeil) ? yFloor : yCeil;
  }
  
  return snappedPoint;
};
