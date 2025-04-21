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
