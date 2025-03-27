
/**
 * Grid debug utilities
 * Provides functions for debugging grid issues
 * @module grid/gridDebugUtils
 */

import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";

/**
 * Dump grid state to console for debugging
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas) {
    console.warn("Cannot dump grid state: Canvas is null");
    return;
  }
  
  const allObjects = canvas.getObjects();
  const gridObjects = gridLayerRef.current;
  
  console.log("Canvas state:", {
    width: canvas.width,
    height: canvas.height,
    objectCount: allObjects.length,
    gridObjectCount: Array.isArray(gridObjects) ? gridObjects.length : 0
  });
  
  console.log("Grid objects:", 
    Array.isArray(gridObjects) ? gridObjects.length : 0, 
    "items");
  
  if (Array.isArray(gridObjects) && gridObjects.length > 0) {
    console.log("First grid object:", gridObjects[0]);
  } else {
    console.warn("No grid objects found");
  }
};

/**
 * Create a basic emergency grid as a fallback
 * Used when normal grid creation fails
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    logger.warn("Creating emergency grid");
    console.warn("Creating basic emergency grid as fallback");
    
    // Clear any existing grid objects from ref
    if (Array.isArray(gridLayerRef.current)) {
      gridLayerRef.current = [];
    } else {
      gridLayerRef.current = [];
    }
    
    // Create minimal grid lines (fewer than normal grid)
    const gridSize = 50; // Larger spacing for emergency grid
    const gridColor = "#cccccc"; // Light gray for emergency grid
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Canvas.Line([x, 0, x, height], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Canvas.Line([0, y, width, y], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    // Update grid layer reference
    gridLayerRef.current = gridObjects;
    
    console.log(`Created emergency grid with ${gridObjects.length} lines`);
    
    // Force canvas render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};
