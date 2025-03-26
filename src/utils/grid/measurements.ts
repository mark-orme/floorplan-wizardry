
/**
 * Grid measurement utilities
 * Provides functions for measuring distances and areas on the grid
 * @module grid/measurements
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SPACING, PIXELS_PER_METER } from '../gridConstants';
import { normalizePoint } from './typeUtils';

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
  const validPoint = normalizePoint(point);
  const validGridSize = gridSize > 0 ? gridSize : GRID_SPACING;
  
  // Calculate remainder when divided by grid size
  const remainderX = Math.abs(validPoint.x % validGridSize);
  const remainderY = Math.abs(validPoint.y % validGridSize);
  
  // Find shorter distance to grid line
  const distanceX = Math.min(
    remainderX,
    validGridSize - remainderX
  );
  
  const distanceY = Math.min(
    remainderY, 
    validGridSize - remainderY
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
  const validPoint1 = normalizePoint(point1);
  const validPoint2 = normalizePoint(point2);
  
  const dx = validPoint2.x - validPoint1.x;
  const dy = validPoint2.y - validPoint1.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert pixel distance to metric (meters)
 * 
 * @param {number} pixelDistance - Distance in pixels
 * @returns {number} Distance in meters
 */
export const pixelsToMeters = (pixelDistance: number): number => {
  const validPixelDistance = isNaN(pixelDistance) ? 0 : pixelDistance;
  const validPixelsPerMeter = PIXELS_PER_METER > 0 ? PIXELS_PER_METER : 100;
  
  return validPixelDistance / validPixelsPerMeter;
};

/**
 * Convert metric distance (meters) to pixels
 * 
 * @param {number} meterDistance - Distance in meters
 * @returns {number} Distance in pixels
 */
export const metersToPixels = (meterDistance: number): number => {
  const validMeterDistance = isNaN(meterDistance) ? 0 : meterDistance;
  const validPixelsPerMeter = PIXELS_PER_METER > 0 ? PIXELS_PER_METER : 100;
  
  return validMeterDistance * validPixelsPerMeter;
};

/**
 * Calculate area of a polygon in square meters
 * 
 * @param {Point[]} points - Array of polygon vertices
 * @returns {number} Area in square meters
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  // Validate all points and filter out invalid ones
  const validPoints = points.map(point => normalizePoint(point)).filter(point => 
    point.x !== undefined && point.y !== undefined
  );
  
  if (validPoints.length < 3) return 0;
  
  let area = 0;
  const n = validPoints.length;
  
  // Calculate area using Shoelace formula
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += validPoints[i].x * validPoints[j].y;
    area -= validPoints[j].x * validPoints[i].y;
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
  
  // Validate all points and filter out invalid ones
  const validPoints = points.map(point => normalizePoint(point)).filter(point => 
    point.x !== undefined && point.y !== undefined
  );
  
  if (validPoints.length < 2) return 0;
  
  let perimeter = 0;
  const n = validPoints.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    perimeter += calculateDistance(validPoints[i], validPoints[j]);
  }
  
  // Convert perimeter from pixels to meters
  return pixelsToMeters(perimeter);
};
