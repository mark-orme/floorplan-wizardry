
/**
 * Geometry Engine
 * Core geometric calculations
 */

import { Point } from '@/types/core/Point';

/**
 * Initialize the geometry engine
 * This would be used to load any dependencies or setup required
 */
export const initializeEngine = async (): Promise<void> => {
  // This is a placeholder for any setup that might be needed
  console.log('Geometry engine initialized');
};

/**
 * Calculate the area of a polygon
 * @param points Points defining the polygon
 * @returns Area in square units
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let total = 0;
  
  for (let i = 0, l = points.length; i < l; i++) {
    const addX = points[i].x;
    const addY = points[i === points.length - 1 ? 0 : i + 1].y;
    const subX = points[i === points.length - 1 ? 0 : i + 1].x;
    const subY = points[i].y;
    
    total += (addX * addY * 0.5);
    total -= (subX * subY * 0.5);
  }
  
  return Math.abs(total);
};

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in units
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Find the center point of a set of points
 * @param points Array of points
 * @returns Center point
 */
export const findCenter = (points: Point[]): Point => {
  if (points.length === 0) return { x: 0, y: 0 };
  
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  
  return {
    x: sum.x / points.length,
    y: sum.y / points.length
  };
};

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Array of points defining the polygon
 * @returns True if the point is inside the polygon
 */
export const isPointInsidePolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Calculate the intersection of two lines
 * @param line1 First line defined by two points
 * @param line2 Second line defined by two points
 * @returns Intersection point or null if no intersection
 */
export const calculateIntersection = (
  line1: { start: Point; end: Point },
  line2: { start: Point; end: Point }
): Point | null => {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;
  
  const denominator = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y));
  
  // Lines are parallel
  if (denominator === 0) {
    return null;
  }
  
  const ua = (((p4.x - p3.x) * (p1.y - p3.y)) - ((p4.y - p3.y) * (p1.x - p3.x))) / denominator;
  const ub = (((p2.x - p1.x) * (p1.y - p3.y)) - ((p2.y - p1.y) * (p1.x - p3.x))) / denominator;
  
  // Check if intersection is on both line segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }
  
  const x = p1.x + ua * (p2.x - p1.x);
  const y = p1.y + ua * (p2.y - p1.y);
  
  return { x, y };
};
