
/**
 * Point operation utilities
 * @module utils/geometry/pointOperations
 */
import { Point } from '@/types/geometryTypes';

/**
 * Add two points
 * @param p1 First point
 * @param p2 Second point
 * @returns New point with coordinates added
 */
export const addPoints = (p1: Point, p2: Point): Point => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
});

/**
 * Subtract second point from first
 * @param p1 First point
 * @param p2 Second point to subtract
 * @returns New point with coordinates subtracted
 */
export const subtractPoints = (p1: Point, p2: Point): Point => ({
  x: p1.x - p2.x,
  y: p1.y - p2.y
});

/**
 * Multiply point coordinates by scalar
 * @param p Point
 * @param scalar Scalar value
 * @returns New point with coordinates multiplied
 */
export const multiplyPoint = (p: Point, scalar: number): Point => ({
  x: p.x * scalar,
  y: p.y * scalar
});

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export const midpoint = (p1: Point, p2: Point): Point => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2
});

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point to rotate around
 * @param angle Angle in radians
 * @returns Rotated point
 */
export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: origin.y + dx * Math.sin(angle) + dy * Math.cos(angle)
  };
};

/**
 * Format distance for display
 * @param dist Distance in pixels
 * @returns Formatted distance string
 */
export const formatDistance = (dist: number): string => {
  return `${dist.toFixed(2)}px`;
};

/**
 * Check if a value is an exact multiple of the grid spacing
 * @param value Value to check
 * @param gridSpacing Grid spacing to check against
 * @returns True if value is an exact multiple
 */
export const isExactGridMultiple = (value: number, gridSpacing: number): boolean => {
  const remainder = value % gridSpacing;
  return remainder < 0.001 || Math.abs(remainder - gridSpacing) < 0.001;
};
