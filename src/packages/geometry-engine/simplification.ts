
import { Point } from './types';

/**
 * Simplify a polyline using the Ramer-Douglas-Peucker algorithm
 * @param points Array of points
 * @param epsilon Tolerance for simplification
 * @returns Simplified array of points
 */
export const simplifyPolyline = (points: Point[], epsilon: number): Point[] => {
  if (points.length <= 2) return points;
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const start = points[0];
  const end = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const firstPart = simplifyPolyline(points.slice(0, index + 1), epsilon);
    const secondPart = simplifyPolyline(points.slice(index), epsilon);
    
    // Concatenate the results
    return firstPart.slice(0, -1).concat(secondPart);
  } else {
    // Base case: return just the endpoints
    return [start, end];
  }
};

/**
 * Calculate the perpendicular distance from a point to a line segment
 * @param point Point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Perpendicular distance
 */
export const perpendicularDistance = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return the distance to that point
  if (dx === 0 && dy === 0) {
    const diffX = point.x - lineStart.x;
    const diffY = point.y - lineStart.y;
    return Math.sqrt(diffX * diffX + diffY * diffY);
  }
  
  // Calculate the perpendicular distance
  const norm = Math.sqrt(dx * dx + dy * dy);
  return Math.abs((dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / norm);
};
