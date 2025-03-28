
/**
 * Grid snapping utilities
 * Functions for snapping points and lines to grid
 * @module grid/snapping
 */
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap point to nearest grid position
 * @param point - Point to snap
 * @param gridSize - Grid size
 * @returns Snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Check if point is already on grid
 * @param point - Point to check
 * @param gridSize - Grid size
 * @returns Whether point is on grid
 */
export const isPointOnGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): boolean => {
  const snappedPoint = snapPointToGrid(point, gridSize);
  const dx = Math.abs(point.x - snappedPoint.x);
  const dy = Math.abs(point.y - snappedPoint.y);
  
  return dx < 0.001 && dy < 0.001;
};

/**
 * Calculate distance from point to nearest grid line
 * @param point - Point to check
 * @param gridSize - Grid size
 * @returns Object with x and y distances
 */
export const distanceToGridLine = (point: Point, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } => {
  const xMod = point.x % gridSize;
  const yMod = point.y % gridSize;
  
  const xDist = Math.min(xMod, gridSize - xMod);
  const yDist = Math.min(yMod, gridSize - yMod);
  
  return { x: xDist, y: yDist };
};

/**
 * Snap line to standard angles (0, 45, 90, etc.)
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @returns Adjusted end point for snapped line
 */
export const snapLineToStandardAngles = (startPoint: Point, endPoint: Point): Point => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx);
  
  // Snap to 0, 45, 90, 135, 180, 225, 270, 315 degrees
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    x: startPoint.x + distance * Math.cos(snapAngle),
    y: startPoint.y + distance * Math.sin(snapAngle)
  };
};

/**
 * Check if two lines would form a standard angle
 * @param line1Start - First line start point
 * @param line1End - First line end point
 * @param line2End - Second line end point (sharing line1End)
 * @param tolerance - Angle tolerance in degrees
 * @returns Whether the lines form a standard angle
 */
export const linesFormStandardAngle = (
  line1Start: Point,
  line1End: Point,
  line2End: Point,
  tolerance: number = 5
): boolean => {
  // Calculate angles
  const angle1 = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
  const angle2 = Math.atan2(line2End.y - line1End.y, line2End.x - line1End.x);
  
  // Calculate difference in degrees
  let angleDiff = Math.abs((angle2 - angle1) * 180 / Math.PI) % 360;
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  
  // Check if angle is close to 0, 45, 90, 135, 180
  const standardAngles = [0, 45, 90, 135, 180];
  return standardAngles.some(std => Math.abs(angleDiff - std) <= tolerance);
};
