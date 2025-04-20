
import { Point, Line } from './types';

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the area of a polygon defined by an array of points
 * @param points Array of polygon vertices
 * @returns Area of the polygon
 */
export const calculateArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area / 2);
};

/**
 * Calculate the intersection point between two lines
 * @param l1 First line
 * @param l2 Second line
 * @returns Intersection point or null if lines are parallel
 */
export const calculateIntersection = (l1: Line, l2: Line): Point | null => {
  const a1 = l1.end.y - l1.start.y;
  const b1 = l1.start.x - l1.end.x;
  const c1 = a1 * l1.start.x + b1 * l1.start.y;

  const a2 = l2.end.y - l2.start.y;
  const b2 = l2.start.x - l2.end.x;
  const c2 = a2 * l2.start.x + b2 * l2.start.y;

  const det = a1 * b2 - a2 * b1;
  
  if (Math.abs(det) < 0.001) {
    // Lines are parallel
    return null;
  }
  
  const x = (b2 * c1 - b1 * c2) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  
  return { x, y };
};
