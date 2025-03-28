
/**
 * Grid snapping utilities
 * @module grid/snapping
 */
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Snap a point to the grid
 * @param point - Point to snap
 * @param gridSize - Grid size (defaults to small grid)
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  const gridX = Math.round(point.x / gridSize) * gridSize;
  const gridY = Math.round(point.y / gridSize) * gridSize;
  
  return { x: gridX, y: gridY } as Point;
};

/**
 * Get the nearest grid intersection point
 * @param point - Reference point
 * @param gridSize - Grid size (defaults to small grid)
 * @returns Nearest grid intersection
 */
export const getNearestGridIntersection = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return snapToGrid(point, gridSize);
};

/**
 * Calculate distance to nearest grid line
 * @param point - Reference point
 * @param gridSize - Grid size (defaults to small grid)
 * @returns Distance to nearest grid line
 */
export const distanceToNearestGridLine = (point: Point, gridSize: number = GRID_SPACING.SMALL): number => {
  const modX = point.x % gridSize;
  const modY = point.y % gridSize;
  
  const distToHorizLine = Math.min(modY, gridSize - modY);
  const distToVertLine = Math.min(modX, gridSize - modX);
  
  return Math.min(distToHorizLine, distToVertLine);
};

/**
 * Snap a line to standard angles (0, 45, 90 degrees)
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @param angleStep - Angle step in radians (default: π/4 = 45°)
 * @returns Adjusted end point
 */
export const snapToAngle = (
  startPoint: Point, 
  endPoint: Point, 
  angleStep: number = Math.PI / 4
): Point => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // If the distance is very small, just return the original point
  if (Math.abs(dx) < SNAP_THRESHOLD && Math.abs(dy) < SNAP_THRESHOLD) {
    return endPoint;
  }
  
  // Calculate angle
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Round to nearest step
  const snapAngle = Math.round(angle / angleStep) * angleStep;
  
  // Calculate new end point based on standard angle
  const newEndX = startPoint.x + Math.cos(snapAngle) * distance;
  const newEndY = startPoint.y + Math.sin(snapAngle) * distance;
  
  return { x: newEndX, y: newEndY } as Point;
};

/**
 * Snap a line to grid and standard angles
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @returns Snapped end point
 */
export const snapLineToStandardAngles = (startPoint: Point, endPoint: Point): Point => {
  const angledPoint = snapToAngle(startPoint, endPoint);
  return snapToGrid(angledPoint);
};
