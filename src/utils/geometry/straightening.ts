
/**
 * Line straightening utilities
 * @module utils/geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { snapToAngle } from '@/utils/grid/snapping';

/**
 * Straighten a polyline by snapping the angles to standard increments
 * @param points Array of points defining the polyline
 * @param angleStep Angle increment to snap to (default: 45 degrees)
 * @returns New array of straightened points
 */
export const straightenPolyline = (points: Point[], angleStep: number = 45): Point[] => {
  if (points.length < 2) return [...points];
  
  const result: Point[] = [{ ...points[0] }]; // Start with the first point
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = result[i-1];
    const currentPoint = points[i];
    
    // Calculate angle and distance
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Snap angle to the nearest increment
    const snappedAngle = snapToAngle(angle, angleStep);
    const snappedRadian = snappedAngle * (Math.PI / 180);
    
    // Calculate new point position
    const newPoint = {
      x: prevPoint.x + Math.cos(snappedRadian) * distance,
      y: prevPoint.y + Math.sin(snappedRadian) * distance
    };
    
    result.push(newPoint);
  }
  
  return result;
};

/**
 * Check if points are aligned horizontally or vertically
 * @param p1 First point
 * @param p2 Second point
 * @param tolerance Tolerance in pixels (default: 2)
 * @returns True if points are aligned
 */
export const arePointsAligned = (p1: Point, p2: Point, tolerance: number = 2): boolean => {
  return (
    Math.abs(p1.x - p2.x) <= tolerance || // Vertical alignment
    Math.abs(p1.y - p2.y) <= tolerance    // Horizontal alignment
  );
};

/**
 * Legacy version of function (aliased as straightenPolygon for tests)
 */
export const straightenPolygon = straightenPolyline;

/**
 * Check if all walls in a polygon are aligned to standard angles
 * @param points Points defining the polygon
 * @param angleStep Angle step for alignment checking
 * @returns True if all walls are aligned
 */
export const hasAlignedWalls = (points: Point[], angleStep: number = 45): boolean => {
  if (points.length < 3) return false;
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    // Calculate angle
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    const snappedAngle = snapToAngle(angle, angleStep);
    
    // Check if angle is not aligned
    if (Math.abs(angle - snappedAngle) > 1) { // 1 degree tolerance
      return false;
    }
  }
  
  return true;
};

/**
 * Straighten a stroke based on its control points
 * @param points Array of points forming the stroke
 * @returns Straightened points
 */
export const straightenStroke = (points: Point[]): Point[] => {
  return straightenPolyline(points);
};
