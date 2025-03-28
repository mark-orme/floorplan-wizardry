
/**
 * Line operation utilities
 * @module geometry/lineOperations
 */
import { Point } from '@/types';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Calculate the distance between two points
 * 
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Format a distance for display
 * 
 * @param {number} distance - Raw distance in pixels
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance: number, precision: number = 2): string => {
  const meters = distance / 100; // Assuming 100 pixels = 1 meter
  return meters.toFixed(precision) + 'm';
};

/**
 * Calculate the midpoint between two points
 * 
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate the angle between two points in degrees
 * 
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Angle in degrees
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angleRadians = Math.atan2(dy, dx);
  return angleRadians * (180 / Math.PI);
};

/**
 * Check if a value is an exact multiple of the grid spacing
 * 
 * @param {number} value - Value to check
 * @param {number} [gridSpacing] - Grid spacing to use
 * @returns {boolean} Whether the value is an exact grid multiple
 */
export const isExactGridMultiple = (value: number, gridSpacing: number = GRID_SPACING): boolean => {
  return Math.abs(value % gridSpacing) < 0.001;
};

/**
 * Snap an angle to standard 45-degree increments
 * 
 * @param {number} angle - Angle in degrees
 * @returns {number} Snapped angle in degrees
 */
export const snapAngleToStandard = (angle: number): number => {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Snap to nearest 45-degree increment
  const increment = 45;
  return Math.round(normalizedAngle / increment) * increment;
};

/**
 * Get the nearest point on a line from a given point
 * 
 * @param {Point} lineStart - Line start point
 * @param {Point} lineEnd - Line end point
 * @param {Point} point - Point to find nearest point for
 * @returns {Point} Nearest point on the line
 */
export const getNearestPointOnLine = (lineStart: Point, lineEnd: Point, point: Point): Point => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Handle case where line is just a point
  if (dx === 0 && dy === 0) return lineStart;
  
  // Calculate projection
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy);
  
  // Clamp t to line segment
  const tClamped = Math.max(0, Math.min(1, t));
  
  return {
    x: lineStart.x + tClamped * dx,
    y: lineStart.y + tClamped * dy
  };
};
