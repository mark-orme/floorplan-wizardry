
import { Point } from '@/types/canvas';

/**
 * Calculate distance between two points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate area of a polygon defined by array of points
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
 * Calculate intersection point of two line segments
 */
export const calculateIntersection = (
  line1Start: Point, 
  line1End: Point, 
  line2Start: Point, 
  line2End: Point
): Point | null => {
  // Line 1 represented as a1x + b1y = c1
  const a1 = line1End.y - line1Start.y;
  const b1 = line1Start.x - line1End.x;
  const c1 = a1 * line1Start.x + b1 * line1Start.y;

  // Line 2 represented as a2x + b2y = c2
  const a2 = line2End.y - line2Start.y;
  const b2 = line2Start.x - line2End.x;
  const c2 = a2 * line2Start.x + b2 * line2Start.y;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    // Lines are parallel
    return null;
  }

  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  // Check if intersection point is on both line segments
  const onLine1 = isPointOnLineSegment(line1Start, line1End, { x, y });
  const onLine2 = isPointOnLineSegment(line2Start, line2End, { x, y });

  if (onLine1 && onLine2) {
    return { x, y };
  }

  return null;
};

/**
 * Check if a point is on a line segment
 */
const isPointOnLineSegment = (lineStart: Point, lineEnd: Point, point: Point): boolean => {
  const d1 = calculateDistance(point, lineStart);
  const d2 = calculateDistance(point, lineEnd);
  const lineLen = calculateDistance(lineStart, lineEnd);
  
  // Allow for floating point errors
  const buffer = 0.1;
  return Math.abs(d1 + d2 - lineLen) < buffer;
};
