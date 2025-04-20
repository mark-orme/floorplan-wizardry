
/**
 * Advanced geometry calculations
 * @module geometry-engine/calculations
 */
import { Point, Polygon, Line, Circle } from './types';
import { calculateDistance, calculatePolygonArea, perpendicularDistance } from './core';

/**
 * Calculate the perimeter of a polygon
 * @param points Points defining the polygon
 * @returns Perimeter length
 */
export function calculatePerimeter(points: Point[]): number {
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length]; // Loop back to first point
    perimeter += calculateDistance(p1, p2);
  }
  
  return perimeter;
}

/**
 * Calculate the centroid (geometric center) of a polygon
 * @param points Points defining the polygon
 * @returns Centroid point
 */
export function calculateCentroid(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  
  // For a simple polygon, we can use the arithmetic mean for the centroid
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
}

/**
 * Calculate the angle between two lines in degrees
 * @param line1 First line
 * @param line2 Second line
 * @returns Angle in degrees
 */
export function calculateAngleBetweenLines(line1: Line, line2: Line): number {
  // Calculate direction vectors
  const vector1 = {
    x: line1.end.x - line1.start.x,
    y: line1.end.y - line1.start.y
  };
  
  const vector2 = {
    x: line2.end.x - line2.start.x,
    y: line2.end.y - line2.start.y
  };
  
  // Calculate dot product
  const dot = vector1.x * vector2.x + vector1.y * vector2.y;
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
  // Calculate angle in radians
  const cosAngle = dot / (mag1 * mag2);
  
  // Convert to degrees
  let angle = Math.acos(Math.min(Math.max(cosAngle, -1), 1)) * (180 / Math.PI);
  
  return angle;
}

/**
 * Optimize a points array by removing unnecessary points
 * Uses Ramer-Douglas-Peucker algorithm
 * @param points Array of points to optimize
 * @param tolerance Distance tolerance for point removal
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return [...points];
  
  // Implementation of Ramer-Douglas-Peucker algorithm
  const rdp = (pointList: Point[], epsilon: number): Point[] => {
    // Find the point with the maximum distance
    let maxDistance = 0;
    let index = 0;
    const end = pointList.length - 1;
    
    for (let i = 1; i < end; i++) {
      const distance = perpendicularDistance(
        pointList[i], 
        pointList[0], 
        pointList[end]
      );
      
      if (distance > maxDistance) {
        index = i;
        maxDistance = distance;
      }
    }
    
    // If max distance is greater than epsilon, recursively simplify
    if (maxDistance > epsilon) {
      const firstHalf = rdp(pointList.slice(0, index + 1), epsilon);
      const secondHalf = rdp(pointList.slice(index), epsilon);
      
      // Concat the two parts and remove duplicate point
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Just return first and last point
      return [pointList[0], pointList[end]];
    }
  };
  
  return rdp(points, tolerance);
}

/**
 * Calculate the area of a polygon in square meters
 * @param points Array of points defining the polygon
 * @param pixelsPerMeter Conversion factor from pixels to meters
 * @returns Area in square meters
 */
export function calculateAreaInSquareMeters(
  points: Point[],
  pixelsPerMeter: number = 100
): number {
  // Calculate area in pixels
  const areaInPixels = calculatePolygonArea(points);
  
  // Convert to square meters
  const areaInSquareMeters = areaInPixels / (pixelsPerMeter * pixelsPerMeter);
  
  // Round to 2 decimal places
  return Math.round(areaInSquareMeters * 100) / 100;
}

/**
 * Calculate the circumference of a circle
 * @param circle Circle object
 * @returns Circumference
 */
export function calculateCircumference(circle: Circle): number {
  return 2 * Math.PI * circle.radius;
}

/**
 * Calculate the area of a circle
 * @param circle Circle object
 * @returns Area
 */
export function calculateCircleArea(circle: Circle): number {
  return Math.PI * circle.radius * circle.radius;
}
