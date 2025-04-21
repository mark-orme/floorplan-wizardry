
/**
 * Area calculation utilities module
 * Functions for calculating areas of shapes
 * @module geometry/areaCalculations
 */
import { Point } from '@/types/drawingTypes';
import { AREA_PRECISION } from './constants';

/**
 * Calculate the area of a polygon using the Shoelace formula
 * @param {Point[]} points - Array of points forming the polygon
 * @returns {number} Area of the polygon in square units
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  // Apply Shoelace formula (also known as the surveyor's formula)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  return area;
};

/**
 * Format an area value for display with appropriate units
 * @param {number} area - Area value in square meters
 * @param {boolean} includeUnits - Whether to include units in the result
 * @returns {string} Formatted area string
 */
export const formatArea = (area: number, includeUnits: boolean = true): string => {
  if (!area || isNaN(area)) return includeUnits ? "0 m²" : "0";
  
  // Round to specified precision
  const roundedArea = Number(area.toFixed(AREA_PRECISION));
  
  // Format with or without units
  return includeUnits 
    ? `${roundedArea} m²` 
    : roundedArea.toString();
};

/**
 * Check if a polygon is convex
 * Used to validate shapes for area calculations
 * @param {Point[]} points - Array of points forming the polygon
 * @returns {boolean} Whether the polygon is convex
 */
export const isConvexPolygon = (points: Point[]): boolean => {
  if (!points || points.length < 3) return false;
  
  const n = points.length;
  let sign = 0;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const k = (i + 2) % n;
    
    // Calculate cross product to determine convexity
    const crossProduct = 
      (points[j].x - points[i].x) * (points[k].y - points[j].y) -
      (points[j].y - points[i].y) * (points[k].x - points[j].x);
    
    // Determine sign of first non-zero cross product
    if (crossProduct !== 0) {
      if (sign === 0) {
        sign = crossProduct > 0 ? 1 : -1;
      } else if ((crossProduct > 0 && sign < 0) || (crossProduct < 0 && sign > 0)) {
        // If signs don't match, polygon is not convex
        return false;
      }
    }
  }
  
  return true;
};
