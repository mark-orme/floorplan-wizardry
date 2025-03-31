
/**
 * Utilities for measuring and converting between units
 * @module utils/measurementUtils
 */

import type { Point } from "@/types/core/Point";

// Conversion factor - pixels to meters
const PIXELS_TO_METERS_FACTOR = 0.01;

/**
 * Convert a pixel value to meters
 * @param pixels - Value in pixels
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number): number => {
  return pixels * PIXELS_TO_METERS_FACTOR;
};

/**
 * Convert a meter value to pixels
 * @param meters - Value in meters
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number): number => {
  return meters / PIXELS_TO_METERS_FACTOR;
};

/**
 * Calculate the midpoint between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Midpoint
 */
export const calculateMidpoint = (point1: Point, point2: Point): Point => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};

/**
 * Calculate the distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance in pixels
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the distance between two points in meters
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance in meters
 */
export const calculateDistanceInMeters = (point1: Point, point2: Point): number => {
  return pixelsToMeters(calculateDistance(point1, point2));
};

/**
 * Format a measurement value for display
 * @param value - Measurement value
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export const formatMeasurement = (value: number, precision: number = 2): string => {
  return value.toFixed(precision);
};
