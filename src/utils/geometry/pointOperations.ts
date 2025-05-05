
import { Point } from '@/types/core/Point';

/**
 * Snaps a point to the nearest grid point
 */
export function snapToGrid(point: Point, gridSize: number = 20): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snaps an angle to the nearest angle increment
 */
export function snapToAngle(start: Point, end: Point, angleIncrement: number = 45): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate current angle in radians
  const currentAngle = Math.atan2(dy, dx);
  
  // Convert increment to radians
  const incrementRad = angleIncrement * (Math.PI / 180);
  
  // Snap to nearest angle
  const snappedAngle = Math.round(currentAngle / incrementRad) * incrementRad;
  
  // Calculate distance
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate new end point
  return {
    x: start.x + Math.cos(snappedAngle) * distance,
    y: start.y + Math.sin(snappedAngle) * distance
  };
}

/**
 * Calculates the distance between two points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the angle between two points in degrees
 */
export function calculateAngle(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Calculates the midpoint between two points
 */
export function calculateMidPoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Rotates a point around an origin by a given angle (in degrees)
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  // Convert angle to radians
  const radians = angle * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  // Translate point to origin
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  
  // Rotate and translate back
  return {
    x: x * cos - y * sin + origin.x,
    y: x * sin + y * cos + origin.y
  };
}

/**
 * Creates a point at a given distance and angle from another point
 */
export function createPointFromDistanceAndAngle(origin: Point, distance: number, angle: number): Point {
  // Convert angle to radians
  const radians = angle * (Math.PI / 180);
  
  return {
    x: origin.x + distance * Math.cos(radians),
    y: origin.y + distance * Math.sin(radians)
  };
}
