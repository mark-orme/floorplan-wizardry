
/**
 * Grid type utilities
 * Type definitions and utilities for grid operations
 * @module grid/typeUtils
 */
import { Line as FabricLine, Object as FabricObject } from "fabric";
import { Point } from "@/types/floorPlanTypes";

/**
 * Options for grid line creation
 */
export interface GridLineOptions {
  /** Line stroke color */
  stroke: string;
  /** Line stroke width */
  strokeWidth: number;
  /** Whether line is selectable */
  selectable: boolean;
  /** Whether line responds to events */
  evented: boolean;
  /** Type identifier for the line */
  objectType: string;
}

/**
 * Grid extent dimensions
 */
export interface GridExtent {
  /** Number of rows */
  rows: number;
  /** Number of columns */
  cols: number;
}

/**
 * Grid creation result
 */
export interface GridCreationResult {
  /** All grid objects */
  gridObjects: FabricObject[];
  /** Small grid lines */
  smallGridLines: FabricLine[];
  /** Large grid lines */
  largeGridLines: FabricLine[];
  /** Grid extent dimensions */
  extent: GridExtent;
}

/**
 * Grid configuration options
 */
export interface GridConfig {
  /** Small grid size */
  smallGridSize: number;
  /** Large grid size */
  largeGridSize: number;
  /** Small grid color */
  smallGridColor: string;
  /** Large grid color */
  largeGridColor: string;
  /** Small grid line width */
  smallGridWidth: number;
  /** Large grid line width */
  largeGridWidth: number;
}

/**
 * Normalize a point, ensuring numeric values
 * @param point - Point to normalize
 * @returns Normalized point with numeric coordinates
 */
export const normalizePoint = (point: Point): Point => {
  return {
    x: typeof point.x === 'string' ? parseFloat(point.x) : point.x,
    y: typeof point.y === 'string' ? parseFloat(point.y) : point.y
  };
};
