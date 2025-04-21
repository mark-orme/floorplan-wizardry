
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
 * Calculate the midpoint between two points
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate the angle between two points (in degrees)
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;
  let theta = Math.atan2(dy, dx) * 180 / Math.PI;
  
  if (theta < 0) {
    theta += 360;
  }
  
  return theta;
};

/**
 * Alias for calculateDistance
 */
export const getDistance = calculateDistance;

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
 * Get the alias for center point
 */
export const getMidpoint = findCenter;

/**
 * Rotate a point around a center
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  // Translate point to origin
  const x = point.x - center.x;
  const y = point.y - center.y;
  
  // Rotate point
  const rotatedX = x * cos - y * sin;
  const rotatedY = x * sin + y * cos;
  
  // Translate back
  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y
  };
};

/**
 * Translate a point by a specified amount
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
};

/**
 * Scale a point from a center
 */
export const scalePoint = (point: Point, center: Point, scale: number): Point => {
  return {
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale
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
 * Convert pixel measurements to meters
 * @param pixels Value in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number, scale: number): number => {
  return pixels / scale;
};

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param scale Scale factor (pixels per meter)
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number, scale: number): number => {
  return meters * scale;
};

/**
 * Format a distance value for display
 * @param distance Distance value in pixels
 * @param scale Scale factor (pixels per meter)
 * @param precision Decimal precision
 * @returns Formatted distance string (e.g., "2.50 m")
 */
export const formatDistance = (distance: number, scale: number, precision: number = 2): string => {
  const distanceInMeters = pixelsToMeters(distance, scale);
  return `${distanceInMeters.toFixed(precision)} m`;
};

/**
 * Format a display distance with appropriate units
 */
export const formatDisplayDistance = (distance: number, scale: number): string => {
  const meters = pixelsToMeters(distance, scale);
  
  if (meters < 0.01) {
    return `${(meters * 1000).toFixed(0)} mm`;
  } else if (meters < 1) {
    return `${(meters * 100).toFixed(0)} cm`;
  } else {
    return `${meters.toFixed(2)} m`;
  }
};

/**
 * Get the bounding box of a set of points
 */
export const getBoundingBox = (points: Point[]): { min: Point; max: Point } => {
  if (points.length === 0) {
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
 * Check if polygon is closed (last point equals first point)
 */
export const isPolygonClosed = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  const first = points[0];
  const last = points[points.length - 1];
  
  // Consider points equal if they're very close
  const epsilon = 0.0001;
  return (
    Math.abs(first.x - last.x) < epsilon &&
    Math.abs(first.y - last.y) < epsilon
  );
};

/**
 * Validate a polygon
 */
export const validatePolygon = (points: Point[]): boolean => {
  // Must have at least 3 points
  if (points.length < 3) return false;
  
  // Check for self-intersection (simplified check)
  // A complete check would implement proper line segment intersection tests
  const boundingBox = getBoundingBox(points);
  const area = calculatePolygonArea(points);
  
  // A polygon with very small area compared to its bounding box is likely malformed
  const boundingBoxArea = 
    (boundingBox.max.x - boundingBox.min.x) * 
    (boundingBox.max.y - boundingBox.min.y);
  
  if (area < boundingBoxArea * 0.01) return false;
  
  return true;
};

/**
 * Simplify a path using the Douglas-Peucker algorithm
 */
export const simplifyPath = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return [...points];
  
  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    // Recursive call
    const firstSegment = simplifyPath(points.slice(0, index + 1), tolerance);
    const secondSegment = simplifyPath(points.slice(index), tolerance);
    
    // Concat the two parts, removing the duplicate point
    return [...firstSegment.slice(0, -1), ...secondSegment];
  } else {
    // Return just the endpoints
    return [points[0], points[points.length - 1]];
  }
};

/**
 * Calculate perpendicular distance from a point to a line
 */
export const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return distance to that point
  if (dx === 0 && dy === 0) {
    return calculateDistance(point, lineStart);
  }
  
  // Calculate the perpendicular distance
  const norm = Math.sqrt(dx * dx + dy * dy);
  return Math.abs((point.y - lineStart.y) * dx - (point.x - lineStart.x) * dy) / norm;
};

/**
 * Smooth a path using Gaussian filter
 */
export const smoothPath = (points: Point[], sigma: number = 1, windowSize: number = 5): Point[] => {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [];
  const kernelSize = Math.max(3, Math.ceil(windowSize));
  const halfSize = Math.floor(kernelSize / 2);
  
  // Generate Gaussian kernel
  const kernel: number[] = [];
  let sum = 0;
  for (let i = 0; i < kernelSize; i++) {
    const x = i - halfSize;
    const weight = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel.push(weight);
    sum += weight;
  }
  
  // Normalize kernel
  for (let i = 0; i < kernelSize; i++) {
    kernel[i] /= sum;
  }
  
  // Apply kernel to each point
  for (let i = 0; i < points.length; i++) {
    let newX = 0;
    let newY = 0;
    
    for (let j = 0; j < kernelSize; j++) {
      const idx = Math.min(Math.max(0, i + j - halfSize), points.length - 1);
      newX += points[idx].x * kernel[j];
      newY += points[idx].y * kernel[j];
    }
    
    result.push({ x: newX, y: newY });
  }
  
  return result;
};

/**
 * Check if a point is at an exact grid multiple
 */
export const isExactGridMultiple = (value: number, gridSize: number): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Calculate Gross Internal Area (GIA) from a floor plan
 */
export const calculateGIA = (floorPolygons: Point[][]): number => {
  let totalArea = 0;
  
  for (const polygon of floorPolygons) {
    totalArea += calculatePolygonArea(polygon);
  }
  
  return totalArea;
};

/**
 * Optimize points by removing redundant ones
 */
export const optimizePoints = (points: Point[], tolerance: number = 1): Point[] => {
  return simplifyPath(points, tolerance);
};

/**
 * Snap points to a grid
 */
export const snapPointsToGrid = (points: Point[], gridSize: number): Point[] => {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
};
