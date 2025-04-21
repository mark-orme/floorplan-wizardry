/**
 * Geometry Engine
 * Core geometry calculation functions
 * @module utils/geometry/engine
 */

import { Point } from '@/types/core/Geometry';
import {fabric} from 'fabric';

/**
 * Calculate the area of a polygon
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
};

/**
 * Calculate the Geographic Information Area (GIA) of a polygon
 * @param points Array of points defining the polygon
 * @returns GIA of the polygon
 */
export const calculateGIA = (points: Point[]): number => {
  return calculatePolygonArea(points);
};

/**
 * Rotate a point around a center
 * @param point Point to rotate
 * @param center Center of rotation
 * @param angle Angle in radians
 * @returns Rotated point
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = cos * (point.x - center.x) - sin * (point.y - center.y) + center.x;
  const y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y;
  return { x, y };
};

/**
 * Translate a point by an offset
 * @param point Point to translate
 * @param offset Offset to apply
 * @returns Translated point
 */
export const translatePoint = (point: Point, offset: Point): Point => {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y
  };
};

/**
 * Scale a point relative to an origin
 * @param point Point to scale
 * @param origin Origin of scaling
 * @param scaleX X scaling factor
 * @param scaleY Y scaling factor
 * @returns Scaled point
 */
export const scalePoint = (point: Point, origin: Point, scaleX: number, scaleY: number): Point => {
  const x = origin.x + (point.x - origin.x) * scaleX;
  const y = origin.y + (point.y - origin.y) * scaleY;
  return { x, y };
};

/**
 * Validate if a polygon is valid (has at least 3 points)
 * @param points Array of points defining the polygon
 * @returns True if the polygon is valid
 */
export const validatePolygon = (points: Point[]): boolean => {
  return points && points.length >= 3;
};

/**
 * Check if a polygon is closed (first and last points are the same)
 * @param points Array of points defining the polygon
 * @returns True if the polygon is closed
 */
export const isPolygonClosed = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y;
};

/**
 * Get the bounding box of a set of points
 * @param points Array of points
 * @returns Bounding box as { minX, minY, maxX, maxY }
 */
export const getBoundingBox = (points: Point[]) => {
  if (!points || points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return { minX, minY, maxX, maxY };
};

/**
 * Get the midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint as { x, y }
 */
export const getMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Convert pixels to meters based on a conversion factor
 * @param pixels Pixel value
 * @param pixelsPerMeter Conversion factor
 * @returns Meter value
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Convert meters to pixels based on a conversion factor
 * @param meters Meter value
 * @param pixelsPerMeter Conversion factor
 * @returns Pixel value
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number): number => {
  return meters * pixelsPerMeter;
};

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * @param points Array of points defining the path
 * @param tolerance Tolerance for simplification
 * @returns Simplified array of points
 */
export const simplifyPath = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate distance between curr and line from prev to next
    const d = perpendicularDistance(curr, prev, next);
    
    if (d > tolerance) {
      result.push(curr);
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
};

/**
 * Smooth a path using Bezier curves
 * @param points Array of points defining the path
 * @param sharpness Sharpness factor
 * @returns Smoothed path as an array of points
 */
export const smoothPath = (points: Point[], sharpness: number = 0.5): Point[] => {
  if (points.length < 3) return points;
  
  const smoothedPoints: Point[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const controlPoint = {
      x: p1.x + (p2.x - p1.x) * sharpness,
      y: p1.y + (p2.y - p1.y) * sharpness
    };
    
    smoothedPoints.push(p1);
    smoothedPoints.push(controlPoint);
  }
  
  smoothedPoints.push(points[points.length - 1]);
  
  return smoothedPoints;
};

/**
 * Calculate the distance between two points
 * @param start Starting point
 * @param end Ending point
 * @returns Distance between the points
 */
export const calculateDistance = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Format a distance in meters to a human-readable string
 * @param distance Distance in meters
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 100).toFixed(2)} cm`;
  } else if (distance < 1000) {
    return `${distance.toFixed(2)} m`;
  } else {
    return `${(distance / 1000).toFixed(2)} km`;
  }
};

/**
 * Check if a number is an exact multiple of another number
 * @param num Number to check
 * @param multiple Multiple to check against
 * @returns True if the number is an exact multiple
 */
export const isExactGridMultiple = (num: number, multiple: number): boolean => {
  return num % multiple === 0;
};

/**
 * Calculate the midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint as { x, y }
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Calculate the angle between two points in radians
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in radians
 */
export const calculateAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Get the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export const getDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Format a distance for display purposes
 * @param distance Distance in meters
 * @returns Formatted distance string
 */
export const formatDisplayDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 100).toFixed(0)} cm`;
  } else {
    return `${distance.toFixed(1)} m`;
  }
};

// Export snapPointsToGrid if not already exported
export { snapPointsToGrid } from "@/packages/geometry-engine/snapping";
// Export perpendicularDistance (assuming it's in this file)
export function perpendicularDistance(point: { x: number; y: number }, lineStart: { x: number; y: number }, lineEnd: { x: number; y: number }): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  const lineLengthSquared = dx * dx + dy * dy;
  if (lineLengthSquared === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) +
      Math.pow(point.y - lineStart.y, 2)
    );
  }

  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) / lineLengthSquared;

  let projX, projY;
  if (t < 0) {
    projX = lineStart.x;
    projY = lineStart.y;
  } else if (t > 1) {
    projX = lineEnd.x;
    projY = lineEnd.y;
  } else {
    projX = lineStart.x + t * dx;
    projY = lineStart.y + t * dy;
  }

  return Math.sqrt(
    Math.pow(point.x - projX, 2) +
    Math.pow(point.y - projY, 2)
  );
}
