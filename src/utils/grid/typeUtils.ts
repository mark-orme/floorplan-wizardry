
/**
 * Type utilities for grid operations
 * @module grid/typeUtils
 */
import { Line } from "fabric";

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
  markers: any[];
  /** All grid objects */
  gridObjects: any[];
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
  WALL_EXTENSION_FACTOR: 0.05
};
