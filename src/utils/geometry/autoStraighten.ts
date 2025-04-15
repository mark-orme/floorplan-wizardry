
/**
 * Utilities for auto-straightening lines during drawing
 * @module utils/geometry/autoStraighten
 */
import { Point } from '@/types/core/Point';
import { STANDARD_ANGLES, ANGLE_SNAP_THRESHOLD, PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Automatically straighten a line based on its angle
 * @param startPoint - Starting point of the line
 * @param endPoint - Current end point of the line
 * @param threshold - Threshold in degrees for snapping to standard angles
 * @returns Corrected end point that creates a straight line
 */
export const autoStraightenLine = (
  startPoint: Point, 
  endPoint: Point, 
  threshold: number = ANGLE_SNAP_THRESHOLD
): Point => {
  // Calculate the current angle
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Calculate the current distance
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Find the nearest standard angle
  let closestAngle = 0;
  let minDiff = 360;
  
  for (const angle of STANDARD_ANGLES) {
    // Calculate the difference, accounting for 360 degree wraparound
    let diff = Math.abs(currentAngle - angle);
    if (diff > 180) {
      diff = 360 - diff;
    }
    
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = angle;
    }
  }
  
  // Only straighten if we're close enough to a standard angle
  if (minDiff <= threshold) {
    // Convert back to radians
    const radians = closestAngle * (Math.PI / 180);
    
    // Calculate new end point with same distance but aligned angle
    return {
      x: startPoint.x + distance * Math.cos(radians),
      y: startPoint.y + distance * Math.sin(radians)
    };
  }
  
  // If we're not close to a standard angle, return the original end point
  return { ...endPoint };
};

/**
 * Check if a line is close to horizontal or vertical
 * @param startPoint - Starting point of the line
 * @param endPoint - End point of the line
 * @param threshold - Threshold in degrees for considering horizontal/vertical
 * @returns Whether the line is close to horizontal or vertical
 */
export const isNearCardinalDirection = (
  startPoint: Point, 
  endPoint: Point, 
  threshold: number = ANGLE_SNAP_THRESHOLD
): boolean => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Check if near 0, 90, 180, or 270 degrees
  const mod90 = Math.abs(angle % 90);
  return mod90 <= threshold || mod90 >= (90 - threshold);
};

/**
 * Calculate the angle between two points
 * @param startPoint - Starting point
 * @param endPoint - End point
 * @returns Angle in degrees (0-360)
 */
export const calculateAngleDegrees = (startPoint: Point, endPoint: Point): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
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
 * Format measurement data including distance and angle
 * @param startPoint - Starting point
 * @param endPoint - End point
 * @returns Formatted measurement data object
 */
export const getMeasurementData = (startPoint: Point, endPoint: Point) => {
  // Calculate distance in pixels
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distancePixels = Math.sqrt(dx * dx + dy * dy);
  
  // Convert to meters
  const distanceMeters = distancePixels / PIXELS_PER_METER;
  
  // Calculate angle
  const angle = calculateAngleDegrees(startPoint, endPoint);
  
  // Check if the angle is near a standard angle
  const isStandardAngle = STANDARD_ANGLES.some(
    standardAngle => Math.abs(angle - standardAngle) <= ANGLE_SNAP_THRESHOLD
  );
  
  return {
    distance: distanceMeters.toFixed(2) + 'm',
    angle: Math.round(angle) + '°',
    isStandardAngle,
    distancePixels,
    distanceMeters,
    angleDegrees: angle
  };
};
