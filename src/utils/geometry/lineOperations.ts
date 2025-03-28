
/**
 * Line operations utility
 * @module geometry/lineOperations
 */
import { Point } from '@/types/geometryTypes';

/**
 * Calculate angle between two points in degrees
 * Returns the angle in degrees from the positive x-axis
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Angle in degrees (0-360)
 */
export const calculateAngle = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Convert from radians to degrees and normalize to 0-360
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize to 0-360 degrees
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Calculate distance between two points
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Distance in pixels
 */
export const calculateDistance = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {Point} Midpoint
 */
export const calculateMidpoint = (start: Point, end: Point): Point => {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
};

/**
 * Check if two lines are parallel
 * 
 * @param {Point} line1Start - First line start point
 * @param {Point} line1End - First line end point
 * @param {Point} line2Start - Second line start point
 * @param {Point} line2End - Second line end point
 * @param {number} angleTolerance - Angle tolerance in degrees
 * @returns {boolean} Whether the lines are parallel
 */
export const areLinesParallel = (
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point,
  angleTolerance: number = 5
): boolean => {
  const angle1 = calculateAngle(line1Start, line1End);
  const angle2 = calculateAngle(line2Start, line2End);
  
  // Calculate the smaller angle between the two lines
  let angleDiff = Math.abs(angle1 - angle2) % 180;
  if (angleDiff > 90) {
    angleDiff = 180 - angleDiff;
  }
  
  return angleDiff <= angleTolerance;
};

/**
 * Calculate the slope of a line
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Slope of the line (Infinity for vertical lines)
 */
export const calculateSlope = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  
  // Avoid division by zero for vertical lines
  if (Math.abs(dx) < 0.0001) {
    return Infinity;
  }
  
  return (end.y - start.y) / dx;
};

/**
 * Get a point at a certain distance along a line
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @param {number} distance - Distance from start
 * @returns {Point} New point
 */
export const getPointAtDistance = (
  start: Point,
  end: Point,
  distance: number
): Point => {
  const totalDistance = calculateDistance(start, end);
  
  // Avoid division by zero
  if (totalDistance < 0.0001) {
    return { ...start };
  }
  
  const ratio = distance / totalDistance;
  
  return {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio
  };
};

/**
 * Check if a point is on a line segment
 * 
 * @param {Point} point - Point to check
 * @param {Point} lineStart - Line start point
 * @param {Point} lineEnd - Line end point
 * @param {number} tolerance - Distance tolerance
 * @returns {boolean} Whether the point is on the line
 */
export const isPointOnLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  tolerance: number = 1
): boolean => {
  // Calculate distances
  const d1 = calculateDistance(point, lineStart);
  const d2 = calculateDistance(point, lineEnd);
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  // Check if point is on line (with tolerance)
  const delta = Math.abs(d1 + d2 - lineLength);
  
  return delta <= tolerance;
};
