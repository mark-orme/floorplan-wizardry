
import { Point } from "@/types/core/Point";

/**
 * Create a new Point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

/**
 * Check if two points are equal
 * @param p1 - First point
 * @param p2 - Second point
 * @returns True if points are equal
 */
export const arePointsEqual = (p1: Point, p2: Point): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};

/**
 * Clone a point
 * @param point - Point to clone
 * @returns Cloned point
 */
export const clonePoint = (point: Point): Point => {
  return { x: point.x, y: point.y };
};
