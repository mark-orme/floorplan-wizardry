
/**
 * Point operations utilities
 * @module utils/geometry/pointOperations
 */
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
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
 * Check if a point is near another point within a threshold
 * @param p1 First point
 * @param p2 Second point
 * @param threshold Maximum distance to be considered "near"
 * @returns True if points are near each other
 */
export const isPointNear = (p1: Point, p2: Point, threshold: number = 5): boolean => {
  return calculateDistance(p1, p2) <= threshold;
};

/**
 * Format distance for display with units
 * @param distance Distance in pixels
 * @param precision Number of decimal places
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number, precision: number = 2): string => {
  return `${distance.toFixed(precision)} px`;
};

/**
 * Check if a value is an exact multiple of the grid spacing
 * @param value Value to check
 * @returns True if value is an exact grid multiple
 */
export const isExactGridMultiple = (value: number): boolean => {
  const gridSize = GRID_SPACING;
  return Math.abs(value % gridSize) < 0.0001;
};

/**
 * Round a point to the nearest grid position
 * @param point Point to round
 * @returns Rounded point
 */
export const roundToGrid = (point: Point): Point => {
  const gridSize = GRID_SPACING;
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Check if two points are the same
 * @param p1 First point
 * @param p2 Second point
 * @returns True if points are the same
 */
export const arePointsEqual = (p1: Point, p2: Point): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};
