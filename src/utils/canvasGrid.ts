
/**
 * Canvas grid utilities
 * @module utils/canvasGrid
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Grid options interface
 */
export interface GridOptions {
  /** Grid size in pixels */
  size?: number;
  /** Grid stroke color */
  stroke?: string;
  /** Grid stroke width */
  strokeWidth?: number;
  /** Whether to show major lines */
  showMajorLines?: boolean;
  /** Major line stroke color */
  majorStroke?: string;
  /** Major line stroke width */
  majorStrokeWidth?: number;
  /** Major line interval */
  majorInterval?: number;
}

/**
 * Default grid options
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  size: 20,
  stroke: "#e0e0e0",
  strokeWidth: 1,
  showMajorLines: true,
  majorStroke: "#c0c0c0",
  majorStrokeWidth: 1,
  majorInterval: 5
};
