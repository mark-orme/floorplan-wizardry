
/**
 * Area calculation service
 * Core domain logic for area calculations
 * @module packages/floorplan-core/services/areaService
 */

import { Point, Polygon } from '@/types/core/Geometry';
import { calculatePolygonArea, pixelsToMeters } from '@/utils/geometry/engine';

/**
 * Result of area calculation
 */
export interface AreaCalculationResult {
  /** Area in square meters */
  areaM2: number;
  /** Area in square feet */
  areaSqFt: number;
  /** Area in pixels (raw) */
  areaPixels: number;
}

/**
 * Calculate area for a polygon
 * @param points Polygon points
 * @param pixelsPerMeter Conversion factor (pixels per meter)
 * @returns Area calculation result
 */
export function calculateArea(points: Point[], pixelsPerMeter: number = 100): AreaCalculationResult {
  const areaPixels = calculatePolygonArea(points);
  const areaM2 = Math.pow(pixelsToMeters(1, pixelsPerMeter), 2) * areaPixels;
  const areaSqFt = areaM2 * 10.764; // Convert square meters to square feet
  
  return {
    areaM2,
    areaSqFt,
    areaPixels
  };
}

/**
 * Calculate combined area for multiple polygons
 * @param polygons Array of polygons
 * @param pixelsPerMeter Conversion factor (pixels per meter)
 * @returns Combined area calculation result
 */
export function calculateCombinedArea(
  polygons: Point[][], 
  pixelsPerMeter: number = 100
): AreaCalculationResult {
  let totalAreaPixels = 0;
  
  for (const polygon of polygons) {
    totalAreaPixels += calculatePolygonArea(polygon);
  }
  
  const areaM2 = Math.pow(pixelsToMeters(1, pixelsPerMeter), 2) * totalAreaPixels;
  const areaSqFt = areaM2 * 10.764;
  
  return {
    areaM2,
    areaSqFt,
    areaPixels: totalAreaPixels
  };
}
