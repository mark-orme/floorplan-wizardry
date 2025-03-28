
/**
 * Line operation utilities
 * @module geometry/lineOperations
 */
import { Point } from '@/types/core/Point';
import { PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance in pixels
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  } as Point;
};

/**
 * Calculate angle between two points in radians
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Angle in radians
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Format a distance for display
 * @param distanceInPixels - Distance in pixels
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted distance string in meters
 */
export const formatDistance = (distanceInPixels: number, decimals: number = 1): string => {
  const distanceInMeters = distanceInPixels / PIXELS_PER_METER;
  return `${distanceInMeters.toFixed(decimals)}m`;
};

/**
 * Check if value is an exact multiple of grid size
 * @param value - Value to check
 * @param gridSize - Grid size
 * @returns Whether value is an exact multiple
 */
export const isExactGridMultiple = (value: number, gridSize: number): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

// Fix for line operations calculation on line 95
export const correctAngleCalculation = (angle: number, step: number): number => {
  return Math.round(angle / step) * step;
};
