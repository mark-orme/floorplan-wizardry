
/**
 * Type utilities for grid operations
 * Provides type-safe interfaces and type guards for grid functions
 * @module grid/typeUtils
 */
import { Point } from '@/types/drawingTypes';

/**
 * Grid point interface with strict typing
 * @interface GridPoint
 */
export interface GridPoint {
  x: number;
  y: number;
}

/**
 * Type guard to check if a value is a valid grid point
 * @param {unknown} point - The value to check
 * @returns {boolean} True if the value is a valid grid point
 */
export function isValidGridPoint(point: unknown): point is GridPoint {
  if (!point || typeof point !== 'object') return false;
  
  const p = point as Record<string, unknown>;
  return (
    'x' in p && 
    'y' in p && 
    typeof p.x === 'number' && 
    typeof p.y === 'number' && 
    !isNaN(p.x) && 
    !isNaN(p.y)
  );
}

/**
 * Type-safe grid spacing configuration
 * @interface GridSpacingConfig
 */
export interface GridSpacingConfig {
  smallGridSpacing: number;
  largeGridSpacing: number;
  pixelsPerMeter: number;
}

/**
 * Grid line style options with strict typing
 * @interface GridLineOptions
 */
export interface GridLineOptions {
  stroke: string;
  strokeWidth: number;
  selectable: boolean;
  evented: boolean;
  objectCaching: boolean;
  [key: string]: any; // Allow additional properties
}

/**
 * Normalize and validate a Point object
 * @param {Point | null | undefined} point - Point to validate
 * @param {Point} defaultValue - Default value to use if point is invalid
 * @returns {Point} Validated point
 */
export function normalizePoint(point: Point | null | undefined, defaultValue: Point = { x: 0, y: 0 }): Point {
  if (!point) return { ...defaultValue };
  
  const x = typeof point.x === 'number' && !isNaN(point.x) ? point.x : defaultValue.x;
  const y = typeof point.y === 'number' && !isNaN(point.y) ? point.y : defaultValue.y;
  
  return { x, y };
}

/**
 * Validate grid size value
 * @param {unknown} size - Grid size to validate
 * @param {number} defaultSize - Default size to use if invalid
 * @returns {number} Validated grid size
 */
export function validateGridSize(size: unknown, defaultSize: number = 10): number {
  if (typeof size !== 'number' || isNaN(size) || size <= 0) {
    return defaultSize;
  }
  return size;
}
