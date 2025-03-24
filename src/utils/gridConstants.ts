
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
export const MAX_SMALL_GRID_LINES = 750; // Increased for better grid density

/** Maximum number of large grid lines to render for performance */
export const MAX_LARGE_GRID_LINES = 200; // Increased for better grid density

/** Threshold for calculating small grid skip factor (lower means more lines) */
export const SMALL_GRID_SKIP_THRESHOLD = 100; // Lowered to create denser grid

/** Threshold for calculating large grid skip factor (lower means more lines) */
export const LARGE_GRID_SKIP_THRESHOLD = 600; // Lowered to create denser grid

/** The grid should extend beyond the visible canvas to support panning */
export const GRID_EXTENSION_FACTOR = 5; // Increased for better pan support

/**
 * Determines if small grid creation should be skipped based on canvas dimensions
 * Prevents creating too many grid lines which would impact performance
 * 
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns True if small grid should be skipped
 */
export const shouldSkipSmallGrid = (canvasWidth: number, canvasHeight: number): boolean => {
  // If dimensions are invalid or zero, don't skip
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    return false;
  }
  
  const canvasArea = canvasWidth * canvasHeight;
  const smallGridSkip = Math.max(1, Math.floor(Math.sqrt(canvasArea) / SMALL_GRID_SKIP_THRESHOLD));
  
  const estimatedLinesX = Math.ceil(canvasWidth / (SMALL_GRID * smallGridSkip));
  const estimatedLinesY = Math.ceil(canvasHeight / (SMALL_GRID * smallGridSkip));
  const totalEstimatedLines = estimatedLinesX + estimatedLinesY;
  
  // Only skip if we would create an extreme number of lines
  // Increased threshold to allow more grid lines before skipping
  const shouldSkip = totalEstimatedLines > MAX_SMALL_GRID_LINES * 10;
  
  if (process.env.NODE_ENV === 'development' && shouldSkip) {
    console.log(`Skipping small grid creation - estimated ${totalEstimatedLines} lines exceeds threshold of ${MAX_SMALL_GRID_LINES * 10}`);
  }
  
  return shouldSkip;
};
