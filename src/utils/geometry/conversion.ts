
/**
 * Geometry conversion utilities
 * @module utils/geometry/conversion
 */
import { PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param pixelsPerMeter Conversion ratio (defaults to PIXELS_PER_METER constant)
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param pixelsPerMeter Conversion ratio (defaults to PIXELS_PER_METER constant)
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  return meters * pixelsPerMeter;
};

/**
 * Convert pixels to square meters
 * @param squarePixels Value in square pixels
 * @param pixelsPerMeter Conversion ratio (defaults to PIXELS_PER_METER constant)
 * @returns Value in square meters
 */
export const pixelsToSquareMeters = (squarePixels: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  // Square meters = square pixels / (pixels per meter)²
  return squarePixels / (pixelsPerMeter * pixelsPerMeter);
};

/**
 * Convert square meters to pixels
 * @param squareMeters Value in square meters
 * @param pixelsPerMeter Conversion ratio (defaults to PIXELS_PER_METER constant)
 * @returns Value in square pixels
 */
export const squareMetersToPixels = (squareMeters: number, pixelsPerMeter: number = PIXELS_PER_METER): number => {
  // Square pixels = square meters * (pixels per meter)²
  return squareMeters * (pixelsPerMeter * pixelsPerMeter);
};

/**
 * Convert pixels to grid units
 * @param pixels Value in pixels
 * @param gridSize Size of grid cell in pixels
 * @returns Value in grid units
 */
export const pixelsToGridUnits = (pixels: number, gridSize: number): number => {
  return pixels / gridSize;
};

/**
 * Convert grid units to pixels
 * @param gridUnits Value in grid units
 * @param gridSize Size of grid cell in pixels
 * @returns Value in pixels
 */
export const gridUnitsToPixels = (gridUnits: number, gridSize: number): number => {
  return gridUnits * gridSize;
};
