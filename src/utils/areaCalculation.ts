
/**
 * Area calculation utilities
 * @module utils/areaCalculation
 */

import { Point } from '@/types/geometryTypes';
import { PIXELS_PER_METER, AREA_PRECISION } from '@/constants/numerics';

/**
 * Calculate area of a polygon using the Shoelace formula (Gauss's area formula)
 * @param points Array of points defining the polygon
 * @returns Area of the polygon in square pixels
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
};

/**
 * Convert area from square pixels to square meters
 * @param areaInPixels Area in square pixels
 * @returns Area in square meters
 */
export const pixelsToSquareMeters = (areaInPixels: number): number => {
  const conversionFactor = PIXELS_PER_METER * PIXELS_PER_METER;
  const areaInMeters = areaInPixels / conversionFactor;
  
  // Round to specified precision
  const roundFactor = Math.pow(10, AREA_PRECISION || 2);
  return Math.round(areaInMeters * roundFactor) / roundFactor;
};

/**
 * Calculate area of a polygon in square meters
 * @param points Array of points defining the polygon
 * @returns Area in square meters
 */
export const calculateAreaInSquareMeters = (points: Point[]): number => {
  const areaInPixels = calculatePolygonArea(points);
  return pixelsToSquareMeters(areaInPixels);
};

/**
 * Format area for display with units
 * @param area Area in square meters
 * @returns Formatted area string
 */
export const formatArea = (area: number): string => {
  return `${area.toFixed(AREA_PRECISION || 2)} m²`;
};
