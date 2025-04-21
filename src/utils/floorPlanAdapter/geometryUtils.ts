
/**
 * Geometry utilities for floor plan calculations
 * @module utils/floorPlanAdapter/geometryUtils
 */
import { Point } from '@/types/floor-plan/unifiedTypes';

/**
 * Calculate the area of a polygon
 * @param vertices Array of vertices
 * @returns Area of the polygon
 */
export function calculateArea(vertices: Point[]): number {
  if (vertices.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Calculate the perimeter of a polygon
 * @param vertices Array of vertices
 * @returns Perimeter of the polygon
 */
export function calculatePerimeter(vertices: Point[]): number {
  if (vertices.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const dx = vertices[j].x - vertices[i].x;
    const dy = vertices[j].y - vertices[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return perimeter;
}

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param vertices Polygon vertices
 * @returns Whether the point is inside the polygon
 */
export function isPointInPolygon(point: Point, vertices: Point[]): boolean {
  if (vertices.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const intersect = ((vertices[i].y > point.y) !== (vertices[j].y > point.y)) &&
      (point.x < (vertices[j].x - vertices[i].x) * (point.y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}
