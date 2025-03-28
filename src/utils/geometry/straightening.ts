
/**
 * Line and shape straightening utilities
 * @module utils/geometry/straightening
 */

import { Point } from '@/types/geometryTypes';
import { distance } from './pointOperations';

/**
 * Tolerance for angle snapping in degrees
 */
const ANGLE_TOLERANCE = 5;

/**
 * Standard angles for snapping in degrees
 */
const STANDARD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * Calculate the angle between a line and the horizontal
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export const calculateAngleDegrees = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Normalize angle to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
};

/**
 * Find the closest standard angle to a given angle
 * @param angle Angle in degrees
 * @returns Closest standard angle
 */
export const findClosestStandardAngle = (angle: number): number => {
  let closestAngle = STANDARD_ANGLES[0];
  let minDiff = Math.abs(angle - closestAngle);
  
  for (let i = 1; i < STANDARD_ANGLES.length; i++) {
    const diff = Math.abs(angle - STANDARD_ANGLES[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = STANDARD_ANGLES[i];
    }
  }
  
  return closestAngle;
};

/**
 * Check if an angle is close to a standard angle
 * @param angle Angle to check
 * @returns True if angle is within tolerance of a standard angle
 */
export const isNearStandardAngle = (angle: number): boolean => {
  const closestAngle = findClosestStandardAngle(angle);
  return Math.abs(angle - closestAngle) <= ANGLE_TOLERANCE;
};

/**
 * Straighten a polyline to align with standard angles
 * @param points Array of points making up the polyline
 * @returns Straightened array of points
 */
export const straightenPolyline = (points: Point[]): Point[] => {
  if (!points || points.length < 2) return points;
  
  const result: Point[] = [{ ...points[0] }]; // Copy first point
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = result[i - 1];
    const currentPoint = points[i];
    
    // Calculate angle between points
    const angle = calculateAngleDegrees(prevPoint, currentPoint);
    
    // Find closest standard angle
    const standardAngle = findClosestStandardAngle(angle);
    
    // Calculate new point position at the standard angle
    const dist = distance(prevPoint, currentPoint);
    const radians = standardAngle * Math.PI / 180;
    
    const newPoint: Point = {
      x: prevPoint.x + dist * Math.cos(radians),
      y: prevPoint.y + dist * Math.sin(radians)
    };
    
    result.push(newPoint);
  }
  
  return result;
};

/**
 * Check if a polygon has walls aligned to standard angles
 * @param points Array of points making up the polygon
 * @returns True if all walls are aligned to standard angles
 */
export const hasAlignedWalls = (points: Point[]): boolean => {
  if (!points || points.length < 3) return false;
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const angle = calculateAngleDegrees(p1, p2);
    
    if (!isNearStandardAngle(angle)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Straighten a polygon to align with standard angles
 * @param points Array of points making up the polygon
 * @returns Straightened array of points
 */
export const straightenPolygon = (points: Point[]): Point[] => {
  // Similar to straightenPolyline but ensures the polygon is closed
  if (!points || points.length < 3) return points;
  
  const straightenedPoints = straightenPolyline(points);
  
  // Ensure the polygon is closed
  const firstPoint = straightenedPoints[0];
  const lastPoint = straightenedPoints[straightenedPoints.length - 1];
  
  if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
    straightenedPoints.push({ ...firstPoint }); // Close the polygon
  }
  
  return straightenedPoints;
};

/**
 * Straighten a stroke (polyline with specific attributes)
 * @param points Points in the stroke
 * @param strokeType Type of stroke
 * @returns Straightened array of points
 */
export const straightenStroke = (points: Point[], strokeType: string): Point[] => {
  if (!points || points.length < 2) return points;
  
  // Use different straightening methods based on stroke type
  if (strokeType === 'wall' || strokeType === 'room') {
    return straightenPolyline(points);
  }
  
  // For other types, only straighten if close to standard angles
  const angle = calculateAngleDegrees(points[0], points[points.length - 1]);
  if (isNearStandardAngle(angle)) {
    return straightenPolyline(points);
  }
  
  return points;
};
