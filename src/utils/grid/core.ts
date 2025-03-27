/**
 * Grid core utilities
 * Provides core grid functionality used across the application
 * @module grid/core
 */
import { Point } from '@/types/drawingTypes';
import { 
  PIXELS_PER_METER, 
  GRID_SPACING, 
  ANGLE_SNAP_THRESHOLD,
  FLOATING_POINT_TOLERANCE 
} from '@/constants/numerics';
import { snapToGrid, snapToAngle } from './snapping';

/**
 * Constants for grid core operations
 */
const GRID_CORE = {
  /**
   * Conversion factor for radians to degrees
   */
  RAD_TO_DEG: 180 / Math.PI,
  
  /**
   * Conversion factor for degrees to radians
   */
  DEG_TO_RAD: Math.PI / 180,
  
  /**
   * Standard angles for snapping (in degrees)
   */
  STANDARD_ANGLES: [0, 45, 90, 135, 180, 225, 270, 315],
  
  /**
   * Minimum distance threshold for straightening (in pixels)
   */
  MIN_STRAIGHTEN_DISTANCE: 10,
  
  /**
   * Default step size for grid (in pixels)
   */
  DEFAULT_GRID_STEP: GRID_SPACING
};

/**
 * Convert from pixels to meters
 * @param pixels - Value in pixels
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number): number => {
  return pixels / PIXELS_PER_METER;
};

/**
 * Convert from meters to pixels
 * @param meters - Value in meters
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number): number => {
  return meters * PIXELS_PER_METER;
};

/**
 * Convert a point from pixels to meters
 * @param point - Point in pixel coordinates
 * @returns Point in meter coordinates
 */
export const pointToMeters = (point: Point): Point => {
  return {
    x: pixelsToMeters(point.x),
    y: pixelsToMeters(point.y)
  };
};

/**
 * Convert a point from meters to pixels
 * @param point - Point in meter coordinates
 * @returns Point in pixel coordinates
 */
export const pointToPixels = (point: Point): Point => {
  return {
    x: metersToPixels(point.x),
    y: metersToPixels(point.y)
  };
};

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance in the same units as input points
 */
export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle between two points in degrees
 * @param p1 - First point (start)
 * @param p2 - Second point (end)
 * @returns Angle in degrees (0-360)
 */
export const angleBetweenPoints = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians, then convert to degrees
  let angle = Math.atan2(dy, dx) * GRID_CORE.RAD_TO_DEG;
  
  // Normalize to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Straighten a line to the nearest standard angle
 * @param start - Start point
 * @param end - End point
 * @returns Adjusted end point that creates a straight line
 */
export const straightenLine = (start: Point, end: Point): Point => {
  // Don't straighten if line is too short
  if (distance(start, end) < GRID_CORE.MIN_STRAIGHTEN_DISTANCE) {
    return end;
  }
  
  // Import this directly to avoid circular dependencies
  const { snapLineToStandardAngles } = require('./snapping');
  return snapLineToStandardAngles(start, end, GRID_CORE.STANDARD_ANGLES);
};

/**
 * Check if two values are approximately equal
 * @param a - First value
 * @param b - Second value
 * @param tolerance - Tolerance for comparison
 * @returns True if values are approximately equal
 */
export const approximatelyEqual = (
  a: number, 
  b: number, 
  tolerance: number = FLOATING_POINT_TOLERANCE
): boolean => {
  return Math.abs(a - b) <= tolerance;
};

/**
 * Check if a point is on a grid intersection
 * @param point - The point to check
 * @param gridSize - Grid size in the same units as the point
 * @returns True if the point is on a grid intersection
 */
export const isOnGridIntersection = (
  point: Point, 
  gridSize: number = GRID_SPACING
): boolean => {
  // Point is on grid intersection if its coordinates are multiples of grid size
  return approximatelyEqual(point.x % gridSize, 0) && 
         approximatelyEqual(point.y % gridSize, 0);
};

/**
 * Format a measurement in meters with appropriate precision
 * @param value - Value in meters
 * @param precision - Decimal precision (default: 2)
 * @returns Formatted string with m suffix
 */
export const formatMeasurement = (value: number, precision: number = 2): string => {
  return `${value.toFixed(precision)}m`;
};

/**
 * Calculate grid line positions for rendering
 * @param origin - Origin point for grid
 * @param width - Width of visible area
 * @param height - Height of visible area
 * @param gridSize - Grid size
 * @returns Array of line positions
 */
export const calculateGridLines = (
  origin: Point, 
  width: number, 
  height: number, 
  gridSize: number = GRID_SPACING
): number[] => {
  const positions: number[] = [];
  
  // Calculate start and end positions
  const startX = Math.floor(origin.x / gridSize) * gridSize;
  const startY = Math.floor(origin.y / gridSize) * gridSize;
  const endX = startX + width;
  const endY = startY + height;
  
  // Add vertical line positions
  for (let x = startX; x <= endX; x += gridSize) {
    positions.push(x);
  }
  
  // Add horizontal line positions
  for (let y = startY; y <= endY; y += gridSize) {
    positions.push(y);
  }
  
  return positions;
};

// Re-export snapping functions for convenience
export { snapToGrid, snapToAngle };
