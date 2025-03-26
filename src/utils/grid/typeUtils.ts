
/**
 * Grid type utilities
 * Provides utilities for type checking and validation
 * @module grid/typeUtils
 */
import { Point } from '@/types/drawingTypes';

/**
 * Validates if a point has valid x and y coordinates
 * Useful for filtering out invalid points
 * 
 * @param {any} point - The point to validate
 * @returns {boolean} True if point has valid coordinates
 */
export const isValidGridPoint = (point: any): boolean => {
  if (!point) return false;
  
  // Check if point has x and y properties
  if (typeof point.x === 'undefined' || typeof point.y === 'undefined') {
    return false;
  }
  
  // Check if x and y are finite numbers
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    return false;
  }
  
  return true;
};

/**
 * Normalizes a point to ensure it has valid coordinates
 * Returns a safe point with default values if input is invalid
 * 
 * @param {Point} point - The point to normalize
 * @returns {Point} Normalized point with valid coordinates
 */
export const normalizePoint = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Return a safe point with finite numbers
  return {
    x: Number.isFinite(point.x) ? point.x : 0,
    y: Number.isFinite(point.y) ? point.y : 0
  };
};

/**
 * Filters an array of points to remove invalid entries
 * Useful for cleaning up user input or external data
 * 
 * @param {Point[]} points - Array of points to filter
 * @returns {Point[]} Array with only valid points
 */
export const filterValidPoints = (points: Point[]): Point[] => {
  if (!Array.isArray(points)) return [];
  
  return points.filter(isValidGridPoint);
};

/**
 * Rounds point coordinates to a specified precision
 * Useful for snapping or display purposes
 * 
 * @param {Point} point - The point to round
 * @param {number} precision - Number of decimal places (default: 0)
 * @returns {Point} Point with rounded coordinates
 */
export const roundPointCoordinates = (point: Point, precision: number = 0): Point => {
  if (!isValidGridPoint(point)) return { x: 0, y: 0 };
  
  const factor = Math.pow(10, precision);
  
  return {
    x: Math.round(point.x * factor) / factor,
    y: Math.round(point.y * factor) / factor
  };
};
