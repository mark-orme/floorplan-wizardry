
/**
 * Grid debug utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Dump grid state to console
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 */
export const dumpGridState = (
  canvas: FabricCanvas
): void => {
  if (!canvas) {
    logger.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => obj.objectType === 'grid');
  
  logger.info("Grid state:", {
    canvasDimensions: {
      width: canvas.width,
      height: canvas.height
    },
    totalObjects: allObjects.length,
    gridObjects: gridObjects.length,
    timestamp: new Date().toISOString()
  });
};

/**
 * Force create grid without checks
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    // Log that this is a forced grid creation
    logger.warn("Forcing grid creation without checks");
    
    // Create grid lines
    const gridObjects: FabricObject[] = [];
    const gridSize = 50;
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Clear any existing grid objects
    const existingGrid = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    existingGrid.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Function to create a line
    const createLine = (coords: number[], isMajor = false) => {
      const line = new fabric.Line(coords, {
        stroke: isMajor ? '#c0c0c0' : '#e0e0e0',
        strokeWidth: isMajor ? 1.5 : 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    };
    
    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const isMajor = i % (gridSize * 5) === 0;
      createLine([0, i, width, i], isMajor);
    }
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const isMajor = i % (gridSize * 5) === 0;
      createLine([i, 0, i, height], isMajor);
    }
    
    canvas.renderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error forcing grid creation:", error);
    return [];
  }
};
