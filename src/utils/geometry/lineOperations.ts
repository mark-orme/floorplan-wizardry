
import { Point, Line } from "@/types/core/Geometry";

/**
 * Calculate distance between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Distance between points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points in degrees
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Angle in degrees
 */
export function calculateAngle(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Normalize angle to 0-360 degrees
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
}

/**
 * Format distance for display
 * @param {number} distance - Distance to format
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance: number): string {
  return `${Math.round(distance)}px`;
}

/**
 * Calculate midpoint between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {Point} Midpoint
 */
export function calculateMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param {number} value - Value to check
 * @param {number} gridSize - Grid size (defaults to 20)
 * @returns {boolean} True if value is a multiple of grid size
 */
export function isExactGridMultiple(value: number, gridSize: number = 20): boolean {
  return Math.abs(value % gridSize) < 0.001;
}

/**
 * Check if a line is aligned with the grid
 * @param {Line} line - Line to check
 * @param {number} gridSize - Grid size (defaults to 20)
 * @returns {boolean} True if line is aligned with grid
 */
export function isLineAlignedWithGrid(line: Point, gridSize: number = 20): boolean {
  // When line is a Point (backwards compatibility)
  if ('x' in line && 'y' in line && !('start' in line)) {
    return isExactGridMultiple(line.x, gridSize) && isExactGridMultiple(line.y, gridSize);
  }
  // When line is actually a Line
  return (
    isExactGridMultiple((line as any).start.x, gridSize) &&
    isExactGridMultiple((line as any).start.y, gridSize) &&
    isExactGridMultiple((line as any).end.x, gridSize) &&
    isExactGridMultiple((line as any).end.y, gridSize)
  );
}

/**
 * Snap a point to the nearest grid point
 * @param {Point} point - Point to snap
 * @param {number} gridSize - Grid size (defaults to 20)
 * @returns {Point} Snapped point
 */
export function snapToGrid(point: Point, gridSize: number = 20): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snap a line to the grid
 * @param {Line} line - Line to snap
 * @param {number} gridSize - Grid size (defaults to 20)
 * @returns {Line} Snapped line
 */
export function snapLineToGrid(line: Line, gridSize: number = 20): Line {
  return {
    start: snapToGrid(line.start, gridSize),
    end: snapToGrid(line.end, gridSize)
  };
}
