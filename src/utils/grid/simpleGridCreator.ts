
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

/**
 * Ensures grid visibility on canvas
 * Checks if grid is visible and attempts to fix if not
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Success status
 */
export const ensureGridVisibility = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    const gridObjects = gridLayerRef.current;
    
    // If no grid objects, nothing to make visible
    if (!gridObjects || gridObjects.length === 0) {
      return false;
    }
    
    // Check if grid objects are on canvas
    let objectsFound = 0;
    let objectsAdded = 0;
    
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        objectsFound++;
        
        // Make sure object is visible
        if (!obj.visible) {
          obj.visible = true;
          canvas.requestRenderAll();
        }
      } else {
        // Add object back to canvas if missing
        try {
          canvas.add(obj);
          // Use sendObjectToBack instead of sendToBack for newer Fabric.js versions
          if (canvas.sendObjectToBack) {
            canvas.sendObjectToBack(obj);
          }
          objectsAdded++;
        } catch (error) {
          logger.error("Error adding grid object back to canvas:", error);
        }
      }
    });
    
    if (objectsAdded > 0) {
      canvas.requestRenderAll();
      logger.info(`Added ${objectsAdded} missing grid objects back to canvas`);
    }
    
    return objectsFound + objectsAdded > 0;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
};
