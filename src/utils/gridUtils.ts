
/**
 * Utility functions for grid management
 * Provides helper functions for grid creation, scaling, and positioning
 * @module gridUtils
 */
import { Canvas, Line, Text, Object as FabricObject } from "fabric";
import { GridDimensions, MAX_SMALL_GRID_LINES, MAX_LARGE_GRID_LINES } from "./gridConstants";
import { SMALL_GRID, LARGE_GRID } from "./drawing";
import { CanvasDimensions } from "@/types/drawingTypes";

/**
 * Store grid dimensions in a metadata object for future comparison
 * This helps determine when grid needs to be recreated due to dimension changes
 * 
 * @param obj - The object to store dimensions in
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 */
export const storeGridDimensions = (obj: FabricObject, width: number, height: number): void => {
  Object.defineProperty(obj, 'gridDimensions', {
    value: { width, height },
    enumerable: false
  });
};

/**
 * Calculate small grid density based on canvas dimensions
 * Determines how many lines to skip for optimal performance and visual density
 * 
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Skip factor for small grid lines (1 = draw all lines, 2 = draw every other line, etc.)
 */
export const calculateSmallGridSkip = (canvasWidth: number, canvasHeight: number): number => {
  const canvasArea = canvasWidth * canvasHeight;
  return Math.max(1, Math.floor(Math.sqrt(canvasArea) / 300));
};

/**
 * Calculate large grid density based on canvas dimensions
 * Determines how many lines to skip for optimal performance and visual density
 * 
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Skip factor for large grid lines (1 = draw all lines, 2 = draw every other line, etc.)
 */
export const calculateLargeGridSkip = (canvasWidth: number, canvasHeight: number): number => {
  const canvasArea = canvasWidth * canvasHeight;
  return Math.max(1, Math.floor(Math.sqrt(canvasArea) / 1500));
};

/**
 * Creates scale markers (1m indicator) for the grid
 * Adds visual indicators to help users understand the scale of the drawing
 * 
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns The created marker objects (line and text)
 */
export const createScaleMarkers = (
  canvas: Canvas,
  canvasWidth: number,
  canvasHeight: number
): FabricObject[] => {
  console.log("Creating scale markers");
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    console.error("Invalid canvas dimensions for scale markers:", canvasWidth, canvasHeight);
    return [];
  }
  
  try {
    // Create a more visible marker line in bottom right
    const markerLine = new Line([
      canvasWidth - 120, 
      canvasHeight - 30, 
      canvasWidth - 20, 
      canvasHeight - 30
    ], {
      stroke: "#000000", // Black for maximum contrast
      strokeWidth: 3, // Thicker line
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    // Create a text label for the marker with improved visibility
    const markerText = new Text("1m", {
      left: canvasWidth - 70,
      top: canvasHeight - 45,
      fontSize: 16, // Larger font
      fontWeight: 'bold',
      fill: "#000000", // Black text
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default',
      backgroundColor: 'rgba(255,255,255,0.7)' // Semi-transparent white background
    });
    
    // Store grid dimensions in the marker line for future reference
    storeGridDimensions(markerLine, canvasWidth, canvasHeight);
    
    console.log("Scale markers created successfully");
    return [markerLine, markerText];
  } catch (error) {
    console.error("Error creating scale markers:", error);
    return [];
  }
};
