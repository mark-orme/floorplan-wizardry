
import { Point } from '@/types/core/Point';

/**
 * Calculate the distance between two points
 * 
 * @param p1 The first point
 * @param p2 The second point
 * @returns The calculated distance
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in degrees
 * 
 * @param p1 The first point
 * @param p2 The second point
 * @returns The calculated angle in degrees (0-360)
 */
export function calculateAngle(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Normalize angle to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
}

/**
 * Snap a point to the nearest angle based on constraints
 * 
 * @param startPoint The starting point of the line
 * @param endPoint The end point to snap
 * @param angleStep The angle step to snap to (e.g., 45 for 45-degree increments)
 * @returns The snapped end point
 */
export function snapToAngle(startPoint: Point, endPoint: Point, angleStep: number = 45): Point {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap to the nearest angle
  const snapAngle = Math.round(angle / (angleStep * Math.PI / 180)) * (angleStep * Math.PI / 180);
  
  return {
    x: startPoint.x + distance * Math.cos(snapAngle),
    y: startPoint.y + distance * Math.sin(snapAngle)
  };
}

/**
 * Snap a point to the nearest grid cell
 * 
 * @param point The point to snap
 * @param gridSize The size of the grid cells
 * @returns The snapped point
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Check if a point is near another point within a certain threshold
 * 
 * @param p1 The first point
 * @param p2 The second point
 * @param threshold The distance threshold
 * @returns True if points are within threshold distance
 */
export function isPointNear(p1: Point, p2: Point, threshold: number = 5): boolean {
  const distance = calculateDistance(p1, p2);
  return distance <= threshold;
}

/**
 * Format a distance value with appropriate units
 * 
 * @param distance The distance value
 * @param unit The unit of measurement
 * @param precision The number of decimal places
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, unit: string = 'px', precision: number = 1): string {
  return `${distance.toFixed(precision)} ${unit}`;
}

/**
 * Format an angle value with appropriate units
 * 
 * @param angle The angle value in degrees
 * @param precision The number of decimal places
 * @returns Formatted angle string
 */
export function formatAngle(angle: number, precision: number = 0): string {
  return `${angle.toFixed(precision)}°`;
}

/**
 * Find the midpoint between two points
 */
export function findMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Calculate the bounding box of a line
 */
export function calculateLineBoundingBox(p1: Point, p2: Point): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const left = Math.min(p1.x, p2.x);
  const top = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x);
  const height = Math.abs(p2.y - p1.y);
  
  return { left, top, width, height };
}
