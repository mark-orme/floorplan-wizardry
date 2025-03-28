
/**
 * Area calculation utilities
 * @module utils/areaCalculation
 */
import { Point } from '@/types/geometryTypes';
import { AREA_PRECISION } from '@/constants/numerics';

/**
 * Calculate total area in pixels for an array of polygons
 * Uses the shoelace formula to calculate polygon areas
 * 
 * @param polygons - Array of polygon point arrays
 * @returns Total area in square pixels
 */
export const calculateTotalAreaInPixels = (polygons: Point[][]): number => {
  if (!polygons || polygons.length === 0) return 0;
  
  let totalArea = 0;
  
  // Process each polygon
  for (const polygon of polygons) {
    if (polygon.length < 3) continue; // Need at least 3 points for a polygon
    
    // Calculate area using the Shoelace formula (Gauss's area formula)
    let area = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    
    // Take the absolute value and divide by 2
    area = Math.abs(area) / 2;
    totalArea += area;
  }
  
  // Round to specified precision
  return Number(totalArea.toFixed(AREA_PRECISION));
};

/**
 * Calculate area of a single polygon
 * 
 * @param points - Array of points defining the polygon
 * @returns Area in square pixels
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  
  // Calculate area using the Shoelace formula
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take the absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  return Number(area.toFixed(AREA_PRECISION));
};
