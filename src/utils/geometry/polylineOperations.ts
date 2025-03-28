
/**
 * Polyline operation utilities
 * @module utils/geometry/polylineOperations
 */
import { Point } from '@/types/geometryTypes';

/**
 * Calculate the length of a polyline
 * @param points Points defining the polyline
 * @returns Length of the polyline
 */
export const calculatePolylineLength = (points: Point[]): number => {
  if (points.length < 2) return 0;
  
  let length = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return length;
};

/**
 * Simplify a polyline using the Ramer-Douglas-Peucker algorithm
 * @param points Points defining the polyline
 * @param epsilon Simplification tolerance
 * @returns Simplified polyline points
 */
export const simplifyPolyline = (points: Point[], epsilon: number): Point[] => {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    // Recursive call
    const firstPart = simplifyPolyline(points.slice(0, index + 1), epsilon);
    const secondPart = simplifyPolyline(points.slice(index), epsilon);
    
    // Concatenate the two parts (removing duplicate point)
    return [...firstPart.slice(0, -1), ...secondPart];
  } else {
    // Base case: return just the endpoints
    return [points[0], points[points.length - 1]];
  }
};

/**
 * Calculate perpendicular distance from a point to a line segment
 * @param point Point to measure distance from
 * @param lineStart Start point of line segment
 * @param lineEnd End point of line segment
 * @returns Perpendicular distance
 */
export const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  
  if (lineLength === 0) return 0;
  
  // Calculate perpendicular distance
  return Math.abs((dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / lineLength);
};
