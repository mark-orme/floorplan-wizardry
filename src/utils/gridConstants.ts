
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

// Grid optimization constants
export const MAX_SMALL_GRID_LINES = 50; // Limit for better performance
export const MAX_LARGE_GRID_LINES = 30; // Safety limit for large grid lines
export const SMALL_GRID_SKIP_THRESHOLD = 300; // Canvas size / this = skip factor
export const LARGE_GRID_SKIP_THRESHOLD = 1500; // Canvas size / this = skip factor

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
  
  return totalEstimatedLines > MAX_SMALL_GRID_LINES * 2;
};
