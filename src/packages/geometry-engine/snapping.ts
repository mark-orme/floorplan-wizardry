
/**
 * Snapping utility functions for geometry
 * @module geometry-engine/snapping
 */
import { Point } from './types';
import { calculateDistance } from './core';

/**
 * Snap a point to the nearest grid point
 * @param point The point to snap
 * @param gridSize Grid cell size
 * @returns Snapped point
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Check if a point is within snapping distance of another point
 * @param p1 First point
 * @param p2 Second point
 * @param distance Maximum snapping distance
 * @returns True if points are within snapping distance
 */
export function isWithinSnappingDistance(p1: Point, p2: Point, distance: number): boolean {
  return calculateDistance(p1, p2) <= distance;
}

/**
 * Snap a point to the nearest point in a collection if within distance
 * @param point The point to snap
 * @param points Collection of points to snap to
 * @param distance Maximum snapping distance
 * @returns Snapped point or original point if no snap
 */
export function snapToPoints(point: Point, points: Point[], distance: number): Point {
  let minDist = distance;
  let closestPoint = point;
  
  for (const p of points) {
    const dist = calculateDistance(point, p);
    if (dist < minDist) {
      minDist = dist;
      closestPoint = p;
    }
  }
  
  return closestPoint;
}
