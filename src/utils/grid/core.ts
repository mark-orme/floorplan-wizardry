
/**
 * Core grid utilities module
 * Contains basic grid utility functions
 * @module grid/core
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';

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
 * Snap a point to specific grid points
 * @param {Point} point - The point to snap (in meters)
 * @param {Point[]} gridPoints - Array of grid points to snap to
 * @param {number} snapThreshold - Maximum distance to snap (in meters)
 * @returns {Point} Snapped point, or original if no snap
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
