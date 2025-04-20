import { Point } from '@/types/floor-plan/typesBarrel';

interface Line {
  start: Point;
  end: Point;
}

// Function to calculate the determinant of a matrix
const determinant = (p1: Point, p2: Point, p3: Point): number => {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
};

// Function to check if point r lies on line segment pq
const onSegment = (p: Point, q: Point, r: Point): boolean => {
  if (r.x <= Math.max(p.x, q.x) && r.x >= Math.min(p.x, q.x) &&
      r.y <= Math.max(p.y, q.y) && r.y >= Math.min(p.y, q.y))
     return true;

  return false;
}

// The main function to check whether line segments p1q1 and p2q2 intersect
const doIntersect = (p1: Point, q1: Point, p2: Point, q2: Point): boolean => {
  // Find the four orientations needed for general and
  // special cases
  const o1 = determinant(p1, q1, p2);
  const o2 = determinant(p1, q1, q2);
  const o3 = determinant(p2, q2, p1);
  const o4 = determinant(p2, q2, q1);

  // General case
  if (o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 * o2 < 0 && o3 * o4 < 0)
    return true;

  // Special Cases
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1
  if (o1 === 0 && onSegment(p1, q1, p2)) return true;

  // p1, q1 and q2 are colinear and q2 lies on segment p1q1
  if (o2 === 0 && onSegment(p1, q1, q2)) return true;

  // p2, q2 and p1 are colinear and p1 lies on segment p2q2
  if (o3 === 0 && onSegment(p2, q2, p1)) return true;

  // p2, q2 and q1 are colinear and q1 lies on segment p2q2
  if (o4 === 0 && onSegment(p2, q2, q1)) return true;

  return false; // Doesn't fall in any of the above cases
}

// Calculate intersection point
const calculateIntersectionPoint = (line1: Line, line2: Line): Point => {
  const x1 = line1.start.x;
  const y1 = line1.start.y;
  const x2 = line1.end.x;
  const y2 = line1.end.y;

  const x3 = line2.start.x;
  const y3 = line2.start.y;
  const x4 = line2.end.x;
  const y4 = line2.end.y;

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den === 0) {
    return null;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

  if (t > 0 && t < 1 && u > 0 && u < 1) {
    const x = x1 + t * (x2 - x1);
    const y = y1 + t * (y2 - y1);
    return { x, y };
  } else {
    return null;
  }
};

export const calculateIntersection = async (line1: Line, line2: Line): Promise<Point> => {
  const result = await calculateIntersectionPoint(line1, line2);
  return { x: result.x, y: result.y };
};

export const areLinesIntersecting = async (line1: Line, line2: Line): Promise<boolean> => {
  return doIntersect(line1.start, line1.end, line2.start, line2.end);
};
