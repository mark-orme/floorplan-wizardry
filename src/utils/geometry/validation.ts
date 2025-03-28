
/**
 * Geometry validation utilities
 * @module geometry/validation
 */
import { Point } from '@/types';

/**
 * Check if a polygon is valid
 * 
 * @param {Point[]} points - Array of points forming the polygon
 * @returns {boolean} True if the polygon is valid
 */
export const validatePolygon = (points: Point[]): boolean => {
  // A polygon needs at least 3 points
  if (points.length < 3) return false;
  
  // Check for duplicate consecutive points
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    if (points[i].x === points[next].x && points[i].y === points[next].y) {
      return false;
    }
  }
  
  // Check for self-intersection (simplified)
  // For a full self-intersection check, a more complex algorithm is required
  
  return true;
};

/**
 * Check if a polygon is closed
 * 
 * @param {Point[]} points - Array of points forming the polygon
 * @param {number} threshold - Distance threshold for closing
 * @returns {boolean} True if the polygon is closed
 */
export const isPolygonClosed = (points: Point[], threshold: number = 5): boolean => {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Calculate distance between first and last point
  const dx = first.x - last.x;
  const dy = first.y - last.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance <= threshold;
};
