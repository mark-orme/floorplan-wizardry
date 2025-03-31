
/**
 * Grid renderer utilities
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import logger from "@/utils/logger";

/**
 * Create a complete grid with all features
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    // Use the basic emergency grid for now
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create a simple grid
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
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
