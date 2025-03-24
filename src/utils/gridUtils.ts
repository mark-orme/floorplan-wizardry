
/**
 * Utility functions for grid management
 * @module gridUtils
 */
import { Canvas, Line, Text } from "fabric";
import { GridDimensions, MAX_SMALL_GRID_LINES, MAX_LARGE_GRID_LINES } from "./gridConstants";
import { SMALL_GRID, LARGE_GRID } from "./drawing";

/**
 * Store grid dimensions in a metadata object for future comparison
 * @param obj - The object to store dimensions in
 * @param width - Canvas width
 * @param height - Canvas height
 */
export const storeGridDimensions = (obj: any, width: number, height: number): void => {
  Object.defineProperty(obj, 'gridDimensions', {
    value: { width, height },
    enumerable: false
  });
};

/**
 * Calculate small grid density based on canvas dimensions
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @returns Skip factor for small grid lines
 */
export const calculateSmallGridSkip = (canvasWidth: number, canvasHeight: number): number => {
  const canvasArea = canvasWidth * canvasHeight;
  return Math.max(1, Math.floor(Math.sqrt(canvasArea) / 300));
};

/**
 * Calculate large grid density based on canvas dimensions
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @returns Skip factor for large grid lines
 */
export const calculateLargeGridSkip = (canvasWidth: number, canvasHeight: number): number => {
  const canvasArea = canvasWidth * canvasHeight;
  return Math.max(1, Math.floor(Math.sqrt(canvasArea) / 1500));
};

/**
 * Creates scale markers (1m indicator) for the grid
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @returns The created marker objects
 */
export const createScaleMarkers = (
  canvas: Canvas,
  canvasWidth: number,
  canvasHeight: number
): any[] => {
  const markerLine = new Line([
    canvasWidth - LARGE_GRID - 20, 
    canvasHeight - 20, 
    canvasWidth - 20, 
    canvasHeight - 20
  ], {
    stroke: "#333333",
    strokeWidth: 2,
    selectable: false,
    evented: false,
    objectCaching: true,
    hoverCursor: 'default',
    // Set a high z-index to make sure it appears above grid
    originX: 'left',
    originY: 'top'
  });
  
  const markerText = new Text("1m", {
    left: canvasWidth - LARGE_GRID/2 - 30,
    top: canvasHeight - 35,
    fontSize: 12,
    fill: "#333333",
    selectable: false,
    evented: false,
    objectCaching: true,
    hoverCursor: 'default',
    // Set a high z-index to make sure it appears above grid
    originX: 'left',
    originY: 'top'
  });
  
  // Store grid dimensions in the marker line for future reference
  storeGridDimensions(markerLine, canvasWidth, canvasHeight);
  
  return [markerLine, markerText];
};
