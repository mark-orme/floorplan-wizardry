
/**
 * Line operation utilities
 * Provides functions for line measurements and manipulations
 * @module geometry/lineOperations
 */
import { Point } from '@/types/geometryTypes';
import { GRID_SIZE } from '../drawing';
import { DISTANCE_PRECISION, FLOATING_POINT_TOLERANCE } from './constants';
import logger from '../logger';

/**
 * Calculate the Euclidean distance between two points
 * Used for line length measurements and proximity checks
 * 
 * @param {Point} point1 - First point 
 * @param {Point} point2 - Second point
 * @returns {number} Distance in the same units as the input points (usually meters)
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  if (!point1 || !point2) return 0;
  
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a value is exactly divisible by the grid size
 * Used to verify grid alignment of points
 * 
 * @param {number} value - The value to check
 * @returns {boolean} True if the value is an exact multiple of grid size
 */
export const isExactGridMultiple = (value: number): boolean => {
  const gridSize = GRID_SIZE;
  const remainder = Math.abs(value % gridSize);
  return remainder < FLOATING_POINT_TOLERANCE || 
         Math.abs(remainder - gridSize) < FLOATING_POINT_TOLERANCE;
};

/**
 * Format a distance value to a specified precision with proper units
 * 
 * @param {number} distance - The distance to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted distance string (e.g., "1.5m")
 */
export const formatDistance = (distance: number, precision: number = DISTANCE_PRECISION): string => {
  return `${distance.toFixed(precision)}m`;
};

/**
 * Calculate the angle of a line between two points in degrees
 * Used for angle snapping and axis alignment
 * 
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @returns {number} Angle in degrees (0-360)
 */
export const calculateAngle = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Check if a point is close to a line segment
 * Used for selection and hover detection
 * 
 * @param {Point} point - The point to check
 * @param {Point} lineStart - Start point of the line
 * @param {Point} lineEnd - End point of the line
 * @param {number} threshold - Maximum distance to consider "close"
 * @returns {boolean} True if the point is close to the line segment
 */
export const isPointNearLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  threshold: number = 0.1 // Default to 0.1m (10cm)
): boolean => {
  // Calculate the distance from the point to the line
  const lineLength = calculateDistance(lineStart, lineEnd);
  if (lineLength === 0) return false;
  
  // Calculate the nearest point on the line
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / 
            (dx * dx + dy * dy);
  
  // If t is outside [0,1], the closest point is one of the endpoints
  if (t < 0) {
    return calculateDistance(point, lineStart) <= threshold;
  }
  if (t > 1) {
    return calculateDistance(point, lineEnd) <= threshold;
  }
  
  // If t is within [0,1], find the closest point on the line
  const closestPoint = {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy
  };
  
  return calculateDistance(point, closestPoint) <= threshold;
};
