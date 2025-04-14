
import { Point } from '@/types/core/Point';
import { calculatePolygonArea } from '@/utils/areaCalculation';
import { PIXELS_PER_METER, AREA_PRECISION } from '@/constants/numerics';

/**
 * Calculate the centroid of a polygon
 * @param points Array of points forming the polygon
 * @returns Centroid point
 */
export const calculateCentroid = (points: Point[]): Point => {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0;
  let sumY = 0;
  
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
};

/**
 * Format area with appropriate units
 * @param areaInPixels Area in square pixels
 * @returns Formatted area string
 */
export const formatAreaWithUnits = (areaInPixels: number): string => {
  // Convert from pixels to square meters
  const areaInSquareMeters = areaInPixels / (PIXELS_PER_METER * PIXELS_PER_METER);
  
  // Round to specified precision
  return `${areaInSquareMeters.toFixed(AREA_PRECISION)} m²`;
};

/**
 * Check if a polygon is clockwise
 * @param points Array of points forming the polygon
 * @returns True if clockwise, false if counterclockwise
 */
export const isPolygonClockwise = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    sum += (p2.x - p1.x) * (p2.y + p1.y);
  }
  
  return sum > 0;
};
