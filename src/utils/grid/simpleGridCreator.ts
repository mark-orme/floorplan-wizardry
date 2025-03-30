
/**
 * Simple grid creator utility
 * Creates a basic grid on canvas with reliable mechanism
 * @module utils/grid/simpleGridCreator
 */
import { Canvas, Object as FabricObject } from "fabric";
import { createCompleteGrid, createBasicEmergencyGrid } from "./gridCreationUtils";
import logger from "@/utils/logger";

/**
 * Creates a reliable grid on canvas with fallback mechanism
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridObjectsRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: Canvas,
  gridObjectsRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn("Cannot create grid: Canvas is invalid or has zero dimensions");
    return [];
  }
  
  try {
    logger.info("Creating reliable grid");
    
    // Try to create complete grid first
    const gridObjects = createCompleteGrid(canvas);
    
    if (gridObjects.length > 0) {
      // Store grid objects in ref
      if (gridObjectsRef) {
        gridObjectsRef.current = gridObjects;
      }
      return gridObjects;
    }
    
    // If complete grid creation failed, try emergency grid
    logger.warn("Complete grid creation failed, trying emergency grid");
    const emergencyGrid = createBasicEmergencyGrid(canvas);
    
    // Store emergency grid objects in ref
    if (gridObjectsRef) {
      gridObjectsRef.current = emergencyGrid;
    }
    
    return emergencyGrid;
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    
    // If all else fails, return empty array
    return [];
  }
};
