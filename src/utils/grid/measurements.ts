
/**
 * Grid measurement utilities
 * @module grid/measurements
 */
import { Point } from '@/types/core/Point';
import { GRID_SPACING, PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance in pixels
 */
export const pixelDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert distance in pixels to meters
 * @param pixelDist - Distance in pixels
 * @returns Distance in meters
 */
export const pixelsToMeters = (pixelDist: number): number => {
  return pixelDist / PIXELS_PER_METER;
};

/**
 * Calculate grid cell size in meters
 * @returns Grid cell size in meters
 */
export const gridCellSizeInMeters = (): number => {
  // Use small grid spacing directly
  return GRID_SPACING.SMALL / PIXELS_PER_METER;
};

/**
 * Calculate number of grid cells between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Number of grid cells
 */
export const gridCellsBetween = (p1: Point, p2: Point): { x: number, y: number } => {
  // Calculate number of cells in each dimension
  const smallGridSize = GRID_SPACING.SMALL;
  
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  
  return {
    x: Math.round(dx / smallGridSize),
    y: Math.round(dy / smallGridSize)
  };
};

/**
 * Calculate area in square meters
 * @param points - Array of points forming a polygon
 * @returns Area in square meters
 */
export const calculateAreaInSquareMeters = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  // Calculate area using Shoelace formula
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  area = Math.abs(area) / 2;
  
  // Convert to square meters
  return area / (PIXELS_PER_METER * PIXELS_PER_METER);
};
