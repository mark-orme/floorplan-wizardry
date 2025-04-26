
/**
 * Type utilities for grid operations
 * @module grid/typeUtils
 */
import { Line } from "fabric";
import { Point } from "@/types/drawingTypes";

/**
 * Options for grid lines
 */
export interface GridLineOptions {
  /** Stroke color */
  stroke: string;
  /** Stroke width */
  strokeWidth: number;
  /** Whether line is selectable */
  selectable: boolean;
  /** Whether line responds to events */
  evented: boolean;
  /** Object type identifier */
  objectType: string;
  /** Whether to cache as image */
  objectCaching: boolean;
  /** Cursor when hovering */
  hoverCursor: string;
  /** Line opacity */
  opacity: number;
}

/**
 * Result of grid rendering
 */
export interface GridRenderResult {
  /** Small grid lines */
  smallGridLines: Line[];
  /** Large grid lines */
  largeGridLines: Line[];
  /** Grid markers */
  markers: unknown[];
  /** All grid objects */
  gridObjects: unknown[];
}

/**
 * Path processing constants
 */
export const PATH_PROCESSING = {
  /**
   * Minimum distance for a valid path in pixels
   */
  MIN_PATH_DISTANCE: 5,
  
  /**
   * Maximum angle variation for auto-straightening in degrees
   */
  STRAIGHTEN_ANGLE_THRESHOLD: 10,
  
  /**
   * Extension factor for walls
   */
  WALL_EXTENSION_FACTOR: 0.05,
  
  /**
   * Minimum number of points to keep in a full path
   */
  MIN_POINTS_THRESHOLD: 10,
  
  /**
   * Divisor for sampling when reducing path point count
   */
  SAMPLING_DIVISOR: 8
};

/**
 * Grid positioning constants
 */
export const GRID_POSITIONING_CONSTANTS = {
  /**
   * Extension factor for grid
   */
  GRID_EXTENSION_FACTOR: 1.5,
  
  /**
   * Edge margin for grid lines
   */
  EDGE_MARGIN: 20,
  
  /**
   * Marker offset from edges
   */
  MARKER_OFFSET: 5
};

/**
 * Converts an application Point to a Fabric.js compatible point
 * @param point - Application point with x,y coordinates
 * @returns Point-like object compatible with Fabric.js
 */
export const toFabricPoint = (point: Point): {x: number, y: number} => {
  return {x: point.x, y: point.y};
};

/**
 * Normalizes a point to ensure it has valid x,y coordinates
 * @param point - Point to normalize
 * @returns Normalized point with valid coordinates
 */
export const normalizePoint = (point: Partial<Point>): Point => {
  return {
    x: typeof point.x === 'number' ? point.x : 0,
    y: typeof point.y === 'number' ? point.y : 0
  };
};
