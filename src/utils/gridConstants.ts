
/**
 * Constants used for grid rendering and configuration
 * Defines thresholds, limits, and optimization parameters for grid creation
 * @module gridConstants
 */

// These constants can be imported from drawing.ts to avoid duplication
import { SMALL_GRID, LARGE_GRID } from "./drawing";

/**
 * Defines grid dimensions with width and height
 * @interface GridDimensions
 */
export interface GridDimensions {
  /** Width in pixels */
  width: number;
  
  /** Height in pixels */
  height: number;
}

// Grid optimization constants - calibrated for better visual appearance
/** Maximum number of small grid lines to render for performance */
export const MAX_SMALL_GRID_LINES = 300; // Increased limit for denser grid

/** Maximum number of large grid lines to render for performance */
export const MAX_LARGE_GRID_LINES = 100; // Increased limit for larger grid

/** Threshold for calculating small grid skip factor (lower means more lines) */
export const SMALL_GRID_SKIP_THRESHOLD = 200; // Canvas size / this = skip factor

/** Threshold for calculating large grid skip factor (lower means more lines) */
export const LARGE_GRID_SKIP_THRESHOLD = 1000; // Canvas size / this = skip factor

/** The grid should extend beyond the visible canvas to support panning */
export const GRID_EXTENSION_FACTOR = 3; // Grid extends this many times the canvas size

/**
 * Determines if small grid creation should be skipped based on canvas dimensions
 * Prevents creating too many grid lines which would impact performance
 * 
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns True if small grid should be skipped
 */
export const shouldSkipSmallGrid = (canvasWidth: number, canvasHeight: number): boolean => {
  const canvasArea = canvasWidth * canvasHeight;
  const smallGridSkip = Math.max(1, Math.floor(Math.sqrt(canvasArea) / SMALL_GRID_SKIP_THRESHOLD));
  
  const estimatedLinesX = Math.ceil(canvasWidth / (SMALL_GRID * smallGridSkip));
  const estimatedLinesY = Math.ceil(canvasHeight / (SMALL_GRID * smallGridSkip));
  const totalEstimatedLines = estimatedLinesX + estimatedLinesY;
  
  const shouldSkip = totalEstimatedLines > MAX_SMALL_GRID_LINES * 3;
  
  if (process.env.NODE_ENV === 'development' && shouldSkip) {
    console.log(`Skipping small grid creation - estimated ${totalEstimatedLines} lines exceeds threshold of ${MAX_SMALL_GRID_LINES * 3}`);
  }
  
  // Allow more lines before skipping - improved density
  return shouldSkip;
};
