
/**
 * Grid measurement utilities
 * Provides functions for measuring distances and areas on the grid
 * @module grid/measurements
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING, PIXELS_PER_METER } from '../gridConstants';

/**
 * Calculate distance to nearest grid line
 * Useful for determining when to snap to grid
 * 
 * @param {Point} point - Point to check
 * @param {number} gridSize - Grid size
 * @returns {{x: number, y: number}} Distance to nearest grid line in x and y directions
 */
export const distanceToNearestGridLine = (
  point: Point,
  gridSize: number = GRID_SPACING
): {x: number, y: number} => {
  if (!point) return { x: 0, y: 0 };
  
  // Calculate remainder when divided by grid size
  const remainderX = Math.abs(point.x % gridSize);
  const remainderY = Math.abs(point.y % gridSize);
  
  // Find shorter distance to grid line
  const distanceX = Math.min(
    remainderX,
    gridSize - remainderX
  );
  
  const distanceY = Math.min(
    remainderY, 
    gridSize - remainderY
  );
  
  return { x: distanceX, y: distanceY };
};

/**
 * Calculate distance between two points in grid units
 * 
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Distance in grid units
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  if (!point1 || !point2) return 0;
  
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert pixel distance to metric (meters)
 * 
 * @param {number} pixelDistance - Distance in pixels
 * @returns {number} Distance in meters
 */
export const pixelsToMeters = (pixelDistance: number): number => {
  return pixelDistance / PIXELS_PER_METER;
};

/**
 * Convert metric distance (meters) to pixels
 * 
 * @param {number} meterDistance - Distance in meters
 * @returns {number} Distance in pixels
 */
export const metersToPixels = (meterDistance: number): number => {
  return meterDistance * PIXELS_PER_METER;
};

/**
 * Calculate area of a polygon in square meters
 * 
 * @param {Point[]} points - Array of polygon vertices
 * @returns {number} Area in square meters
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  // Calculate area using Shoelace formula
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  area = Math.abs(area) / 2;
  
  // Convert area from square pixels to square meters
  return pixelsToMeters(area) * pixelsToMeters(1);
};

/**
 * Calculate perimeter of a polygon in meters
 * 
 * @param {Point[]} points - Array of polygon vertices
 * @returns {number} Perimeter in meters
 */
export const calculatePolygonPerimeter = (points: Point[]): number => {
  if (!points || points.length < 2) return 0;
  
  let perimeter = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    perimeter += calculateDistance(points[i], points[j]);
  }
  
  // Convert perimeter from pixels to meters
  return pixelsToMeters(perimeter);
};
