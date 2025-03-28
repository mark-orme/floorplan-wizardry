
/**
 * Line straightening utilities
 * @module utils/geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { isHorizontalLine, isVerticalLine } from './lineOperations';

/**
 * Straighten a line to be perfectly horizontal or vertical
 * if it's close to either of those orientations
 * @param points Line points to straighten
 * @returns Straightened points
 */
export const straightenPolyline = (points: Point[]): Point[] => {
  if (!points || points.length < 2) return points;
  
  const result: Point[] = [...points];
  
  // Determine if the overall line is more horizontal or vertical
  const start = points[0];
  const end = points[points.length - 1];
  
  if (isHorizontalLine(start, end)) {
    // Make all points have the same y as the start point
    for (let i = 1; i < result.length - 1; i++) {
      result[i] = { x: result[i].x, y: start.y };
    }
    // Make sure end point is also aligned
    result[result.length - 1] = { x: end.x, y: start.y };
  } else if (isVerticalLine(start, end)) {
    // Make all points have the same x as the start point
    for (let i = 1; i < result.length - 1; i++) {
      result[i] = { x: start.x, y: result[i].y };
    }
    // Make sure end point is also aligned
    result[result.length - 1] = { x: start.x, y: end.y };
  }
  
  return result;
};

/**
 * Check if a polyline has aligned walls (horizontal or vertical)
 * @param points Points defining the polyline
 * @returns True if the polyline has aligned walls
 */
export const hasAlignedWalls = (points: Point[]): boolean => {
  if (!points || points.length < 2) return false;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    if (isHorizontalLine(p1, p2) || isVerticalLine(p1, p2)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Straighten a stroke defined by points
 * @param points Points defining the stroke
 * @returns Straightened points
 */
export const straightenStroke = (points: Point[]): Point[] => {
  return straightenPolyline(points);
};

/**
 * Alias for straightenPolyline for backward compatibility
 */
export const straightenLine = straightenPolyline;
