
/**
 * Grid basics utilities
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Create a basic grid
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create basic grid: invalid canvas");
      return [];
    }
    
    const gridSize = 20;
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error creating basic grid:", error);
    return [];
  }
};

/**
 * Clear grid from canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {boolean} Whether grid was cleared successfully
 */
export const clearGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  try {
    if (!canvas) return false;
    
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error clearing grid:", error);
    return false;
  }
};

/**
 * Check if canvas is valid for grid creation
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {boolean} Whether canvas is valid for grid creation
 */
export const isCanvasValidForGrid = (
  canvas: FabricCanvas | null
): boolean => {
  if (!canvas) return false;
  
  return !!canvas.width && !!canvas.height;
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
  return createBasicGrid(canvas);
};
