
import { Point } from './types';
import { perpendicularDistance } from './core';

/**
 * Simplify a polyline using the Ramer-Douglas-Peucker algorithm
 * @param points Original polyline points
 * @param epsilon Maximum allowed distance 
 * @returns Simplified polyline
 */
export function simplifyPolyline(points: Point[], epsilon: number = 2): Point[] {
  if (points.length <= 2) {
    return [...points];
  }
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let maxIndex = 0;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const firstHalf = simplifyPolyline(points.slice(0, maxIndex + 1), epsilon);
    const secondHalf = simplifyPolyline(points.slice(maxIndex), epsilon);
    
    // Concatenate the two parts (remove duplicate point)
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    // If max distance is less than epsilon, return just the endpoints
    return [firstPoint, lastPoint];
  }
}
