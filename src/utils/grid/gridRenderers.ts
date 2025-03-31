
/**
 * Grid renderer utilities
 * @module utils/grid/gridRenderers
 */

import { Canvas, Line, Object as FabricObject } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import logger from "@/utils/logger";

/**
 * Interface for grid options
 */
export interface GridOptions {
  /** Spacing between grid lines */
  spacing?: number;
  /** Color of grid lines */
  color?: string;
  /** Width of grid lines */
  lineWidth?: number;
  /** Render major grid lines (every 5th line) */
  renderMajorLines?: boolean;
  /** Color of major grid lines */
  majorLineColor?: string;
  /** Width of major grid lines */
  majorLineWidth?: number;
}

/**
 * Default grid options
 */
const DEFAULT_GRID_OPTIONS: GridOptions = {
  spacing: 20,
  color: '#dddddd',
  lineWidth: 0.5,
  renderMajorLines: true,
  majorLineColor: '#aaaaaa',
  majorLineWidth: 1
};

/**
 * Create a complete grid with major and minor lines
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {GridOptions} [options] - Grid rendering options
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas, 
  options?: GridOptions
): FabricObject[] => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return [];
  }
  
  // Merge default options with provided options
  const opts = { ...DEFAULT_GRID_OPTIONS, ...options };
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Check canvas dimensions
  if (width <= 0 || height <= 0) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_INVALID);
    return [];
  }
  
  // Store created grid objects
  const gridObjects: FabricObject[] = [];
  
  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += opts.spacing!) {
      // Determine if this is a major grid line
      const isMajor = opts.renderMajorLines && y % (opts.spacing! * 5) === 0;
      
      const line = new Line([0, y, width, y], {
        stroke: isMajor ? opts.majorLineColor : opts.color,
        strokeWidth: isMajor ? opts.majorLineWidth : opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += opts.spacing!) {
      // Determine if this is a major grid line
      const isMajor = opts.renderMajorLines && x % (opts.spacing! * 5) === 0;
      
      const line = new Line([x, 0, x, height], {
        stroke: isMajor ? opts.majorLineColor : opts.color,
        strokeWidth: isMajor ? opts.majorLineWidth : opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Render the canvas
    canvas.renderAll();
    
    logger.info(`Created complete grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    return gridObjects; // Return any objects that were created before the error
  }
};

/**
 * Create a simple grid with only minor lines
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {GridOptions} [options] - Grid rendering options
 * @returns {FabricObject[]} Created grid objects
 */
export const createSimpleGrid = (
  canvas: Canvas, 
  options?: GridOptions
): FabricObject[] => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return [];
  }
  
  // Use simplified options for the simple grid
  const opts = { 
    ...DEFAULT_GRID_OPTIONS, 
    renderMajorLines: false, 
    ...options 
  };
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Check canvas dimensions
  if (width <= 0 || height <= 0) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_INVALID);
    return [];
  }
  
  // Store created grid objects
  const gridObjects: FabricObject[] = [];
  
  try {
    // Create horizontal lines (fewer than complete grid)
    for (let y = 0; y <= height; y += opts.spacing! * 2) {
      const line = new Line([0, y, width, y], {
        stroke: opts.color,
        strokeWidth: opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines (fewer than complete grid)
    for (let x = 0; x <= width; x += opts.spacing! * 2) {
      const line = new Line([x, 0, x, height], {
        stroke: opts.color,
        strokeWidth: opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Render the canvas
    canvas.renderAll();
    
    logger.info(`Created simple grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating simple grid:", error);
    return gridObjects; // Return any objects that were created before the error
  }
};

/**
 * Create a basic emergency grid
 * Simplified grid for fallback scenarios
 * @param {Canvas} canvas - The fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas
): FabricObject[] => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return [];
  }
  
  // Use very simple options for emergency grid
  const opts = {
    spacing: 50,
    color: '#cccccc',
    lineWidth: 0.5
  };
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Store created grid objects
  const gridObjects: FabricObject[] = [];
  
  try {
    // Create minimal horizontal lines
    for (let y = 0; y <= height; y += opts.spacing) {
      const line = new Line([0, y, width, y], {
        stroke: opts.color,
        strokeWidth: opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create minimal vertical lines
    for (let x = 0; x <= width; x += opts.spacing) {
      const line = new Line([x, 0, x, height], {
        stroke: opts.color,
        strokeWidth: opts.lineWidth,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Render the canvas
    canvas.renderAll();
    
    logger.info(`Created emergency grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return gridObjects; // Return any objects that were created before the error
  }
};

/**
 * Create enhanced grid with additional features
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {GridOptions} [options] - Grid rendering options
 * @returns {FabricObject[]} Created grid objects
 */
export const createEnhancedGrid = (
  canvas: Canvas, 
  options?: GridOptions
): FabricObject[] => {
  // For now, this is just an alias for createCompleteGrid
  // In the future, this could include additional features
  return createCompleteGrid(canvas, options);
};
