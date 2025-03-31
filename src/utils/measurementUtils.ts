
/**
 * Measurement utility functions
 * @module utils/measurementUtils
 */
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import type { Point } from '@/types/core/Point';

/**
 * Convert pixels to meters
 * @param pixelDistance - Distance in pixels
 * @returns Distance in meters
 */
export const pixelsToMeters = (pixelDistance: number): number => {
  return pixelDistance / GRID_CONSTANTS.PIXELS_PER_METER;
};

/**
 * Format a measurement in meters
 * @param meters - Distance in meters
 * @param precision - Number of decimal places
 * @returns Formatted measurement string
 */
export const formatMeasurement = (meters: number, precision: number = 1): string => {
  return `${meters.toFixed(precision)} m`;
};

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
  };
};
