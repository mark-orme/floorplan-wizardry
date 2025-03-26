
/**
 * Grid snapping utilities module
 * Functions for snapping points to grid and handling angle snapping
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { ANGLE_SNAP_THRESHOLD } from "@/constants/numerics";

/**
 * Snap a point to the grid
 * @param {Point} point - The point to snap (in meters)
 * @param {number} gridSize - Grid size in meters (default: from GRID_SIZE constant)
 * @returns {Point} Snapped point (in meters)
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SIZE): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Round to the nearest grid point
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap angle to nearest 15-degree increment
 * 
 * @param {number} angle - Angle in degrees
 * @param {number} snapIncrement - Angle increment to snap to (default: 15 degrees)
 * @param {number} threshold - Threshold within which to snap (default: ANGLE_SNAP_THRESHOLD)
 * @returns {number} Snapped angle in degrees
 */
export const snapToAngle = (
  angle: number, 
  snapIncrement: number = 15, 
  threshold: number = ANGLE_SNAP_THRESHOLD
): number => {
  // Normalize angle to 0-360 range
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Calculate nearest snap angle
  const snapAngle = Math.round(normalizedAngle / snapIncrement) * snapIncrement;
  
  // Calculate difference
  const diff = Math.abs(normalizedAngle - snapAngle);
  
  // If within threshold, return snapped angle; otherwise return original
  return diff <= threshold ? snapAngle : angle;
};

/**
 * Snap a point to the nearest grid point
 * @param {Point} point - Original point 
 * @param {Point[]} gridPoints - Array of grid points to snap to
 * @param {number} snapThreshold - Distance threshold for snapping (in same units as points)
 * @returns {Point} Snapped point or original if no snap occurs
 */
export const snapToGridPoints = (
  point: Point, 
  gridPoints: Point[], 
  snapThreshold: number = GRID_SIZE / 4
): Point => {
  if (!point || !gridPoints || gridPoints.length === 0) {
    return point;
  }
  
  // Find the closest grid point
  let closestPoint = point;
  let minDistance = Number.MAX_VALUE;
  
  for (const gridPoint of gridPoints) {
    const distance = Math.sqrt(
      Math.pow(gridPoint.x - point.x, 2) + 
      Math.pow(gridPoint.y - point.y, 2)
    );
    
    if (distance < minDistance && distance <= snapThreshold) {
      minDistance = distance;
      closestPoint = gridPoint;
    }
  }
  
  return closestPoint;
};
