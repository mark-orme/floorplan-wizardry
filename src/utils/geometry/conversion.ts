
/**
 * Unit conversion utilities for geometry
 * @module geometry/conversion
 */
import { PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Convert pixels to meters
 * 
 * @param {number} pixels - Value in pixels
 * @returns {number} Value in meters
 */
export const pixelsToMeters = (pixels: number): number => {
  return pixels / PIXELS_PER_METER;
};

/**
 * Convert meters to pixels
 * 
 * @param {number} meters - Value in meters
 * @returns {number} Value in pixels
 */
export const metersToPixels = (meters: number): number => {
  return meters * PIXELS_PER_METER;
};
