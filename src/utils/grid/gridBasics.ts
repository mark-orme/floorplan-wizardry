
/**
 * Grid basics utilities
 * Core functions for grid creation and management
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import logger from "@/utils/logger";

/**
 * Create a basic grid
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    // Use the basic emergency grid
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error creating basic grid:", error);
    return [];
  }
};

/**
 * Clear grid from canvas
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {boolean} Whether clearing was successful
 */
export const clearGrid = (
  canvas: FabricCanvas
): boolean => {
  try {
    if (!canvas) return false;
    
    // Find and remove all grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.renderAll();
    return true;
  } catch (error) {
    logger.error("Error clearing grid:", error);
    return false;
  }
};

/**
 * Check if canvas is valid for grid creation
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {boolean} Whether canvas is valid
 */
export const isCanvasValidForGrid = (
  canvas: FabricCanvas
): boolean => {
  if (!canvas) return false;
  
  return Boolean(
    canvas.width && 
    canvas.height && 
    canvas.width > 0 && 
    canvas.height > 0
  );
};

/**
 * Create a simple grid
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    // Use the basic emergency grid for now
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error creating simple grid:", error);
    return [];
  }
};
