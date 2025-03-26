
/**
 * Utilities for managing canvas objects
 * @module fabric/objects
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";

/**
 * Clear objects from canvas while preserving grid
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to preserve
 */
export const clearCanvasObjects = (canvas: Canvas, gridObjects: FabricObject[]): void => {
  if (!canvas) {
    logger.error("Cannot clear canvas: canvas is null");
    return;
  }
  
  try {
    // Reduce log frequency
    if (gridObjects.length > 0) {
      logger.info(`Clearing canvas objects while preserving ${gridObjects.length} grid objects`);
    }
    
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    // Only log if there's something to remove
    if (objectsToRemove.length > 0) {
      logger.info(`Found ${objectsToRemove.length} objects to remove`);
    }
    
    // Remove them one by one to avoid potential issues with batch operations
    objectsToRemove.forEach(obj => {
      try {
        canvas.remove(obj);
      } catch (err) {
        logger.warn("Error removing object:", err);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Error clearing canvas objects:", error);
  }
};

/**
 * Workaround for missing moveTo in Fabric.js v6+ type definitions
 * This provides a compatibility layer for the functionality
 * 
 * @param {Canvas} canvas The fabric.js canvas instance
 * @param {FabricObject} object The object to move
 * @param {number} index The index to move the object to
 * @returns {boolean} indicating success
 */
export const canvasMoveTo = (canvas: Canvas, object: FabricObject, index: number): boolean => {
  if (!canvas || !object) return false;
  
  try {
    // Try the native moveTo method first (will work if available)
    if (typeof (canvas as any).moveTo === 'function') {
      (canvas as any).moveTo(object, index);
      return true;
    }
    
    // Fallback to manual reordering if moveTo is not available
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(object);
    
    if (currentIndex === -1) return false; // Object not in canvas
    if (currentIndex === index) return true; // Already at target position
    
    // Remove from current position and insert at new position
    canvas.remove(object);
    
    // Get updated list of objects
    const updatedObjects = canvas.getObjects();
    
    // Calculate actual insert position based on current objects
    const insertIndex = Math.min(index, updatedObjects.length);
    
    // Reconstruct the objects array with the object at the new position
    const newObjects = [
      ...updatedObjects.slice(0, insertIndex),
      object,
      ...updatedObjects.slice(insertIndex)
    ];
    
    // Clear and re-add all objects in the new order
    canvas.clear();
    newObjects.forEach(obj => canvas.add(obj));
    
    // Use requestRenderAll instead of renderAll for Fabric.js v6 compatibility
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error in canvasMoveTo:", error);
    return false;
  }
};
