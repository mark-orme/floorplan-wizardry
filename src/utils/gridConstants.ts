
/**
 * Constants used for grid rendering and configuration
 * @module gridConstants
 */

// These constants can be imported from drawing.ts to avoid duplication
import { SMALL_GRID, LARGE_GRID } from "./drawing";

export interface GridDimensions {
  width: number;
  height: number;
}

// Grid optimization constants - calibrated for better visual appearance
export const MAX_SMALL_GRID_LINES = 300; // Increased limit for denser grid
export const MAX_LARGE_GRID_LINES = 100; // Increased limit for larger grid
export const SMALL_GRID_SKIP_THRESHOLD = 200; // Canvas size / this = skip factor (lower means more lines)
export const LARGE_GRID_SKIP_THRESHOLD = 1000; // Canvas size / this = skip factor (lower means more lines)

// The grid should extend beyond the visible canvas to support panning
export const GRID_EXTENSION_FACTOR = 3; // Grid extends this many times the canvas size

/**
 * Determines if small grid creation should be skipped based on canvas dimensions
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @returns True if small grid should be skipped
 */
export const shouldSkipSmallGrid = (canvasWidth: number, canvasHeight: number): boolean => {
  const canvasArea = canvasWidth * canvasHeight;
  const smallGridSkip = Math.max(1, Math.floor(Math.sqrt(canvasArea) / SMALL_GRID_SKIP_THRESHOLD));
  
  const estimatedLinesX = Math.ceil(canvasWidth / (SMALL_GRID * smallGridSkip));
  const estimatedLinesY = Math.ceil(canvasHeight / (SMALL_GRID * smallGridSkip));
  const totalEstimatedLines = estimatedLinesX + estimatedLinesY;
  
  // Allow more lines before skipping - improved density
  return totalEstimatedLines > MAX_SMALL_GRID_LINES * 3;
};
