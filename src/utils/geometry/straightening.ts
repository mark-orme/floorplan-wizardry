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
const STRAIGHTEN_THRESHOLD = 5;

/**
 * Straighten a polyline by adjusting points to be aligned horizontally or vertically
 * @param points Array of points forming the polyline
 * @returns Straightened points
 */
export function straightenPolyline(points: Point[]): Point[] {
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
    
    if (isNearHorizontal(angle)) {
      // Make horizontal (same y as previous point)
      newPoint = {
        x: current.x,
        y: prev.y
      };
    } else if (isNearVertical(angle)) {
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
 * Similar to straightenPolyline but ensures first and last points connect properly
 * @param points Array of points forming the polygon
 * @returns Straightened points
 */
export function straightenPolygon(points: Point[]): Point[] {
  if (!points || points.length < 3) return points;
  
  // Use the polyline straightening for most points
  const straightened = straightenPolyline(points);
  
  // Additional step: handle connection between last and first point
  const last = straightened[straightened.length - 1];
  const first = straightened[0];
  
  const angle = calculateAngle(last, first);
  
  if (isNearHorizontal(angle)) {
    // Last-to-first connection should be horizontal
    straightened[straightened.length - 1] = {
      x: last.x,
      y: first.y
    };
  } else if (isNearVertical(angle)) {
    // Last-to-first connection should be vertical
    straightened[straightened.length - 1] = {
      x: first.x,
      y: last.y
    };
  }
  
  return straightened;
}

/**
 * Check if angle is near horizontal (0 or 180 degrees)
 * @param angle Angle in degrees
 * @returns True if near horizontal
 */
function isNearHorizontal(angle: number): boolean {
  const absAngle = Math.abs(angle);
  return (absAngle <= STRAIGHTEN_THRESHOLD || 
          Math.abs(absAngle - 180) <= STRAIGHTEN_THRESHOLD);
}

/**
 * Check if angle is near vertical (90 or 270 degrees)
 * @param angle Angle in degrees
 * @returns True if near vertical
 */
function isNearVertical(angle: number): boolean {
  const absAngle = Math.abs(angle);
  return (Math.abs(absAngle - 90) <= STRAIGHTEN_THRESHOLD || 
          Math.abs(absAngle - 270) <= STRAIGHTEN_THRESHOLD);
}

/**
 * Straighten a line by adjusting the end point
 * @param start Start point
 * @param end End point
 * @returns Straightened end point
 */
export function straightenLine(start: Point, end: Point): Point {
  const angle = calculateAngle(start, end);
  
  if (isNearHorizontal(angle)) {
    // Make horizontal
    return {
      x: end.x,
      y: start.y
    };
  } else if (isNearVertical(angle)) {
    // Make vertical
    return {
      x: start.x,
      y: end.y
    };
  }
  
  // Return original if not near horizontal or vertical
  return end;
}
