
/**
 * Grid utilities to be used by other grid-related modules
 * @module utils/grid/gridUtils
 */
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Get the small grid spacing value
 * @returns small grid spacing in pixels
 */
export const getSmallGridSpacing = (): number => {
  return GRID_SPACING.SMALL;
};

/**
 * Get the large grid spacing value
 * @returns large grid spacing in pixels
 */
export const getLargeGridSpacing = (): number => {
  return GRID_SPACING.LARGE;
};

/**
 * Convert object that may contain GRID_SPACING to actual number values
 * @param value - Value which may be a GRID_SPACING object or a number
 * @param defaultValue - Default value to return if conversion fails
 * @returns A number value
 */
export const ensureGridSpacingNumber = (value: any, defaultValue: number = 10): number => {
  if (typeof value === 'number') {
    return value;
  }
  
  if (value && typeof value === 'object' && 'SMALL' in value) {
    return value.SMALL;
  }
  
  return defaultValue;
};

/**
 * Convert grid spacing to meters
 * @param pixels - Grid spacing in pixels
 * @returns Grid spacing in meters
 */
export const gridSpacingToMeters = (pixels: number): number => {
  return pixels / GRID_SPACING.LARGE;
};

/**
 * Convert meters to grid spacing
 * @param meters - Distance in meters
 * @returns Distance in pixels
 */
export const metersToGridSpacing = (meters: number): number => {
  return meters * GRID_SPACING.LARGE;
};
