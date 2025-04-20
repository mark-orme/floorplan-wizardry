
import { Point } from '@/types/canvas';
import { calculateDistance } from './calculations';

/**
 * Simplify a polyline using the Ramer-Douglas-Peucker algorithm
 */
export const simplifyPolyline = (points: Point[], epsilon: number): Point[] => {
  if (points.length <= 2) return points;
  
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
    
    // Concat the two parts without duplicating the middle point
    return [...firstPart.slice(0, -1), ...secondPart];
  } else {
    // Return just the endpoints
    return [points[0], points[points.length - 1]];
  }
};

/**
 * Calculate perpendicular distance from a point to a line
 */
const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  if (lineLength === 0) return calculateDistance(point, lineStart);
  
  // Area of the triangle * 2
  const area = Math.abs(
    (lineEnd.y - lineStart.y) * point.x -
    (lineEnd.x - lineStart.x) * point.y +
    lineEnd.x * lineStart.y -
    lineEnd.y * lineStart.x
  );
  
  // Return height of the triangle
  return area / lineLength;
};
