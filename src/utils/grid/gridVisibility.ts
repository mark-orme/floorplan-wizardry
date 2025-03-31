
/**
 * Grid visibility utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Ensure grid objects are visible and attached to canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects to check
 * @returns {boolean} True if fixes were applied
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  try {
    if (!canvas || !gridObjects.length) return false;
    
    let fixesApplied = false;
    
    // Check each grid object
    gridObjects.forEach(obj => {
      // Re-add if not on canvas
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        canvas.sendToBack(obj);
        fixesApplied = true;
      }
      
      // Ensure visibility property is set
      if (!obj.visible) {
        obj.visible = true;
        fixesApplied = true;
      }
    });
    
    // Re-render if any fixes were applied
    if (fixesApplied) {
      canvas.requestRenderAll();
    }
    
    return fixesApplied;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
};

/**
 * Toggle visibility of grid objects
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @param {boolean} visible - Whether grid should be visible
 * @returns {boolean} True if operation was successful
 */
export const setGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  visible: boolean
): boolean => {
  try {
    if (!canvas || !gridObjects.length) return false;
    
    // Set visibility for all grid objects
    gridObjects.forEach(obj => {
      obj.visible = visible;
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error setting grid visibility:", error);
    return false;
  }
};

/**
 * Check if grid objects exist and are visible
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {boolean} True if grid exists and is visible
 */
export const isGridVisible = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  try {
    if (!canvas || !gridObjects.length) return false;
    
    // Check if grid objects are on canvas and visible
    const objectsOnCanvas = gridObjects.filter(obj => 
      canvas.contains(obj) && obj.visible
    );
    
    return objectsOnCanvas.length > 0;
  } catch (error) {
    logger.error("Error checking grid visibility:", error);
    return false;
  }
};
