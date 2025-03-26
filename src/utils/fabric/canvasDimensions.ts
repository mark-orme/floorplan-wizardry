
/**
 * Utilities for managing canvas dimensions
 * @module fabric/canvasDimensions
 */
import { Canvas } from "fabric";

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

// Module-level state for dimension tracking
const dimensionState = {
  prevDimensions: { width: 0, height: 0 },
  dimensionUpdateCount: 0,
  initialSetupComplete: false
};

/**
 * Minimum dimension values for canvas
 */
const MIN_DIMENSIONS = {
  WIDTH: 1200,
  HEIGHT: 950
};

/**
 * Tolerance for dimension changes that don't require updates
 */
const DIMENSION_CHANGE_TOLERANCE = 20;

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {CanvasDimensions} dimensions - Object containing width and height to set
 */
export const setCanvasDimensions = (
  canvas: Canvas, 
  dimensions: CanvasDimensions
): void => {
  if (!canvas) {
    console.error("Cannot set dimensions: canvas is null");
    return;
  }
  
  try {
    const { width, height } = dimensions;
    
    // Skip update for small changes
    if (Math.abs(width - dimensionState.prevDimensions.width) < DIMENSION_CHANGE_TOLERANCE && 
        Math.abs(height - dimensionState.prevDimensions.height) < DIMENSION_CHANGE_TOLERANCE) {
      return;
    }
    
    // Store new dimensions
    dimensionState.prevDimensions = { width, height };
    
    // Increment update count
    dimensionState.dimensionUpdateCount++;
    
    // Only log first dimension update and every 20th after that to reduce console spam
    if (!dimensionState.initialSetupComplete || dimensionState.dimensionUpdateCount % 20 === 0) {
      console.log(`Setting canvas dimensions to ${width}x${height}`);
      dimensionState.initialSetupComplete = true;
    }
    
    // Use higher dimensions values
    const finalWidth = Math.max(width, MIN_DIMENSIONS.WIDTH);
    const finalHeight = Math.max(height, MIN_DIMENSIONS.HEIGHT);
    
    canvas.setDimensions({ width: finalWidth, height: finalHeight });
    
    // Force render
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};
