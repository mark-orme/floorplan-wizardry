/**
 * Line straightening utilities
 * Functions for straightening and aligning lines
 * @module utils/geometry/straightening
 */

import { Point } from '@/types/geometryTypes';
import { calculateAngle } from './lineOperations';

/**
 * Threshold for considering a line as horizontal or vertical
 * If angle is within this threshold of 0, 90, 180, or 270 degrees
 */
export const DEFAULT_STRAIGHTENING_THRESHOLD = 5;

/**
 * Straighten a line by adjusting endpoint to align with common angles
 * @param start Starting point of the line
 * @param end Ending point of the line
 * @param threshold Angle threshold for straightening in degrees
 * @returns The adjusted endpoint for a straightened line
 */
export function straightenLine(start: Point, end: Point, threshold = DEFAULT_STRAIGHTENING_THRESHOLD): Point {
  // Calculate angle between start and end
  const angle = calculateAngle(start, end);
  
  // Check if angle is close to horizontal (0° or 180°)
  if (isNearHorizontal(angle, threshold)) {
    return { x: end.x, y: start.y }; // Keep x, adjust y to match start
  }
  
  // Check if angle is close to vertical (90° or 270°)
  if (isNearVertical(angle, threshold)) {
    return { x: start.x, y: end.y }; // Keep y, adjust x to match start
  }
  
  // Check if angle is close to 45°, 135°, 225° or 315°
  if (isNear45Degrees(angle, threshold)) {
    // Make line exactly at 45 degrees
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const avg = (Math.abs(dx) + Math.abs(dy)) / 2;
    const signX = dx > 0 ? 1 : -1;
    const signY = dy > 0 ? 1 : -1;
    
    return {
      x: start.x + (signX * avg),
      y: start.y + (signY * avg)
    };
  }
  
  // If angle is not close to any standard angle, return unchanged
  return end;
}

/**
 * Straighten a polyline by adjusting points to be aligned horizontally or vertically
 * @param points Array of points forming the polyline
 * @param threshold Angle threshold for straightening
 * @returns Straightened points
 */
export function straightenPolyline(points: Point[], threshold = DEFAULT_STRAIGHTENING_THRESHOLD): Point[] {
  if (!points || points.length < 2) return points;

  const result: Point[] = [];
  result.push({...points[0]});  // Copy first point

  for (let i = 1; i < points.length; i++) {
    const prev = points[i-1];
    const current = points[i];
    
    // Calculate angle between previous and current point
    const angle = calculateAngle(prev, current);
    
    // Determine if line should be horizontal or vertical
    let newPoint: Point;
    
    if (isNearHorizontal(angle, threshold)) {
      // Make horizontal (same y as previous point)
      newPoint = {
        x: current.x,
        y: prev.y
      };
    } else if (isNearVertical(angle, threshold)) {
      // Make vertical (same x as previous point)
      newPoint = {
        x: prev.x,
        y: current.y
      };
    } else {
      // Keep original point
      newPoint = {...current};
    }
    
    result.push(newPoint);
  }
  
  return result;
}

/**
 * Straighten a polygon by adjusting points to be aligned horizontally or vertically
 * @param points Array of points forming the polygon
 * @param threshold Angle threshold for straightening
 * @returns Straightened points
 */
export function straightenPolygon(points: Point[], threshold = DEFAULT_STRAIGHTENING_THRESHOLD): Point[] {
  if (!points || points.length < 3) return points;
  
  // Use the polyline straightening for most points
  const straightened = straightenPolyline(points, threshold);
  
  // Additional step: handle connection between last and first point
  const last = straightened[straightened.length - 1];
  const first = straightened[0];
  
  const angle = calculateAngle(last, first);
  
  if (isNearHorizontal(angle, threshold)) {
    // Last-to-first connection should be horizontal
    straightened[straightened.length - 1] = {
      x: last.x,
      y: first.y
    };
  } else if (isNearVertical(angle, threshold)) {
    // Last-to-first connection should be vertical
    straightened[straightened.length - 1] = {
      x: first.x,
      y: last.y
    };
  }
  
  return straightened;
}

/**
 * Straighten a stroke by simplifying it to a direct line between first and last points
 * Used to convert freehand drawing to straight lines
 * @param points Array of points in the stroke
 * @param threshold Angle threshold for straightening
 * @returns Simplified array with just 2 points for a straight line
 */
export function straightenStroke(points: Point[], threshold = DEFAULT_STRAIGHTENING_THRESHOLD): Point[] {
  if (!points || points.length <= 1) return points;
  
  // For simplicity, just create a line from first to last point
  const first = points[0];
  const last = points[points.length - 1];
  
  // Straighten the endpoint based on the starting point
  const straightenedEnd = straightenLine(first, last, threshold);
  
  // Return just two points - start and straightened end
  return [first, straightenedEnd];
}

/**
 * Check if a polygon has walls that are aligned to cardinal directions
 * @param points Array of points forming the polygon
 * @param threshold Angle threshold for alignment
 * @returns True if all walls are aligned to cardinal directions
 */
export function hasAlignedWalls(points: Point[], threshold = DEFAULT_STRAIGHTENING_THRESHOLD): boolean {
  if (!points || points.length < 3) return false;
  
  // Check each wall segment
  for (let i = 0; i < points.length; i++) {
    const start = points[i];
    const end = points[(i + 1) % points.length]; // Wrap around for the last point
    
    const angle = calculateAngle(start, end);
    
    // Wall should be horizontal, vertical or diagonal
    if (!isNearHorizontal(angle, threshold) && 
        !isNearVertical(angle, threshold) && 
        !isNear45Degrees(angle, threshold)) {
      return false; // Found a wall that's not aligned
    }
  }
  
  return true;
}

/**
 * Check if angle is near horizontal (0 or 180 degrees)
 * @param angle Angle in degrees
 * @param threshold Maximum deviation in degrees
 * @returns True if near horizontal
 */
function isNearHorizontal(angle: number, threshold: number): boolean {
  const absAngle = Math.abs(angle);
  return (absAngle <= threshold || 
          Math.abs(absAngle - 180) <= threshold);
}

/**
 * Check if angle is near vertical (90 or 270 degrees)
 * @param angle Angle in degrees
 * @param threshold Maximum deviation in degrees
 * @returns True if near vertical
 */
function isNearVertical(angle: number, threshold: number): boolean {
  const absAngle = Math.abs(angle);
  return (Math.abs(absAngle - 90) <= threshold || 
          Math.abs(absAngle - 270) <= threshold);
}

/**
 * Check if angle is near 45, 135, 225, or 315 degrees
 * @param angle Angle in degrees
 * @param threshold Maximum deviation in degrees
 * @returns True if near 45-degree angle
 */
function isNear45Degrees(angle: number, threshold: number): boolean {
  const absAngle = Math.abs(angle);
  return (Math.abs(absAngle - 45) <= threshold || 
          Math.abs(absAngle - 135) <= threshold ||
          Math.abs(absAngle - 225) <= threshold ||
          Math.abs(absAngle - 315) <= threshold);
}

export const WALL_ALIGNMENT_THRESHOLD = 5;
