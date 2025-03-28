/**
 * Path processing utilities
 * @module geometry/pathProcessing
 */
import { Point } from '@/types';

/**
 * Simplify a path by removing redundant points
 * Uses Ramer-Douglas-Peucker algorithm
 * 
 * @param {Point[]} points - Array of points to simplify
 * @param {number} epsilon - Simplification threshold
 * @returns {Point[]} Simplified array of points
 */
export const simplifyPath = (points: Point[], epsilon: number = 1): Point[] => {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const start = points[0];
  const end = points[points.length - 1];
  
  // Find point with max distance from line between start and end
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    // Recursive case
    const firstSegment = simplifyPath(points.slice(0, index + 1), epsilon);
    const secondSegment = simplifyPath(points.slice(index), epsilon);
    
    // Combine the two segments, removing duplicate point
    return [...firstSegment.slice(0, -1), ...secondSegment];
  } else {
    // Base case
    return [start, end];
  }
};

/**
 * Calculate perpendicular distance from a point to a line
 * 
 * @param {Point} point - The point
 * @param {Point} lineStart - Start point of the line
 * @param {Point} lineEnd - End point of the line
 * @returns {number} Perpendicular distance
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return distance to the point
  if (dx === 0 && dy === 0) {
    const pdx = point.x - lineStart.x;
    const pdy = point.y - lineStart.y;
    return Math.sqrt(pdx * pdx + pdy * pdy);
  }
  
  // Calculate the line length
  const lineLengthSquared = dx * dx + dy * dy;
  
  // Calculate the parameter of the projection
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  // Clamp t to [0,1]
  const tClamped = Math.max(0, Math.min(1, t));
  
  // Calculate the projected point on the line
  const projectedX = lineStart.x + tClamped * dx;
  const projectedY = lineStart.y + tClamped * dy;
  
  // Calculate distance to the projected point
  const pdx = point.x - projectedX;
  const pdy = point.y - projectedY;
  
  return Math.sqrt(pdx * pdx + pdy * pdy);
}

/**
 * Smooth a path by applying a moving average
 * 
 * @param {Point[]} points - Array of points to smooth
 * @param {number} windowSize - Size of the smoothing window
 * @returns {Point[]} Smoothed array of points
 */
export const smoothPath = (points: Point[], windowSize: number = 3): Point[] => {
  if (points.length <= 2 || windowSize < 2) return [...points];
  
  const halfWindow = Math.floor(windowSize / 2);
  const result: Point[] = [];
  
  // Keep first and last points unchanged
  result.push(points[0]);
  
  // Process middle points
  for (let i = 1; i < points.length - 1; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    // Calculate average in the window
    for (let j = Math.max(0, i - halfWindow); j <= Math.min(points.length - 1, i + halfWindow); j++) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }
    
    result.push({
      x: sumX / count,
      y: sumY / count
    } as Point);
  }
  
  // Add the last point
  result.push(points[points.length - 1]);
  
  return result;
};
