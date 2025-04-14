
/**
 * Coordinate transformation utilities
 * @module utils/geometry/coordinateTransforms
 */
import { PIXELS_PER_METER, GRID_SPACING } from '@/constants/numerics';

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number): number {
  return pixels / PIXELS_PER_METER;
}

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @returns Value in pixels
 */
export function metersToPixels(meters: number): number {
  return meters * PIXELS_PER_METER;
}

/**
 * Convert pixels to grid units
 * @param pixels Value in pixels
 * @param gridSize Grid size in pixels
 * @returns Value in grid units
 */
export function pixelsToGridUnits(pixels: number, gridSize: number = GRID_SPACING.SMALL): number {
  return pixels / gridSize;
}

/**
 * Convert grid units to pixels
 * @param units Value in grid units
 * @param gridSize Grid size in pixels
 * @returns Value in pixels
 */
export function gridUnitsToPixels(units: number, gridSize: number = GRID_SPACING.SMALL): number {
  return units * gridSize;
}
