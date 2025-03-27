
/**
 * Utility functions for grid management
 * Provides helper functions for grid creation, scaling, and positioning
 * @module gridUtils
 */
import { Canvas, Line, Text, Object as FabricObject } from "fabric";
import { GridDimensions, GridRenderResult } from "@/types/fabric";
import { MAX_SMALL_GRID_LINES, MAX_LARGE_GRID_LINES } from "./gridConstants";
import { SMALL_GRID, LARGE_GRID } from "./drawing";
import { CanvasDimensions } from "@/types/drawingTypes";
import logger from "./logger";
import { 
  SMALL_GRID_DENSITY_DIVISOR, 
  LARGE_GRID_DENSITY_DIVISOR, 
  SCALE_MARKER 
} from "./grid/gridPositioningConstants";

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
    value: { width, height } as GridDimensions,
    enumerable: false
  });
};

/**
 * Grid density thresholds
 */
const GRID_DENSITY = {
  /**
   * Divisor for small grid density calculation
   */
  SMALL_DIVISOR: SMALL_GRID_DENSITY_DIVISOR || 200,
  
  /**
   * Divisor for large grid density calculation
   */
  LARGE_DIVISOR: LARGE_GRID_DENSITY_DIVISOR || 500,
  
  /**
   * Minimum skip factor (1 = draw all lines)
   */
  MIN_SKIP: 1
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
  return Math.max(GRID_DENSITY.MIN_SKIP, Math.floor(Math.sqrt(canvasArea) / GRID_DENSITY.SMALL_DIVISOR));
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
  return Math.max(GRID_DENSITY.MIN_SKIP, Math.floor(Math.sqrt(canvasArea) / GRID_DENSITY.LARGE_DIVISOR));
};

/**
 * Scale marker styling constants
 */
const MARKER_STYLING = {
  /**
   * Stroke color for marker line
   */
  STROKE_COLOR: "#000000",
  
  /**
   * Font weight for marker text
   */
  FONT_WEIGHT: 'bold',
  
  /**
   * Text color for marker
   */
  TEXT_COLOR: "#000000",
  
  /**
   * Background color for marker text
   */
  BACKGROUND_COLOR: "rgba(255,255,255,0.7)"
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
  logger.info("Creating scale markers");
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    logger.error("Invalid canvas dimensions for scale markers:", canvasWidth, canvasHeight);
    return [];
  }
  
  try {
    // Create a more visible marker line in bottom right
    const markerLine = new Line([
      canvasWidth - SCALE_MARKER.HORIZONTAL_OFFSET_START, 
      canvasHeight - SCALE_MARKER.VERTICAL_OFFSET, 
      canvasWidth - SCALE_MARKER.HORIZONTAL_OFFSET_END, 
      canvasHeight - SCALE_MARKER.VERTICAL_OFFSET
    ], {
      stroke: MARKER_STYLING.STROKE_COLOR,
      strokeWidth: SCALE_MARKER.LINE_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    // Create a text label for the marker with improved visibility
    const markerText = new Text("1m", {
      left: canvasWidth - SCALE_MARKER.TEXT_HORIZONTAL_OFFSET,
      top: canvasHeight - SCALE_MARKER.TEXT_VERTICAL_OFFSET,
      fontSize: SCALE_MARKER.FONT_SIZE,
      fontWeight: MARKER_STYLING.FONT_WEIGHT as any, // casting as any due to Fabric.js type inconsistency
      fill: MARKER_STYLING.TEXT_COLOR,
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default',
      backgroundColor: MARKER_STYLING.BACKGROUND_COLOR
    });
    
    // Store grid dimensions in the marker line for future reference
    storeGridDimensions(markerLine, canvasWidth, canvasHeight);
    
    logger.info("Scale markers created successfully");
    return [markerLine, markerText];
  } catch (error) {
    logger.error("Error creating scale markers:", error);
    return [];
  }
};

/**
 * Calculate grid object placement for optimized rendering
 * 
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Optimized grid calculation parameters
 */
export const calculateGridParameters = (width: number, height: number): {
  smallGridSkip: number;
  largeGridSkip: number;
  smallGridLineCount: number;
  largeGridLineCount: number;
} => {
  // Calculate grid density based on canvas size
  const smallGridSkip = calculateSmallGridSkip(width, height);
  const largeGridSkip = calculateLargeGridSkip(width, height);
  
  // Calculate grid line counts with density adjustments
  const smallGridLineCount = Math.min(
    Math.ceil((Math.max(width, height) * 2) / (SMALL_GRID * smallGridSkip)),
    MAX_SMALL_GRID_LINES
  );
  
  const largeGridLineCount = Math.min(
    Math.ceil((Math.max(width, height) * 2) / (LARGE_GRID * largeGridSkip)),
    MAX_LARGE_GRID_LINES
  );
  
  return {
    smallGridSkip,
    largeGridSkip,
    smallGridLineCount,
    largeGridLineCount
  };
};
