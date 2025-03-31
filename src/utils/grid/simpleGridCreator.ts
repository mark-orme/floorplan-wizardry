
/**
 * Simple grid creator
 * @module utils/grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import logger from "@/utils/logger";

/**
 * Create reliable grid
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    // Use the basic emergency grid for now
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    return [];
  }
};

/**
 * Ensure grid visibility
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {boolean} Whether operation was successful
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas
): boolean => {
  try {
    if (!canvas) return false;
    
    const gridObjects = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    // If no grid objects, nothing to make visible
    if (gridObjects.length === 0) return false;
    
    // Make all grid objects visible
    gridObjects.forEach(obj => {
      obj.set('visible', true);
    });
    
    canvas.renderAll();
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
};
