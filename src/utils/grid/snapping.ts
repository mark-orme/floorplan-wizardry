
/**
 * Grid snapping utilities module
 * Functions for snapping points and angles to the grid
 * @module grid/snapping
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING, CLOSE_POINT_THRESHOLD, ANGLE_SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Constants for snapping
 */
const SNAPPING = {
  /**
   * Default angle increment for angle snapping (degrees)
   */
  DEFAULT_ANGLE_INCREMENT: 45,
  
  /**
   * Default threshold for point proximity (0-1 range)
   */
  DEFAULT_SNAP_THRESHOLD: 0.5,
  
  /**
   * Full circle in degrees
   */
  FULL_CIRCLE_DEG: 360,
  
  /**
   * Default standard angles for line snapping (in degrees)
   */
  STANDARD_ANGLES: [0, 45, 90, 135, 180, 225, 270, 315]
};

/**
 * Normalize input point to handle invalid values
 * @param point - The point to normalize
 * @returns A valid point with numeric coordinates
 */
export const normalizePoint = (point: Point): Point => {
  return {
    x: isFinite(point?.x) ? point.x : 0,
    y: isFinite(point?.y) ? point.y : 0
  };
};

/**
 * Check if a point has valid coordinates
 * @param point - The point to check
 * @returns True if the point has valid numeric coordinates
 */
export const isValidGridPoint = (point: Point): boolean => {
  return (
    point !== null &&
    point !== undefined &&
    typeof point === 'object' &&
    'x' in point &&
    'y' in point &&
    isFinite(point.x) &&
    isFinite(point.y)
  );
};

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param point - The point to snap
 * @param gridSize - Size of the grid to snap to (default: GRID_SPACING)
 * @returns The snapped point
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
 * @param angleDeg - Angle in degrees
 * @param increment - Angle increment in degrees (default: 45°)
 * @returns Snapped angle in degrees
 */
export const snapToAngle = (
  angleDeg: number, 
  increment: number = SNAPPING.DEFAULT_ANGLE_INCREMENT
): number => {
  if (isNaN(angleDeg)) return 0;
  
  // Normalize angle to 0-360 range
  const normalizedAngle = ((angleDeg % SNAPPING.FULL_CIRCLE_DEG) + SNAPPING.FULL_CIRCLE_DEG) % 
    SNAPPING.FULL_CIRCLE_DEG;
  
  // Snap to nearest increment
  return Math.round(normalizedAngle / increment) * increment;
};

/**
 * Snap point with variable snap strength
 * Allows for "soft snapping" with different thresholds
 * 
 * @param point - The point to snap
 * @param gridSize - Size of the grid to snap to
 * @param threshold - Distance threshold for snapping (0-1, where 1 is full strength)
 * @returns The snapped point
 */
export const snapWithThreshold = (
  point: Point, 
  gridSize: number = GRID_SPACING,
  threshold: number = SNAPPING.DEFAULT_SNAP_THRESHOLD
): Point => {
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  const validThreshold = threshold >= 0 && threshold <= 1 ? threshold : SNAPPING.DEFAULT_SNAP_THRESHOLD;
  
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
 * @param point - Reference point
 * @param gridSize - Grid size in the same units as the point
 * @returns Nearest grid intersection
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
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @param angles - Array of allowed angles in degrees
 * @returns Modified end point that creates a line with a standard angle
 */
export const snapLineToStandardAngles = (
  startPoint: Point,
  endPoint: Point,
  angles: number[] = SNAPPING.STANDARD_ANGLES
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
  
  // If the angle is already close enough, don't snap
  if (minDiff < ANGLE_SNAP_THRESHOLD) {
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
 * @param point - Point to check
 * @param gridSize - Grid size
 * @returns Distance to nearest grid line in x and y directions
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

/**
 * Check if two points are close enough to be considered the same
 * 
 * @param point1 - First point
 * @param point2 - Second point
 * @param threshold - Distance threshold (default: CLOSE_POINT_THRESHOLD)
 * @returns True if points are close enough
 */
export const arePointsClose = (
  point1: Point, 
  point2: Point, 
  threshold: number = CLOSE_POINT_THRESHOLD
): boolean => {
  const validPoint1 = normalizePoint(point1);
  const validPoint2 = normalizePoint(point2);
  
  const dx = validPoint1.x - validPoint2.x;
  const dy = validPoint1.y - validPoint2.y;
  const distanceSquared = dx * dx + dy * dy;
  
  return distanceSquared <= threshold * threshold;
};
