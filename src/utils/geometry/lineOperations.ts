
import { Point } from '@/types/core/Point';
import { PIXELS_PER_METER, GRID_SPACING, DISTANCE_PRECISION } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Format distance for display with unit
 * @param distanceInPixels Distance in pixels
 * @returns Formatted string with unit
 */
export const formatDistance = (distanceInPixels: number): string => {
  // Convert pixels to meters
  const distanceInMeters = distanceInPixels / PIXELS_PER_METER;
  
  // Round to specified precision
  return `${distanceInMeters.toFixed(DISTANCE_PRECISION)} m`;
};

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate angle between two points in degrees
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians
  const angleRad = Math.atan2(dy, dx);
  
  // Convert to degrees
  let angleDeg = angleRad * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angleDeg < 0) {
    angleDeg += 360;
  }
  
  return angleDeg;
};

/**
 * Check if value is an exact multiple of grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is an exact multiple
 */
export const isExactGridMultiple = (value: number, gridSize: number = GRID_SPACING.SMALL): boolean => {
  const remainder = value % gridSize;
  return remainder < 0.001 || (gridSize - remainder) < 0.001;
};

/**
 * Check if line is aligned with grid
 * @param p1 First point
 * @param p2 Second point
 * @param gridSize Grid size
 * @returns True if line is aligned
 */
export const isLineAlignedWithGrid = (p1: Point, p2: Point, gridSize: number = GRID_SPACING.SMALL): boolean => {
  // Check if both points are on grid intersections
  const isP1OnGrid = isExactGridMultiple(p1.x, gridSize) && isExactGridMultiple(p1.y, gridSize);
  const isP2OnGrid = isExactGridMultiple(p2.x, gridSize) && isExactGridMultiple(p2.y, gridSize);
  
  return isP1OnGrid && isP2OnGrid;
};
