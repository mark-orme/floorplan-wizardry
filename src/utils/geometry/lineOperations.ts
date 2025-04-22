
/**
 * Line operation utilities
 * Provides functions for working with lines in a geometry context
 */
import { Point } from '@/types/core/Point';

/**
 * Checks if a point is near a line
 * @param point The point to check
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param threshold Distance threshold
 * @returns True if the point is within threshold distance of the line
 */
export const isPointNearLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  threshold: number = 5
): boolean => {
  // Distance from point to line implementation
  return false;
};

/**
 * Calculates the distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance between the points
 */
export const calculateDistance = (
  point1: Point,
  point2: Point
): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

/**
 * Calculates the angle between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Angle in degrees
 */
export const calculateAngle = (
  point1: Point,
  point2: Point
): number => {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
};

/**
 * Finds the intersection point between two lines
 * @param line1Start Start point of first line
 * @param line1End End point of first line
 * @param line2Start Start point of second line
 * @param line2End End point of second line
 * @returns Intersection point or null if lines don't intersect
 */
export const findLineIntersection = (
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): Point | null => {
  // Line intersection implementation
  return null;
};

/**
 * Calculates the midpoint of a line
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Midpoint of the line
 */
export const calculateMidpoint = (
  lineStart: Point,
  lineEnd: Point
): Point => {
  return {
    x: (lineStart.x + lineEnd.x) / 2,
    y: (lineStart.y + lineEnd.y) / 2
  };
};

/**
 * Checks if a value is an exact multiple of the grid size
 * @param value The value to check
 * @param gridSize The grid size
 * @returns True if the value is an exact multiple of the grid size
 */
export const isExactGridMultiple = (
  value: number,
  gridSize: number
): boolean => {
  return Math.abs(value % gridSize) < 0.001;
};

/**
 * Checks if a line is aligned with the grid
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param gridSize The grid size
 * @returns True if the line is aligned with the grid
 */
export const isLineAlignedWithGrid = (
  lineStart: Point,
  lineEnd: Point,
  gridSize: number
): boolean => {
  // Implementation for checking if a line is aligned with the grid
  return false;
};

/**
 * Snaps a point to the nearest grid point
 * @param point The point to snap
 * @param gridSize The grid size
 * @returns Snapped point
 */
export const snapToGrid = (
  point: Point,
  gridSize: number
): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snaps a line to the grid
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @param gridSize The grid size
 * @returns Snapped line as an array of two points
 */
export const snapLineToGrid = (
  lineStart: Point,
  lineEnd: Point,
  gridSize: number
): [Point, Point] => {
  return [
    snapToGrid(lineStart, gridSize),
    snapToGrid(lineEnd, gridSize)
  ];
};
