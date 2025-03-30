/**
 * Canvas grid utilities
 * @module utils/canvasGrid
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid, createEnhancedGrid } from "./gridCreationUtils";
import logger from "./logger";

/**
 * Grid creation options
 */
export interface GridOptions {
  /** Use enhanced grid with major/minor lines */
  useEnhanced?: boolean;
  /** Show debug information */
  debug?: boolean;
  /** Grid color */
  color?: string;
  /** Grid line width */
  lineWidth?: number;
}

/**
 * Create grid on canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {GridOptions} options - Grid options
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGrid = (
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  const { useEnhanced = true, debug = false } = options;
  
  // Log grid creation
  if (debug) {
    logger.info(`Creating ${useEnhanced ? 'enhanced' : 'basic'} grid`);
    console.log(`Creating ${useEnhanced ? 'enhanced' : 'basic'} grid`, {
      width: canvas.width,
      height: canvas.height
    });
  }
  
  try {
    // Create grid based on options
    if (useEnhanced) {
      return createEnhancedGrid(canvas);
    } else {
      return createBasicEmergencyGrid(canvas);
    }
  } catch (error) {
    logger.error("Error creating grid:", error);
    
    // Fallback to basic grid on error
    try {
      return createBasicEmergencyGrid(canvas);
    } catch (fallbackError) {
      logger.error("Fallback grid creation also failed:", fallbackError);
      return [];
    }
  }
};

/**
 * Remove grid from canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to remove
 * @returns {void}
 */
export const removeGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) {
    logger.error("Cannot remove grid: Canvas is null");
    return;
  }
  
  // Remove each grid object
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  // Force render
  canvas.requestRenderAll();
  
  logger.info(`Removed ${gridObjects.length} grid objects`);
};

/**
 * Toggle grid visibility
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to toggle
 * @param {boolean} visible - Whether grid should be visible
 * @returns {void}
 */
export const toggleGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  visible: boolean
): void => {
  if (!canvas) {
    logger.error("Cannot toggle grid: Canvas is null");
    return;
  }
  
  // Set visibility for each grid object
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  // Force render
  canvas.requestRenderAll();
  
  logger.info(`Set grid visibility to ${visible}`);
};
