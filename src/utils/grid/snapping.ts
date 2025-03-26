
/**
 * Grid snapping utilities module
 * Functions for snapping points and angles to the grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING } from '../drawing';
import { isValidGridPoint, normalizePoint } from './typeUtils';

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param {Point} point - The point to snap
 * @param {number} gridSize - Size of the grid to snap to (default: GRID_SPACING)
 * @returns {Point} The snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING): Point => {
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  
  return {
    x: Math.round(validPoint.x / validGridSize) * validGridSize,
    y: Math.round(validPoint.y / validGridSize) * validGridSize
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
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  const validThreshold = threshold >= 0 && threshold <= 1 ? threshold : 0.5;
  
  // Calculate distance to nearest grid point
  const snapX = Math.round(validPoint.x / validGridSize) * validGridSize;
  const snapY = Math.round(validPoint.y / validGridSize) * validGridSize;
  
  const distX = Math.abs(validPoint.x - snapX);
  const distY = Math.abs(validPoint.y - snapY);
  
  // Only snap if within threshold
  return {
    x: distX <= validThreshold * validGridSize / 2 ? snapX : validPoint.x,
    y: distY <= validThreshold * validGridSize / 2 ? snapY : validPoint.y
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
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  
  return {
    x: Math.round(validPoint.x / validGridSize) * validGridSize,
    y: Math.round(validPoint.y / validGridSize) * validGridSize
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
  const validStartPoint = normalizePoint(startPoint);
  const validEndPoint = normalizePoint(endPoint);
  
  if (angles.length === 0) {
    return validEndPoint;
  }
  
  // Calculate the current angle
  const dx = validEndPoint.x - validStartPoint.x;
  const dy = validEndPoint.y - validStartPoint.y;
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
    return validEndPoint;
  }
  
  // Calculate the distance from start to end
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the new end point based on the closest standard angle
  const angleRad = closestAngle * (Math.PI / 180);
  return {
    x: validStartPoint.x + distance * Math.cos(angleRad),
    y: validStartPoint.y + distance * Math.sin(angleRad)
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
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  
  // Calculate remainder when divided by grid size
  const remainderX = Math.abs(validPoint.x % validGridSize);
  const remainderY = Math.abs(validPoint.y % validGridSize);
  
  // Find shorter distance to grid line
  const distanceX = Math.min(
    remainderX,
    validGridSize - remainderX
  );
  
  const distanceY = Math.min(
    remainderY, 
    validGridSize - remainderY
  );
  
  return { x: distanceX, y: distanceY };
};
