
/**
 * Grid debug utilities
 * Provides debugging tools for grid issues
 * @module grid/gridDebugUtils
 */

import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";

/**
 * Dump grid state to console for debugging
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 */
export const dumpGridState = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) {
    console.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  console.group("Grid State Dump");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
  console.log("Canvas objects total:", canvas.getObjects().length);
  console.log("Grid objects in array:", gridObjects.length);
  
  const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  console.log("Grid objects on canvas:", gridOnCanvas.length);
  
  const missingObjects = gridObjects.filter(obj => !canvas.contains(obj));
  console.log("Missing grid objects:", missingObjects.length);
  
  if (missingObjects.length > 0) {
    console.log("First missing object:", missingObjects[0]);
  }
  
  console.groupEnd();
};

/**
 * Create a basic emergency grid for debugging
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Cannot create emergency debug grid: Invalid canvas");
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const gridSize = 100; // Larger size for better visibility in debug
  
  // Create horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    const line = new Line([0, y, canvas.width, y], {
      stroke: '#ff5555', // Red for debugging
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectType: 'grid-debug'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    const line = new Line([x, 0, x, canvas.height], {
      stroke: '#ff5555', // Red for debugging
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectType: 'grid-debug'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  canvas.renderAll();
  console.log(`Created ${gridObjects.length} emergency debug grid objects`);
  
  return gridObjects;
};

/**
 * Force create grid for debugging
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  // Clean existing grid objects
  const existingGrid = canvas.getObjects().filter(obj => 
    obj.objectType === 'grid' || obj.objectType === 'grid-debug'
  );
  
  existingGrid.forEach(obj => canvas.remove(obj));
  
  // Create debug grid
  return createBasicEmergencyGrid(canvas);
};

/**
 * Get memory usage statistics
 * @returns {object} Memory usage statistics
 */
export const getMemoryUsage = (): { total?: number, used?: number, limit?: number } => {
  if (typeof performance === 'undefined' || !performance.memory) {
    return {};
  }
  
  return {
    total: performance.memory?.totalJSHeapSize,
    used: performance.memory?.usedJSHeapSize,
    limit: performance.memory?.jsHeapSizeLimit
  };
};

/**
 * Get grid debug statistics
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 * @returns {object} Debug statistics
 */
export const gridDebugStats = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): object => {
  if (!canvas) {
    return { error: "Canvas is null" };
  }
  
  const allObjects = canvas.getObjects();
  const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  return {
    canvas: {
      width: canvas.width,
      height: canvas.height,
      objectCount: allObjects.length,
      initialized: canvas.initialized || false
    },
    grid: {
      totalObjects: gridObjects.length,
      objectsOnCanvas: gridOnCanvas.length,
      missing: gridObjects.length - gridOnCanvas.length
    },
    memory: getMemoryUsage()
  };
};

/**
 * Diagnose grid failure 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 * @returns {object} Diagnostic information
 */
export const diagnoseGridFailure = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): object => {
  if (!canvas) {
    return { error: "Canvas is null" };
  }
  
  const diagnostics = gridDebugStats(canvas, gridObjects);
  const issues = [];
  
  // Check canvas dimensions
  if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
    issues.push("Canvas has zero dimensions");
  }
  
  // Check grid objects
  if (gridObjects.length === 0) {
    issues.push("No grid objects in array");
  } else if (gridObjects.filter(obj => canvas.contains(obj)).length === 0) {
    issues.push("No grid objects on canvas");
  }
  
  return {
    diagnostics,
    issues,
    recommendation: issues.length > 0 ? "Recreate grid with valid dimensions" : "Grid appears valid"
  };
};
