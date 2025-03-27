
/**
 * Grid snapping utilities for alignment and straightening
 * @module utils/grid/snapping
 */
import { Point } from '@/types/core/Point';
import { getSmallGridSpacing, getLargeGridSpacing } from './gridUtils';

/**
 * Standard angle increments for snapping (in degrees)
 */
export const STANDARD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param point - Point to snap
 * @param gridSpacing - Grid spacing (can be a number or an object with SMALL property)
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSpacing: number): Point => {
  // Ensure we have a numeric grid spacing
  const spacing = typeof gridSpacing === 'number' 
    ? gridSpacing 
    : getSmallGridSpacing();
  
  return {
    x: Math.round(point.x / spacing) * spacing,
    y: Math.round(point.y / spacing) * spacing
  };
};

/**
 * Get the nearest point on the grid
 * 
 * @param point - Reference point
 * @param gridSpacing - Grid spacing
 * @returns Nearest grid point
 */
export const getNearestPointOnGrid = (point: Point, gridSpacing: number): Point => {
  return snapToGrid(point, gridSpacing);
};

/**
 * Snap an angle to the nearest standard angle
 * 
 * @param angle - Angle in degrees
 * @param increment - Angle increment for snapping
 * @returns Snapped angle
 */
export const snapToAngle = (angle: number, increment: number = 45): number => {
  // Normalize angle to 0-360 range
  while (angle < 0) angle += 360;
  angle = angle % 360;
  
  // Find closest standard angle
  return STANDARD_ANGLES.reduce((closest, current) => {
    const currentDiff = Math.abs(angle - current);
    const closestDiff = Math.abs(angle - closest);
    return currentDiff < closestDiff ? current : closest;
  }, STANDARD_ANGLES[0]);
};

/**
 * Snap a line to standard angles (0, 45, 90, etc.)
 * 
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @param angleIncrement - Angle increment for snapping (default: 45°)
 * @returns New end point that creates a snapped line
 */
export const snapLineToStandardAngles = (
  startPoint: Point, 
  endPoint: Point,
  angleIncrement: number = 45
): Point => {
  // Calculate current angle and distance
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap angle to nearest standard angle
  const snappedAngle = snapToAngle(angle, angleIncrement);
  
  // Convert back to radians
  const snappedRadians = snappedAngle * (Math.PI / 180);
  
  // Calculate new end point
  return {
    x: startPoint.x + distance * Math.cos(snappedRadians),
    y: startPoint.y + distance * Math.sin(snappedRadians)
  };
};

/**
 * Check if a point is aligned with the grid
 * 
 * @param point - Point to check
 * @param gridSpacing - Grid spacing
 * @param tolerance - Tolerance in pixels
 * @returns Whether the point is aligned with the grid
 */
export const isPointAlignedWithGrid = (
  point: Point, 
  gridSpacing: number,
  tolerance: number = 0.001
): boolean => {
  const spacing = typeof gridSpacing === 'number' 
    ? gridSpacing 
    : getSmallGridSpacing();
  
  const xDiff = Math.abs(point.x % spacing);
  const yDiff = Math.abs(point.y % spacing);
  
  return (xDiff < tolerance || xDiff > spacing - tolerance) && 
         (yDiff < tolerance || yDiff > spacing - tolerance);
};
