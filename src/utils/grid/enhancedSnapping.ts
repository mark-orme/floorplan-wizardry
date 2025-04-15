/**
 * Enhanced grid snapping utilities for precise measurements
 * @module utils/grid/enhancedSnapping
 */
import { Point } from '@/types/core/Point';
import { GRID_SPACING, PIXELS_PER_METER, STANDARD_ANGLES } from '@/constants/numerics';

/**
 * Snap a value to the grid
 * @param value - Value to snap
 * @param gridSize - Grid size to snap to
 * @returns Snapped value
 */
export const snapValueToGrid = (
  value: number, 
  gridSize: number = GRID_SPACING.DEFAULT
): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a point to the nearest grid intersection
 * @param point - Point to snap
 * @param gridSize - Grid size to snap to
 * @returns Snapped point
 */
export const snapPointToGridPrecise = (
  point: Point, 
  gridSize: number = GRID_SPACING.DEFAULT
): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line to precise grid increments
 * @param start - Starting point
 * @param end - Ending point
 * @param gridSize - Grid size
 * @returns Snapped line endpoints
 */
export const snapLineToPreciseGrid = (
  start: Point, 
  end: Point, 
  gridSize: number = GRID_SPACING.DEFAULT
): { start: Point, end: Point } => {
  // Always keep the start point fixed
  const startSnapped = { ...start };
  
  // Only snap the end point to grid
  const endSnapped = snapPointToGridPrecise(end, gridSize);
  
  return { start: startSnapped, end: endSnapped };
};

/**
 * Snap line angle to standard angles (0, 45, 90, etc)
 * @param start - Starting point (fixed)
 * @param end - End point (to be adjusted)
 * @param snapAngleIncrement - Angle increment in degrees
 * @returns End point adjusted to standard angle
 */
export const snapLineToStandardAngles = (
  start: Point,
  end: Point,
  snapAngleIncrement: number = 45
): Point => {
  // Calculate the angle of the line
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Skip if end point is same as start (avoid division by zero)
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { ...end };
  }
  
  // Calculate angle and distance
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Convert to degrees and snap to increment
  let angleDeg = angle * (180 / Math.PI);
  const snappedAngle = Math.round(angleDeg / snapAngleIncrement) * snapAngleIncrement;
  
  // Convert back to radians
  const snappedRad = snappedAngle * (Math.PI / 180);
  
  // Calculate new endpoint with same distance but snapped angle
  return {
    x: start.x + distance * Math.cos(snappedRad),
    y: start.y + distance * Math.sin(snappedRad)
  };
};

/**
 * Get the nearest standard angle
 * @param angleDeg - Angle in degrees
 * @returns Nearest standard angle or null if not close
 */
export const getNearestStandardAngle = (
  angleDeg: number
): number | null => {
  // Find nearest standard angle
  let nearestAngle = STANDARD_ANGLES[0];
  let minDiff = Math.abs(angleDeg - nearestAngle);
  
  for (const standardAngle of STANDARD_ANGLES) {
    const diff = Math.abs(angleDeg - standardAngle);
    if (diff < minDiff) {
      minDiff = diff;
      nearestAngle = standardAngle;
    }
  }
  
  // Only return if within threshold (5 degrees)
  return minDiff <= 5 ? nearestAngle : null;
};

/**
 * Calculates the angle between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Angle in degrees (0-360)
 */
export const calculateAngleDegrees = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians
  const angleRad = Math.atan2(dy, dx);
  
  // Convert to degrees
  let angleDeg = angleRad * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angleDeg < 0) {
    angleDeg += 360;
  }
  
  return angleDeg;
};

/**
 * Convert pixels to meters with specified precision
 * @param pixels - Distance in pixels
 * @param precision - Decimal precision
 * @returns Distance in meters
 */
export const pixelsToMeters = (
  pixels: number, 
  precision: number = 1
): number => {
  const meters = pixels / PIXELS_PER_METER;
  const factor = Math.pow(10, precision);
  return Math.round(meters * factor) / factor;
};

/**
 * Format measurement data for display
 * @param start - Start point
 * @param end - End point
 * @returns Formatted measurement data
 */
export const formatMeasurementData = (
  start: Point, 
  end: Point
): { 
  distance: string; 
  angle: string; 
  isStandardAngle: boolean;
  nearestStandard: number | null;
} => {
  // Calculate distance in pixels
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distancePixels = Math.sqrt(dx * dx + dy * dy);
  
  // Convert to meters with 1 decimal precision (0.1m)
  const distanceMeters = pixelsToMeters(distancePixels, 1);
  
  // Calculate angle
  const angle = calculateAngleDegrees(start, end);
  
  // Find nearest standard angle
  const nearestStandard = getNearestStandardAngle(angle);
  
  return {
    distance: `${distanceMeters.toFixed(1)}m`,
    angle: `${Math.round(angle)}°`,
    isStandardAngle: nearestStandard !== null,
    nearestStandard
  };
};
