
/**
 * Polyline simplification algorithms
 * @module geometry-engine/simplification
 */
import { Point, LineSegment } from './types';
import { perpendicularDistance } from './core';

/**
 * Douglas-Peucker algorithm for polyline simplification
 * @param points Input points array
 * @param tolerance Distance tolerance for simplification
 * @returns Simplified points array
 */
export function simplifyPolyline(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  const line: LineSegment = {
    start: firstPoint,
    end: lastPoint
  };
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], line);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const firstHalf = simplifyPolyline(points.slice(0, index + 1), tolerance);
    const secondHalf = simplifyPolyline(points.slice(index), tolerance);
    
    // Concatenate the results, avoiding duplicate points
    return firstHalf.slice(0, -1).concat(secondHalf);
  } else {
    // If max distance is less than tolerance, return just the endpoints
    return [firstPoint, lastPoint];
  }
}

/**
 * Radial distance simplification algorithm
 * @param points Input points array
 * @param tolerance Distance tolerance for simplification
 * @returns Simplified points array
 */
export function simplifyRadial(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  
  let prevPoint = points[0];
  const result: Point[] = [prevPoint];
  
  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - prevPoint.x, 2) + 
      Math.pow(currentPoint.y - prevPoint.y, 2)
    );
    
    if (distance > tolerance) {
      result.push(currentPoint);
      prevPoint = currentPoint;
    }
  }
  
  // Always include the last point
  if (prevPoint !== points[points.length - 1]) {
    result.push(points[points.length - 1]);
  }
  
  return result;
}
