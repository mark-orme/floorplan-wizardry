
/**
 * Geometry Engine
 * Provides utility functions for geometric calculations
 */

import { Point } from '@/types/core/Geometry';

/**
 * Calculate distance between two points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get distance between two points (alias for calculateDistance)
 */
export const getDistance = calculateDistance;

/**
 * Calculate area of a polygon using the Shoelace formula
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (!points || points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  
  return Math.abs(area) / 2;
};

/**
 * Calculate center point of a polygon
 */
export const findCenter = (points: Point[]): Point => {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  
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
 * Check if a point is inside a polygon
 */
export const isPointInsidePolygon = (point: Point, polygon: Point[]): boolean => {
  if (!polygon || polygon.length < 3) return false;
  
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
 * Scale a point from origin by x and y factors
 */
export const scalePoint = (point: Point, origin: Point, scaleX: number, scaleY: number): Point => {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
};

/**
 * Rotate a point around origin by angle (in radians)
 */
export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos
  };
};

/**
 * Validate if a polygon has valid geometry
 */
export const validatePolygon = (points: Point[]): boolean => {
  // A valid polygon needs at least 3 points
  if (!points || points.length < 3) return false;
  
  // Check that points aren't all collinear
  const area = calculatePolygonArea(points);
  if (area <= 0) return false;
  
  // Check for duplicate consecutive points
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    if (points[i].x === points[j].x && points[i].y === points[j].y) {
      return false;
    }
  }
  
  return true;
};

/**
 * Translate a point by dx and dy
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
};

/**
 * Check if a polygon is closed (first and last points are the same)
 */
export const isPolygonClosed = (points: Point[]): boolean => {
  if (!points || points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Check if first and last points are the same
  return first.x === last.x && first.y === last.y;
};

/**
 * Get the bounding box of a set of points
 */
export const getBoundingBox = (points: Point[]): { min: Point; max: Point } => {
  if (!points || points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }
  
  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
};

/**
 * Get the midpoint between two points
 */
export const getMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate midpoint (alias for getMidpoint)
 */
export const calculateMidpoint = getMidpoint;

/**
 * Convert pixels to meters based on a scale factor
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = 100): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert meters to pixels based on a scale factor
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number = 100): number => {
  return meters * pixelsPerMeter;
};

/**
 * Format a distance for display
 */
export const formatDistance = (distance: number, unit: 'mm' | 'cm' | 'm' = 'm'): string => {
  if (unit === 'm') {
    return `${distance.toFixed(2)} m`;
  } else if (unit === 'cm') {
    return `${(distance * 100).toFixed(0)} cm`;
  } else {
    return `${(distance * 1000).toFixed(0)} mm`;
  }
};

/**
 * Format distance for display with automatic unit selection
 */
export const formatDisplayDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 0.01) {
    // Less than 1 cm, use mm
    return formatDistance(distanceInMeters, 'mm');
  } else if (distanceInMeters < 1) {
    // Less than 1m, use cm
    return formatDistance(distanceInMeters, 'cm');
  } else {
    // Use meters
    return formatDistance(distanceInMeters, 'm');
  }
};

/**
 * Check if a value is an exact multiple of a grid size
 */
export const isExactGridMultiple = (value: number, gridSize: number = 20): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Calculate angle between two points in degrees
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Convert radians to degrees and normalize to 0-360
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  
  return angle;
};

/**
 * Simplify a path using the Douglas-Peucker algorithm
 */
export const simplifyPath = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const firstHalf = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondHalf = simplifyPath(points.slice(index), tolerance);
    
    // Concatenate the two parts, excluding duplicate point
    return [...firstHalf.slice(0, -1), ...secondHalf];
  } else {
    // Return just the first and last points
    return [firstPoint, lastPoint];
  }
};

/**
 * Calculate perpendicular distance from a point to a line segment
 */
export const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return the distance to that point
  if (dx === 0 && dy === 0) {
    return calculateDistance(point, lineStart);
  }
  
  // Calculate the squared length of the line segment
  const lineLengthSq = dx * dx + dy * dy;
  
  // Calculate the projection of point onto the line segment
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSq;
  
  // If the projection is outside the line segment, return the distance to the nearest endpoint
  if (t < 0) return calculateDistance(point, lineStart);
  if (t > 1) return calculateDistance(point, lineEnd);
  
  // Calculate the projected point on the line
  const projectedPoint = {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy
  };
  
  // Return the distance to the projected point
  return calculateDistance(point, projectedPoint);
};

/**
 * Snap a point to the nearest grid point
 */
export const snapPointsToGrid = (point: Point, gridSize: number = 20): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Apply a smooth curve to a path
 */
export const smoothPath = (points: Point[], tension: number = 0.5): Point[] => {
  if (points.length < 3) return [...points];
  
  const result: Point[] = [];
  
  // Add the first point
  result.push(points[0]);
  
  // Add the interior points
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
    
    // Generate the control points
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    // Add the interpolated points
    for (let t = 0; t <= 1; t += 0.1) {
      const t2 = t * t;
      const t3 = t2 * t;
      
      // Cubic Bezier curve formula
      const x = (2 * p1.x + (-p0.x + p2.x) * t + 
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3) * 0.5;
      
      const y = (2 * p1.y + (-p0.y + p2.y) * t + 
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) * 0.5;
      
      result.push({ x, y });
    }
  }
  
  // Add the last point
  result.push(points[points.length - 1]);
  
  return result;
};

/**
 * Optimize a set of points by removing redundant ones
 */
export const optimizePoints = (points: Point[], tolerance: number = 1): Point[] => {
  return simplifyPath(points, tolerance);
};

/**
 * Calculate the gross internal area (GIA)
 */
export const calculateGIA = (points: Point[]): number => {
  // Use polygon area calculation as the basis
  return calculatePolygonArea(points);
};
