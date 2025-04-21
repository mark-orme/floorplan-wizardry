
/**
 * Measurement Service
 * Provides utilities for measuring distances and areas in floorplans
 */
import { Point } from '@/types/core/Geometry';
import { calculateDistance, calculatePolygonArea } from '@/utils/geometry/engine';

/**
 * Calculate distance between two points in the floorplan
 * @param start Start point
 * @param end End point
 * @param scale Scale factor (pixels per unit)
 * @returns Distance in real-world units
 */
export function measureDistance(start: Point, end: Point, scale: number = 1): number {
  const pixelDistance = calculateDistance(start, end);
  return pixelDistance / scale;
}

/**
 * Calculate area of a polygon in the floorplan
 * @param points Polygon points
 * @param scale Scale factor (pixels per unit)
 * @returns Area in square units
 */
export function measureArea(points: Point[], scale: number = 1): number {
  const pixelArea = calculatePolygonArea(points);
  return pixelArea / (scale * scale);
}

/**
 * Convert pixel measurements to real-world units
 * @param value Pixel value
 * @param scale Scale factor (pixels per unit)
 * @param unit Unit name (e.g., 'm', 'ft')
 * @returns Formatted measurement with units
 */
export function formatMeasurement(value: number, scale: number = 1, unit: string = 'm'): string {
  const realValue = value / scale;
  return `${realValue.toFixed(2)} ${unit}`;
}

/**
 * Calculate the length of a path
 * @param points Path points
 * @param scale Scale factor (pixels per unit)
 * @returns Path length in real-world units
 */
export function calculatePathLength(points: Point[], scale: number = 1): number {
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) {
    length += calculateDistance(points[i], points[i + 1]);
  }
  return length / scale;
}
