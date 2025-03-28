
/**
 * Area calculation utilities
 * @module geometry/areaCalculation
 */
import { Point } from '@/types';
import { PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Calculate the area of a polygon
 * Uses the Shoelace formula (Gauss's area formula)
 * 
 * @param {Point[]} points - Array of points forming the polygon
 * @returns {number} Area in square pixels
 */
export const calculateArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take the absolute value and divide by 2
  return Math.abs(area) / 2;
};

/**
 * Calculate Gross Internal Area from a polygon
 * Converts pixel area to square meters
 * 
 * @param {Point[]} points - Array of points forming the polygon
 * @returns {number} Area in square meters
 */
export const calculateGIA = (points: Point[]): number => {
  const pixelArea = calculateArea(points);
  return pixelArea / (PIXELS_PER_METER * PIXELS_PER_METER);
};
