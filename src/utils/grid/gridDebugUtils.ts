
/**
 * Grid debug utilities
 * Provides tools for diagnosing and fixing grid-related issues
 * @module grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";

/**
 * Dump grid state for debugging
 * @param {FabricCanvas} canvas - The Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 */
export const dumpGridState = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  console.group("Grid State Dump");
  console.log("Canvas:", {
    width: canvas.width,
    height: canvas.height,
    objectCount: canvas.getObjects().length,
    zoom: canvas.getZoom()
  });
  
  console.log("Grid objects:", {
    count: gridObjects.length,
    visible: gridObjects.filter(o => o.visible).length,
    objectTypes: gridObjects.map(o => o.type).filter((v, i, a) => a.indexOf(v) === i)
  });
  
  console.log("Grid objects on canvas:", gridObjects.filter(o => canvas.contains(o)).length);
  console.groupEnd();
};

/**
 * Create basic grid for emergency situations
 * Creates a simple grid when other methods fail
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas
 * @returns {FabricObject[]} - Created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  logger.warn("Creating basic emergency grid");
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += 100) {
      const line = new Line([0, y, width, y], {
        stroke: "#cccccc",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += 100) {
      const line = new Line([x, 0, x, height], {
        stroke: "#cccccc",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Force render
    canvas.requestRenderAll();
    
    logger.info(`Created ${gridObjects.length} grid objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Force grid creation
 * Removes existing grid and creates a new one
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas
 * @returns {FabricObject[]} - Created grid objects
 */
export const forceCreateGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot force create grid: Canvas is null");
    return [];
  }
  
  try {
    // Get all grid objects
    const existingGridObjects = canvas.getObjects().filter(obj => 
      obj.objectType === "grid"
    );
    
    // Remove them
    existingGridObjects.forEach(obj => {
      try {
        canvas.remove(obj);
      } catch (error) {
        console.error("Error removing grid object:", error);
      }
    });
    
    // Create new emergency grid
    const newGrid = createBasicEmergencyGrid(canvas);
    
    // Force render
    canvas.requestRenderAll();
    
    return newGrid;
  } catch (error) {
    logger.error("Error in forceCreateGrid:", error);
    return [];
  }
};

// Diagnostic utilities
export const gridDebugStats = () => {
  return {
    timestamp: new Date().toISOString(),
    memoryUsage: window.performance && window.performance.memory 
      ? window.performance.memory 
      : { totalJSHeapSize: 'unavailable' }
  };
};

export const diagnoseGridFailure = (canvas: FabricCanvas) => {
  return {
    canvasValid: !!canvas,
    canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
    objectCount: canvas ? canvas.getObjects().length : 0,
    gridObjectCount: canvas ? canvas.getObjects().filter(obj => obj.objectType === 'grid').length : 0
  };
};
