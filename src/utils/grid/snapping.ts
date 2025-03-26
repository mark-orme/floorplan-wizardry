/**
 * Grid snapping utilities module
 * Functions for snapping points and angles to the grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING } from '../drawing';

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param {Point} point - The point to snap
 * @param {number} gridSize - Size of the grid to snap to (default: GRID_SPACING)
 * @returns {Point} The snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING): Point => {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap an angle to the nearest increment
 * Useful for straightening lines to common angles
 * 
 * @param {number} angleDeg - Angle in degrees
 * @param {number} increment - Angle increment in degrees (default: 45°)
 * @returns {number} Snapped angle in degrees
 */
export const snapToAngle = (angleDeg: number, increment: number = 45): number => {
  if (isNaN(angleDeg)) return 0;
  
  // Normalize angle to 0-360 range
  const normalizedAngle = ((angleDeg % 360) + 360) % 360;
  
  // Snap to nearest increment
  return Math.round(normalizedAngle / increment) * increment;
};

/**
 * Snap point with variable snap strength
 * Allows for "soft snapping" with different thresholds
 * 
 * @param {Point} point - The point to snap
 * @param {number} gridSize - Size of the grid to snap to
 * @param {number} threshold - Distance threshold for snapping (0-1, where 1 is full strength)
 * @returns {Point} The snapped point
 */
export const snapWithThreshold = (
  point: Point, 
  gridSize: number = GRID_SPACING,
  threshold: number = 0.5
): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Calculate distance to nearest grid point
  const snapX = Math.round(point.x / gridSize) * gridSize;
  const snapY = Math.round(point.y / gridSize) * gridSize;
  
  const distX = Math.abs(point.x - snapX);
  const distY = Math.abs(point.y - snapY);
  
  // Only snap if within threshold
  return {
    x: distX <= threshold * gridSize / 2 ? snapX : point.x,
    y: distY <= threshold * gridSize / 2 ? snapY : point.y
  };
};

/**
 * Find nearest grid intersection point
 * 
 * @param {Point} point - Reference point
 * @param {number} gridSize - Grid size in the same units as the point
 * @returns {Point} Nearest grid intersection
 */
export const getNearestGridIntersection = (
  point: Point,
  gridSize: number = GRID_SPACING
): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line to standard angles (0, 45, 90, 135, etc.)
 * Useful for straightening walls and lines
 * 
 * @param {Point} startPoint - Line start point
 * @param {Point} endPoint - Line end point
 * @param {number[]} angles - Array of allowed angles in degrees (default: [0, 45, 90, 135, 180, 225, 270, 315])
 * @returns {Point} Modified end point that creates a line with a standard angle
 */
export const snapLineToStandardAngles = (
  startPoint: Point,
  endPoint: Point,
  angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]
): Point => {
  if (!startPoint || !endPoint) return endPoint;
  
  // Calculate the current angle
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const currentAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Find the closest standard angle
  let closestAngle = angles[0];
  let minDiff = Math.abs(currentAngleDeg - angles[0]);
  
  for (let i = 1; i < angles.length; i++) {
    const diff = Math.abs(currentAngleDeg - angles[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = angles[i];
    }
  }
  
  // If the angle is already close enough (within 5 degrees), don't snap
  if (minDiff < 5) {
    return endPoint;
  }
  
  // Calculate the distance from start to end
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the new end point based on the closest standard angle
  const angleRad = closestAngle * (Math.PI / 180);
  return {
    x: startPoint.x + distance * Math.cos(angleRad),
    y: startPoint.y + distance * Math.sin(angleRad)
  };
};

/**
 * Calculate distance to nearest grid line
 * Useful for determining when to snap to grid
 * 
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @returns {{x: number, y: number}} Distance to nearest grid line in x and y directions
 */
export const distanceToNearestGridLine = (
  point: Point,
  gridSize: number = GRID_SPACING
): {x: number, y: number} => {
  if (!point) return { x: 0, y: 0 };
  
  // Calculate remainder when divided by grid size
  const remainderX = point.x % gridSize;
  const remainderY = point.y % gridSize;
  
  // Find shorter distance to grid line
  const distanceX = Math.min(
    remainderX,
    gridSize - remainderX
  );
  
  const distanceY = Math.min(
    remainderY, 
    gridSize - remainderY
  );
  
  return { x: distanceX, y: distanceY };
};
