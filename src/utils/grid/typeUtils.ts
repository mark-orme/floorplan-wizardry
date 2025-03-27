/**
 * Type utilities for grid operations
 * @module grid/typeUtils
 */
import { Point } from '@/types/floorPlanTypes';

/**
 * Grid point type
 * Represents a point in the grid coordinate system
 * 
 * @interface GridPoint
 */
export interface GridPoint {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Whether this point is snapped to the grid */
  snapped?: boolean;
  /** Original unsnapped x coordinate */
  originalX?: number;
  /** Original unsnapped y coordinate */
  originalY?: number;
}

/**
 * Convert a standard point to a grid point
 * @param {Point} point The point to convert
 * @returns {GridPoint} The converted grid point
 */
export function toGridPoint(point: Point): GridPoint {
  return {
    x: point.x,
    y: point.y
  };
}

/**
 * Convert grid coordinates to canvas coordinates
 * @param {number} gridX - X coordinate in the grid
 * @param {number} gridY - Y coordinate in the grid
 * @param {number} gridSize - Size of the grid cell
 * @returns {{ x: number; y: number }} Canvas coordinates
 */
export function gridToCanvas(gridX: number, gridY: number, gridSize: number): { x: number; y: number } {
  return {
    x: gridX * gridSize,
    y: gridY * gridSize
  };
}

/**
 * Convert canvas coordinates to grid coordinates
 * @param {number} canvasX - X coordinate on the canvas
 * @param {number} canvasY - Y coordinate on the canvas
 * @param {number} gridSize - Size of the grid cell
 * @returns {{ x: number; y: number }} Grid coordinates
 */
export function canvasToGrid(canvasX: number, canvasY: number, gridSize: number): { x: number; y: number } {
  return {
    x: Math.floor(canvasX / gridSize),
    y: Math.floor(canvasY / gridSize)
  };
}

/**
 * Snap a value to the nearest grid line
 * @param {number} value - The value to snap
 * @param {number} gridSize - Size of the grid cell
 * @returns {number} Snapped value
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Calculate the distance between two grid points
 * @param {GridPoint} p1 - First grid point
 * @param {GridPoint} p2 - Second grid point
 * @returns {number} Distance between the points
 */
export function gridDistance(p1: GridPoint, p2: GridPoint): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two grid points are equal
 * @param {GridPoint} p1 - First grid point
 * @param {GridPoint} p2 - Second grid point
 * @returns {boolean} True if the points are equal
 */
export function gridPointsAreEqual(p1: GridPoint, p2: GridPoint): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}
