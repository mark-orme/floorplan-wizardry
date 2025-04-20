
import { Point } from '@/types/canvas';
import { calculateIntersection } from './calculations';

/**
 * Check if two line segments intersect
 */
export const linesIntersect = (
  line1Start: Point, 
  line1End: Point, 
  line2Start: Point, 
  line2End: Point
): boolean => {
  return calculateIntersection(line1Start, line1End, line2Start, line2End) !== null;
};

/**
 * Check if a point is inside a polygon
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const intersect = ((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
      (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Check for collision between two polygons
 */
export const polygonsIntersect = (polygon1: Point[], polygon2: Point[]): boolean => {
  // Check if any point from polygon1 is inside polygon2
  for (const point of polygon1) {
    if (isPointInPolygon(point, polygon2)) {
      return true;
    }
  }
  
  // Check if any point from polygon2 is inside polygon1
  for (const point of polygon2) {
    if (isPointInPolygon(point, polygon1)) {
      return true;
    }
  }
  
  // Check if any line segments intersect
  for (let i = 0; i < polygon1.length; i++) {
    const i2 = (i + 1) % polygon1.length;
    
    for (let j = 0; j < polygon2.length; j++) {
      const j2 = (j + 1) % polygon2.length;
      
      if (linesIntersect(polygon1[i], polygon1[i2], polygon2[j], polygon2[j2])) {
        return true;
      }
    }
  }
  
  return false;
};
