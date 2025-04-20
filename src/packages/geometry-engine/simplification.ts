
/**
 * Polyline simplification utilities
 * Uses the Ramer-Douglas-Peucker algorithm
 * @module geometry-engine/simplification
 */
import { Point, LineSegment } from './types';
import { perpendicularDistance } from './core';

/**
 * Simplify a polyline using the Ramer-Douglas-Peucker algorithm
 * @param points Array of points defining the polyline
 * @param tolerance Distance tolerance for simplification
 * @returns Simplified polyline points
 */
export function simplifyPolyline(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) {
    return [...points]; // Return a copy to avoid reference issues
  }
  
  // Find the point with the maximum distance
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const line: LineSegment = { start: firstPoint, end: lastPoint };
  
  let maxDistance = 0;
  let maxIndex = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], line);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    // Recursive calls
    const firstHalf = simplifyPolyline(points.slice(0, maxIndex + 1), tolerance);
    const secondHalf = simplifyPolyline(points.slice(maxIndex), tolerance);
    
    // Concatenate the results (avoid duplicating the split point)
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    // If all points are within tolerance, return just the endpoints
    return [firstPoint, lastPoint];
  }
}
