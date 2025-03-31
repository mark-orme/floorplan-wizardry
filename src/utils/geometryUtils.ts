
/**
 * Geometry utilities for working with points, lines, and shapes
 * @module utils/geometryUtils
 */
import { Point } from '@/types/core/Point';

/**
 * Calculate Euclidean distance between two points
 * 
 * @param {Point} point1 - First point coordinates
 * @param {Point} point2 - Second point coordinates
 * @returns {number} - Distance between the points in pixels
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;
  
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

/**
 * Calculate angle between two points (in radians)
 * 
 * @param {Point} point1 - Starting point
 * @param {Point} point2 - End point
 * @returns {number} - Angle in radians
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

/**
 * Calculate midpoint between two points
 * 
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {Point} - Midpoint coordinates
 */
export const calculateMidpoint = (point1: Point, point2: Point): Point => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};

/**
 * Check if a point is inside a polygon (using ray casting algorithm)
 * 
 * @param {Point} point - The point to check
 * @param {Point[]} polygon - Array of points forming the polygon
 * @returns {boolean} - True if the point is inside the polygon
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const intersect = 
      ((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
      (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / 
      (polygon[j].y - polygon[i].y) + polygon[i].x);
      
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Convert distance in pixels to meters based on scale
 * 
 * @param {number} pixels - Distance in pixels
 * @param {number} pixelsPerMeter - Scale factor (pixels per meter)
 * @returns {number} - Distance in meters
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = 100): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert distance in meters to pixels based on scale
 * 
 * @param {number} meters - Distance in meters
 * @param {number} pixelsPerMeter - Scale factor (pixels per meter)
 * @returns {number} - Distance in pixels
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number = 100): number => {
  return meters * pixelsPerMeter;
};
