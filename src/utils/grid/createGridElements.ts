
/**
 * Grid creation utility functions
 * @module utils/grid/createGridElements
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { ExtendedFabricObject } from "@/types/fabricTypes";

/**
 * Grid creation options
 */
export interface GridOptions {
  smallGridSpacing?: number;
  largeGridSpacing?: number; 
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridOpacity?: number;
  largeGridOpacity?: number;
  smallGridWidth?: number;
  largeGridWidth?: number;
}

/**
 * Default grid options
 */
const DEFAULT_GRID_OPTIONS: GridOptions = {
  smallGridSpacing: 20,
  largeGridSpacing: 100,
  smallGridColor: '#e0e0e0',
  largeGridColor: '#c0c0c0',
  smallGridOpacity: 0.5,
  largeGridOpacity: 0.7,
  smallGridWidth: 0.5,
  largeGridWidth: 1
};

/**
 * Create grid elements on the canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {GridOptions} options - Grid options
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGridElements = (
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] => {
  // Start diagnostic timer
  const startTime = performance.now();
  
  // Merge default options with provided options
  const gridOptions = { ...DEFAULT_GRID_OPTIONS, ...options };
  
  try {
    // Log the start of grid creation
    console.log('Creating grid elements:', { 
      canvasWidth: canvas.width, 
      canvasHeight: canvas.height,
      options: gridOptions 
    });
    
    // Validate canvas dimensions
    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      const error = new Error(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}`);
      captureError(error, 'grid-creation-dimensions', {
        level: 'error',
        tags: { component: 'createGridElements' }
      });
      logger.error('Cannot create grid: Invalid canvas dimensions', {
        width: canvas.width,
        height: canvas.height
      });
      return [];
    }
    
    // Disable rendering during creation for better performance
    const originalRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;
    
    // Arrays to hold grid lines
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    const smallGridSpacing = gridOptions.smallGridSpacing!;
    const smallGridColor = gridOptions.smallGridColor!;
    const smallGridOpacity = gridOptions.smallGridOpacity!;
    const smallGridWidth = gridOptions.smallGridWidth!;
    
    // Create small vertical grid lines
    for (let x = 0; x <= canvas.width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, canvas.height], {
        stroke: smallGridColor,
        strokeWidth: smallGridWidth,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity
      });
      
      // Add custom properties
      (line as ExtendedFabricObject).objectType = 'grid';
      (line as ExtendedFabricObject).gridType = 'small';
      
      // Add to canvas and track
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create small horizontal grid lines
    for (let y = 0; y <= canvas.height; y += smallGridSpacing) {
      const line = new Line([0, y, canvas.width, y], {
        stroke: smallGridColor,
        strokeWidth: smallGridWidth,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity
      });
      
      // Add custom properties
      (line as ExtendedFabricObject).objectType = 'grid';
      (line as ExtendedFabricObject).gridType = 'small';
      
      // Add to canvas and track
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    const largeGridSpacing = gridOptions.largeGridSpacing!;
    const largeGridColor = gridOptions.largeGridColor!;
    const largeGridOpacity = gridOptions.largeGridOpacity!;
    const largeGridWidth = gridOptions.largeGridWidth!;
    
    // Create large vertical grid lines
    for (let x = 0; x <= canvas.width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, canvas.height], {
        stroke: largeGridColor,
        strokeWidth: largeGridWidth,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity
      });
      
      // Add custom properties
      (line as ExtendedFabricObject).objectType = 'grid';
      (line as ExtendedFabricObject).gridType = 'large';
      
      // Add to canvas and track
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large horizontal grid lines
    for (let y = 0; y <= canvas.height; y += largeGridSpacing) {
      const line = new Line([0, y, canvas.width, y], {
        stroke: largeGridColor,
        strokeWidth: largeGridWidth,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity
      });
      
      // Add custom properties
      (line as ExtendedFabricObject).objectType = 'grid';
      (line as ExtendedFabricObject).gridType = 'large';
      
      // Add to canvas and track
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Restore original render setting
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
    
    // Explicitly render all the objects
    canvas.requestRenderAll();
    
    // Calculate and log performance metrics
    const endTime = performance.now();
    const creationTime = endTime - startTime;
    
    console.log(`Grid created successfully: ${gridObjects.length} objects in ${creationTime.toFixed(2)}ms`);
    logger.info(`Grid created successfully: ${gridObjects.length} objects in ${creationTime.toFixed(2)}ms`);
    
    return gridObjects;
  } catch (error) {
    const endTime = performance.now();
    const failTime = endTime - startTime;
    
    console.error(`Grid creation failed after ${failTime.toFixed(2)}ms:`, error);
    logger.error('Grid creation failed:', error);
    
    captureError(error, 'grid-creation-error', {
      level: 'error',
      tags: { 
        component: 'createGridElements',
        canvas_width: String(canvas.width),
        canvas_height: String(canvas.height)
      },
      extra: { 
        options, 
        canvasDimensions: `${canvas.width}x${canvas.height}`,
        processingTime: failTime 
      }
    });
    
    return [];
  }
};
