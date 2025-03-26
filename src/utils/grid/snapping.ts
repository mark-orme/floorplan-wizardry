
/**
 * Grid snapping operations
 * Functions for snapping points and shapes to the grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { snapToGrid } from './core';
import { FLOATING_POINT_TOLERANCE } from '../geometry/constants';
import { calculateAngle } from '../geometry/lineOperations';

// Re-export snapToGrid from core for API compatibility
export { snapToGrid } from './core';

/** 
 * Snap an array of points to the grid for consistent alignment
 * Used to ensure all points in a stroke align to the grid
 * 
 * @param {Point[]} points - Array of points to snap to the grid (in meters)
 * @param {boolean} strict - Whether to use strict snapping (forces exact alignment)
 * @returns {Point[]} Array of snapped points
 */
export const snapPointsToGrid = (points: Point[], strict: boolean = false): Point[] => {
  if (!points || points.length === 0) return [];
  
  return points.map(point => snapToGrid(point, GRID_SIZE));
};

/**
 * Enhanced grid snapping - forces EXACT snap to nearest grid line
 * Ensures walls always start and end precisely on grid lines with no rounding errors
 * Critical for maintaining clean wall connections and precise measurements
 * 
 * @param {Point} point - The point to snap (in meters)
 * @returns {Point} Point snapped exactly to the nearest grid line (in meters)
 */
export const snapToNearestGridLine = (point: Point): Point => {
  // Simply use snapToGrid with the standard grid size
  return snapToGrid(point, GRID_SIZE);
};

/**
 * Force align a point to the exact grid lines
 * Ensures all points land precisely on grid intersections
 * Applies extra precision to avoid floating point errors
 * 
 * @param point - The point to align (in meters)
 * @returns Grid-aligned point (in meters)
 */
export const forceGridAlignment = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Force exact alignment to nearest grid intersection with extra precision
  // Use fixed precision to avoid floating point errors
  const x = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const y = Math.round(point.y / GRID_SIZE) * GRID_SIZE;
  
  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3))
  };
};

/**
 * Snap line to standard angles (0, 45, 90 degrees) if it's close
 * Makes it easier to draw perfectly straight lines and diagonals 
 * 
 * @param {Point} startPoint - Starting point (already snapped to grid)
 * @param {Point} endPoint - Current end point to snap
 * @param {number} angleThreshold - Maximum angle difference to snap (degrees)
 * @returns {Point} Snapped end point
 */
export const snapLineToStandardAngles = (
  startPoint: Point, 
  endPoint: Point,
  angleThreshold: number = 10
): Point => {
  // Calculate the current angle
  const angle = calculateAngle(startPoint, endPoint);
  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + 
    Math.pow(endPoint.y - startPoint.y, 2)
  );
  
  // Check if we're close to any standard angle (0, 45, 90, 135, 180, etc.)
  const standardAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  
  let closestAngle = angle;
  let minDifference = 360;
  
  standardAngles.forEach(standardAngle => {
    const diff = Math.min(
      Math.abs(angle - standardAngle),
      Math.abs(360 - Math.abs(angle - standardAngle))
    );
    
    if (diff < minDifference && diff <= angleThreshold) {
      minDifference = diff;
      closestAngle = standardAngle;
    }
  });
  
  // If we're close to a standard angle, snap to it
  if (closestAngle !== angle) {
    const radians = closestAngle * (Math.PI / 180);
    const snappedPoint = {
      x: startPoint.x + Math.cos(radians) * distance,
      y: startPoint.y + Math.sin(radians) * distance
    };
    
    // Make sure the snapped point is also on the grid
    return snapToGrid(snappedPoint, GRID_SIZE);
  }
  
  // Otherwise, just snap to grid
  return snapToGrid(endPoint, GRID_SIZE);
};
