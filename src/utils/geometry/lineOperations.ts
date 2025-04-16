
import { Point } from '@/types/core/Point';

/**
 * Calculate distance between two points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate angle between two points in degrees
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians
  const angleRad = Math.atan2(dy, dx);
  
  // Convert to degrees and normalize to 0-360
  let angleDeg = angleRad * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angleDeg < 0) {
    angleDeg += 360;
  }
  
  return angleDeg;
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(2)}px`;
};

/**
 * Check if a value is an exact multiple of grid size
 */
export const isExactGridMultiple = (value: number, gridSize: number = 20): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Check if a line or point is aligned with the grid
 */
export const isLineAlignedWithGrid = (pointOrLine: Point | { start: Point; end: Point }, gridSize: number = 20): boolean => {
  if ('start' in pointOrLine && 'end' in pointOrLine) {
    // It's a line, check both endpoints
    return isExactGridMultiple(pointOrLine.start.x, gridSize) && 
           isExactGridMultiple(pointOrLine.start.y, gridSize) &&
           isExactGridMultiple(pointOrLine.end.x, gridSize) && 
           isExactGridMultiple(pointOrLine.end.y, gridSize);
  } else {
    // It's a point
    return isExactGridMultiple(pointOrLine.x, gridSize) && 
           isExactGridMultiple(pointOrLine.y, gridSize);
  }
};

/**
 * Snap a point to the nearest grid point
 */
export const snapToGrid = (point: Point, gridSize: number = 20): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line's endpoints to the grid
 */
export const snapLineToGrid = (line: { start: Point; end: Point }, gridSize: number = 20): { start: Point; end: Point } => {
  return {
    start: snapToGrid(line.start, gridSize),
    end: snapToGrid(line.end, gridSize)
  };
};

/**
 * Get point at a specific distance and angle from start point
 */
export const getPointFromDistanceAndAngle = (
  startPoint: Point, 
  distance: number, 
  angleInDegrees: number
): Point => {
  // Convert angle to radians
  const angleRad = angleInDegrees * (Math.PI / 180);
  
  // Calculate new point
  return {
    x: startPoint.x + distance * Math.cos(angleRad),
    y: startPoint.y + distance * Math.sin(angleRad)
  };
};

/**
 * Check if a point is close to a line
 */
export const isPointNearLine = (
  point: Point, 
  lineStart: Point, 
  lineEnd: Point, 
  threshold = 5
): boolean => {
  // Calculate line length
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  // If line has no length, just check distance to either point
  if (lineLength === 0) {
    return calculateDistance(point, lineStart) <= threshold;
  }
  
  // Calculate normalized projection of point onto line
  const t = (
    (point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
    (point.y - lineStart.y) * (lineEnd.y - lineStart.y)
  ) / (lineLength * lineLength);
  
  // If projection is outside line segment, use distance to closest endpoint
  if (t < 0) {
    return calculateDistance(point, lineStart) <= threshold;
  }
  if (t > 1) {
    return calculateDistance(point, lineEnd) <= threshold;
  }
  
  // Calculate projection point on line
  const projectionPoint = {
    x: lineStart.x + t * (lineEnd.x - lineStart.x),
    y: lineStart.y + t * (lineEnd.y - lineStart.y)
  };
  
  // Calculate distance to projection point
  return calculateDistance(point, projectionPoint) <= threshold;
};

/**
 * Find intersection point of two lines
 */
export const findLineIntersection = (
  line1Start: Point, 
  line1End: Point, 
  line2Start: Point, 
  line2End: Point
): Point | null => {
  // Line 1 equation: (y1 - y2)x + (x2 - x1)y + (x1y2 - x2y1) = 0
  const a1 = line1Start.y - line1End.y;
  const b1 = line1End.x - line1Start.x;
  const c1 = line1Start.x * line1End.y - line1End.x * line1Start.y;
  
  // Line 2 equation: (y3 - y4)x + (x4 - x3)y + (x3y4 - x4y3) = 0
  const a2 = line2Start.y - line2End.y;
  const b2 = line2End.x - line2Start.x;
  const c2 = line2Start.x * line2End.y - line2End.x * line2Start.y;
  
  // Calculate determinant
  const det = a1 * b2 - a2 * b1;
  
  // If lines are parallel, no intersection
  if (Math.abs(det) < 0.001) {
    return null;
  }
  
  // Calculate intersection point
  const x = (b1 * c2 - b2 * c1) / det;
  const y = (a2 * c1 - a1 * c2) / det;
  
  return { x, y };
};
