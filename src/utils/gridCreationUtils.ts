
/**
 * Grid creation utilities
 * @module utils/gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import logger from "@/utils/logger";

/**
 * Create a basic emergency grid
 * 
 * This function creates a simple grid that should work even when other
 * grid creation functions fail.
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  if (!canvas.width || !canvas.height) {
    logger.error("Cannot create emergency grid: Canvas has invalid dimensions", {
      width: canvas.width,
      height: canvas.height
    });
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const gridSize = 50;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create an enhanced grid with major grid lines and additional features
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createEnhancedGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create enhanced grid: Canvas is null");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const gridSize = 20;
    const majorGridInterval = 5;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const isMajor = i % (gridSize * majorGridInterval) === 0;
      
      const line = new Line([0, i, width, i], {
        stroke: isMajor ? "#c0c0c0" : "#e0e0e0",
        strokeWidth: isMajor ? 1.5 : 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const isMajor = i % (gridSize * majorGridInterval) === 0;
      
      const line = new Line([i, 0, i, height], {
        stroke: isMajor ? "#c0c0c0" : "#e0e0e0",
        strokeWidth: isMajor ? 1.5 : 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating enhanced grid:", error);
    return createBasicEmergencyGrid(canvas);
  }
};

/**
 * Ensure a grid exists on the canvas
 * 
 * If no grid exists, creates a basic emergency grid
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot ensure grid: Canvas is null");
    return [];
  }
  
  try {
    // Check if grid already exists
    const existingGrid = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    if (existingGrid.length > 0) {
      logger.info(`Grid already exists with ${existingGrid.length} objects`);
      return existingGrid as FabricObject[];
    }
    
    // Create new grid
    logger.info("Creating new grid");
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error ensuring grid:", error);
    return [];
  }
};

/**
 * Validate a grid by checking for required properties and objects
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {boolean} Whether the grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas
): boolean => {
  if (!canvas) {
    logger.error("Cannot validate grid: Canvas is null");
    return false;
  }
  
  try {
    // Check canvas dimensions
    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      logger.error("Invalid canvas dimensions for grid", {
        width: canvas.width,
        height: canvas.height
      });
      return false;
    }
    
    // Check for grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    if (gridObjects.length === 0) {
      logger.warn("No grid objects found on canvas");
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error("Error validating grid:", error);
    return false;
  }
};
