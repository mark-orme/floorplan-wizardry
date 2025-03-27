
/**
 * Grid type utilities
 * Provides type definitions for grid components
 * @module grid/typeUtils
 */

// Import types from centralized location
import type { Point } from '@/types/floorPlanTypes';

/**
 * Options for grid line styling
 * @interface GridLineOptions
 */
export interface GridLineOptions {
  /** Line color */
  stroke: string;
  /** Line width */
  strokeWidth: number;
  /** Whether line can be selected */
  selectable: boolean;
  /** Whether line responds to events */
  evented: boolean;
  /** Whether to cache the object */
  objectCaching: boolean;
  /** Cursor style when hovering */
  hoverCursor: string;
  /** Line opacity */
  opacity: number;
}

/**
 * Grid point interface extending Point
 * @interface GridPoint
 */
export interface GridPoint extends Point {
  /** Optional snapped indicator */
  snapped?: boolean;
  /** Distance to nearest grid line */
  distance?: number;
  /** Original unsnapped point */
  original?: Point;
}

/**
 * Grid line interface
 * @interface GridLine
 */
export interface GridLine {
  /** Line start point */
  start: Point;
  /** Line end point */
  end: Point;
  /** Whether it's a major grid line */
  isMajor: boolean;
  /** Line orientation */
  orientation: 'horizontal' | 'vertical';
}

/**
 * Grid marker interface for text labels
 * @interface GridMarker
 */
export interface GridMarker {
  /** Position of the marker */
  position: Point;
  /** Text content */
  text: string;
  /** Whether it's a major marker */
  isMajor: boolean;
  /** Marker orientation */
  orientation: 'horizontal' | 'vertical';
}

/**
 * Grid creation context
 * @interface GridCreationContext
 */
export interface GridCreationContext {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Small grid spacing */
  smallGridSpacing: number;
  /** Large grid spacing */
  largeGridSpacing: number;
  /** Extension factor for grid size */
  extensionFactor: number;
  /** Grid offset factor */
  offsetFactor: number;
}

/**
 * Normalize a point to ensure it has valid x and y coordinates
 * @param {Point | null | undefined} point - The point to normalize
 * @returns {Point} A valid point object with x and y coordinates
 */
export const normalizePoint = (point?: Point | null): Point => {
  if (!point) return { x: 0, y: 0 };
  return {
    x: typeof point.x === 'number' ? point.x : 0,
    y: typeof point.y === 'number' ? point.y : 0
  };
};

/**
 * Type guard to check if a value is a valid Point
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is a valid Point
 */
export const isPoint = (value: any): value is Point => {
  return value && 
    typeof value === 'object' && 
    typeof value.x === 'number' && 
    typeof value.y === 'number';
};

/**
 * Type guard to check if a value is a valid GridPoint
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is a valid GridPoint
 */
export const isGridPoint = (value: any): value is GridPoint => {
  // First check if it's a valid Point
  if (!isPoint(value)) return false;
  
  // Then check for GridPoint-specific properties
  // Return true even if GridPoint-specific props are missing
  return true;
};

/**
 * Creates a GridPoint from a regular Point
 * @param {Point} point - Original point
 * @param {boolean} [snapped=false] - Whether the point is snapped to grid
 * @returns {GridPoint} A grid point with snapped indicator
 */
export const createGridPoint = (point: Point, snapped: boolean = false): GridPoint => {
  return {
    x: point.x,
    y: point.y,
    snapped: snapped,
    original: snapped ? { ...point } : undefined
  };
};

/**
 * Snaps a point to the nearest grid point
 * @param {Point} point - The point to snap
 * @param {number} gridSize - The grid size to snap to
 * @returns {GridPoint} A snapped grid point
 */
export const snapPointToGrid = (point: Point, gridSize: number = 10): GridPoint => {
  // Ensure a valid grid size
  const actualGridSize = gridSize > 0 ? gridSize : 10;
  
  // Calculate snapped coordinates
  const snappedX = Math.round(point.x / actualGridSize) * actualGridSize;
  const snappedY = Math.round(point.y / actualGridSize) * actualGridSize;
  
  // Calculate distance to nearest grid line
  const distance = Math.sqrt(
    Math.pow(point.x - snappedX, 2) + 
    Math.pow(point.y - snappedY, 2)
  );
  
  return {
    x: snappedX,
    y: snappedY,
    snapped: true,
    distance,
    original: { ...point }
  };
};
