
/**
 * Line operation utilities
 * @module utils/geometry/lineOperations
 */
import { Point } from '@/types/geometryTypes';
import { PIXELS_PER_METER, DISTANCE_PRECISION } from '@/constants/numerics';

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
 * Check if line is horizontally aligned (or nearly so)
 * @param p1 First point
 * @param p2 Second point
 * @param tolerance Tolerance in pixels (default: 2)
 * @returns True if horizontally aligned
 */
export const isLineHorizontal = (p1: Point, p2: Point, tolerance: number = 2): boolean => {
  return Math.abs(p1.y - p2.y) <= tolerance;
};

/**
 * Check if line is vertically aligned (or nearly so)
 * @param p1 First point
 * @param p2 Second point
 * @param tolerance Tolerance in pixels (default: 2)
 * @returns True if vertically aligned
 */
export const isLineVertical = (p1: Point, p2: Point, tolerance: number = 2): boolean => {
  return Math.abs(p1.x - p2.x) <= tolerance;
};

/**
 * Format a distance for display
 * @param distanceInPixels Distance in pixels
 * @param pixelsPerMeter Pixels per meter conversion ratio
 * @returns Formatted distance string
 */
export const formatDistance = (
  distanceInPixels: number, 
  pixelsPerMeter: number = PIXELS_PER_METER
): string => {
  const distanceInMeters = distanceInPixels / pixelsPerMeter;
  return `${distanceInMeters.toFixed(DISTANCE_PRECISION)}m`;
};

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @returns True if value is exact multiple of grid size
 */
export const isExactGridMultiple = (value: number, gridSize: number): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};
