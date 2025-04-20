
import { Point, Line } from './types';

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Array of polygon vertices
 * @returns True if point is inside the polygon
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
 * Check if two line segments intersect
 * @param a First line segment start point
 * @param b First line segment end point
 * @param c Second line segment start point
 * @param d Second line segment end point
 * @returns True if the line segments intersect
 */
export const doLinesIntersect = (a: Point, b: Point, c: Point, d: Point): boolean => {
  // Calculate line orientations
  const o1 = getOrientation(a, b, c);
  const o2 = getOrientation(a, b, d);
  const o3 = getOrientation(c, d, a);
  const o4 = getOrientation(c, d, b);
  
  // General case
  if (o1 !== o2 && o3 !== o4) return true;
  
  // Special cases
  if (o1 === 0 && isPointOnSegment(a, c, b)) return true;
  if (o2 === 0 && isPointOnSegment(a, d, b)) return true;
  if (o3 === 0 && isPointOnSegment(c, a, d)) return true;
  if (o4 === 0 && isPointOnSegment(c, b, d)) return true;
  
  return false;
};

/**
 * Get the orientation of three points
 * @param p Point 1
 * @param q Point 2
 * @param r Point 3
 * @returns 0 for collinear, 1 for clockwise, 2 for counterclockwise
 */
const getOrientation = (p: Point, q: Point, r: Point): number => {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0;  // collinear
  return (val > 0) ? 1 : 2; // clockwise or counterclockwise
};

/**
 * Check if a point is on a line segment
 * @param p Start point of line segment
 * @param q Point to check
 * @param r End point of line segment
 * @returns True if q is on line segment p-r
 */
const isPointOnSegment = (p: Point, q: Point, r: Point): boolean => {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
};

/**
 * Check if a rectangle contains a point
 * @param rect Rectangle defined by top-left and bottom-right corners
 * @param point Point to check
 * @returns True if the rectangle contains the point
 */
export const rectangleContainsPoint = (
  rect: { topLeft: Point; bottomRight: Point },
  point: Point
): boolean => {
  return point.x >= rect.topLeft.x && point.x <= rect.bottomRight.x &&
         point.y >= rect.topLeft.y && point.y <= rect.bottomRight.y;
};
