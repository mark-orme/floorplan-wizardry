
/**
 * Polygon operation utilities
 * @module utils/geometry/polygonOperations
 */
import { Point } from '@/types/geometryTypes';
import { AREA_PRECISION } from '@/constants/numerics';

/**
 * Calculate the area of a polygon
 * @param points Points defining the polygon
 * @returns Area of the polygon in square units
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  
  // Calculate area using the Shoelace formula (Gauss's area formula)
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take the absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  // Round to specified precision
  return Number(area.toFixed(AREA_PRECISION));
};

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Points defining the polygon
 * @returns True if the point is inside the polygon
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Get the centroid of a polygon
 * @param points Points defining the polygon
 * @returns Centroid point
 */
export const getPolygonCentroid = (points: Point[]): Point => {
  if (points.length < 3) return { x: 0, y: 0 };
  
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
 * Calculate the perimeter of a polygon
 * @param points Points defining the polygon
 * @returns Perimeter length
 */
export const calculatePolygonPerimeter = (points: Point[]): number => {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
};
