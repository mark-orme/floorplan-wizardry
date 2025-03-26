
/**
 * Grid constants for canvas grid rendering
 * Contains configuration values for grid dimensions and styling
 * @module gridConstants
 */
import { Canvas, Line, Text } from "fabric";

/** Base cell size in pixels */
export const GRID_CELL_SIZE = 20;

/** Scale factor for real-world dimensions (1 meter = 100 pixels) */
export const GRID_SCALE_FACTOR = 100;

/** Small grid spacing in meters */
export const SMALL_GRID_SPACING = 0.1;

/** Large grid spacing in meters */
export const LARGE_GRID_SPACING = 1;

/** Marker interval in meters */
export const MARKER_INTERVAL = 1;

/** Maximum number of small grid lines to render */
export const MAX_SMALL_GRID_LINES = 500;

/** Maximum number of large grid lines to render */
export const MAX_LARGE_GRID_LINES = 100;

/** Grid extension factor - how much to extend grid beyond visible area */
export const GRID_EXTENSION_FACTOR = 1.5;

/** Styling options for small grid lines */
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: "#E0E5EC",
  selectable: false,
  evented: false,
  strokeWidth: 0.5,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: 0.7,
  objectType: 'grid-small'
};

/** Styling options for large grid lines */
export const LARGE_GRID_LINE_OPTIONS = {
  stroke: "#C0D0E0",
  selectable: false,
  evented: false,
  strokeWidth: 1,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: 0.8,
  objectType: 'grid-large'
};

/** Styling options for grid marker text */
export const MARKER_TEXT_OPTIONS = {
  fontSize: 12,
  fill: "#708090",
  selectable: false,
  evented: false,
  objectCaching: true,
  hoverCursor: 'default',
  objectType: 'grid-marker'
};

/**
 * Grid dimensions metadata interface
 * @interface GridDimensions
 */
export interface GridDimensions {
  width: number;
  height: number;
}

/**
 * Calculate grid density based on canvas dimensions
 * Determines how many lines to skip for optimal performance
 * 
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @returns {Object} Grid density configuration
 */
export const calculateGridDensity = (width: number, height: number) => {
  const area = width * height;
  
  // Skip small grid entirely for very large canvases
  const smallGridVisible = area < 2000000;
  
  // Determine interval for small grid lines (1 = every line, 2 = every other line, etc.)
  let smallGridInterval = 1;
  if (area > 500000) smallGridInterval = 2;
  if (area > 1000000) smallGridInterval = 5;
  if (area > 1500000) smallGridInterval = 10;
  
  return {
    smallGridVisible,
    smallGridInterval
  };
};

/**
 * Check if small grid should be skipped based on canvas dimensions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {boolean} Whether to skip small grid
 */
export const shouldSkipSmallGrid = (width: number, height: number): boolean => {
  return width * height > 2000000; // Skip for very large canvases
};
