
/**
 * Line operation utilities
 * Functions for calculations with lines
 * @module utils/geometry/lineOperations
 */

import { Point } from '@/types/geometryTypes';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate midpoint between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Midpoint
 */
export function calculateMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Calculate angle between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export function calculateAngle(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Format distance with units
 * @param distance Distance in pixels
 * @param precision Number of decimal places
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, precision: number = 2): string {
  return `${distance.toFixed(precision)} px`;
}

/**
 * Check if a value is an exact multiple of grid spacing
 * @param value Value to check
 * @param tolerance Tolerance threshold
 * @returns True if value is multiple of grid
 */
export function isExactGridMultiple(value: number, tolerance: number = 0.1): boolean {
  const gridSize = typeof GRID_SPACING === 'number' ? GRID_SPACING : GRID_SPACING.DEFAULT;
  const remainder = value % gridSize;
  return remainder <= tolerance || (gridSize - remainder) <= tolerance;
}

/**
 * Snaps a given value to the nearest multiple of a grid size
 * @param value The value to snap
 * @param gridSize The grid size
 * @returns Snapped value
 */
export function snapToGrid(value: number, gridSize: number = (typeof GRID_SPACING === 'number' ? GRID_SPACING : GRID_SPACING.DEFAULT)): number {
  return Math.round(value / gridSize) * gridSize;
}
