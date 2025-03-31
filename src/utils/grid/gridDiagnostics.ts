
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { createBasicEmergencyGrid } from "../gridCreationUtils";

/**
 * Run grid diagnostics
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {Record<string, any>} Diagnostics result
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): Record<string, any> => {
  if (!canvas) {
    return {
      hasCanvas: false,
      canvasReady: false,
      gridExists: false,
      issues: ["Canvas is null"]
    };
  }
  
  const result = {
    hasCanvas: true,
    canvasReady: canvas.width > 0 && canvas.height > 0,
    canvasDimensions: { width: canvas.width, height: canvas.height },
    gridExists: gridObjects.length > 0,
    gridCount: gridObjects.length,
    issues: [] as string[]
  };
  
  // Check canvas dimensions
  if (!result.canvasReady) {
    result.issues.push("Canvas has invalid dimensions");
  }
  
  // Check grid objects
  if (!result.gridExists) {
    result.issues.push("No grid objects found");
  } else {
    // Check which grid objects are on canvas
    const canvasObjects = canvas.getObjects();
    const gridObjectsOnCanvas = gridObjects.filter(obj => 
      canvasObjects.includes(obj)
    );
    
    result.gridObjectsOnCanvas = gridObjectsOnCanvas.length;
    
    if (gridObjectsOnCanvas.length < gridObjects.length) {
      result.issues.push(`${gridObjects.length - gridObjectsOnCanvas.length} grid objects missing from canvas`);
    }
  }
  
  return result;
};

/**
 * Apply grid fixes
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {boolean} Whether fixes were applied
 */
export const applyGridFixes = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  let fixesApplied = false;
  
  // Check if grid exists
  if (gridObjects.length === 0) {
    // Create new grid
    const newGridObjects = createBasicEmergencyGrid(canvas);
    
    // Update gridObjects array with new objects
    gridObjects.push(...newGridObjects);
    
    fixesApplied = true;
  } else {
    // Check which grid objects are on canvas
    const canvasObjects = canvas.getObjects();
    
    gridObjects.forEach(obj => {
      if (!canvasObjects.includes(obj)) {
        canvas.add(obj);
        canvas.sendToBack(obj);
        fixesApplied = true;
      }
    });
  }
  
  if (fixesApplied) {
    canvas.requestRenderAll();
  }
  
  return fixesApplied;
};

/**
 * Emergency grid fix
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridRef - Reference to grid objects
 * @returns {boolean} Whether emergency fix was applied
 */
export const emergencyGridFix = (
  canvas: FabricCanvas | null,
  gridRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    logger.info("Applying emergency grid fix");
    
    // Clear existing grid objects
    gridRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Create new emergency grid
    const gridObjects = createBasicEmergencyGrid(canvas);
    
    // Update grid reference
    gridRef.current = gridObjects;
    
    canvas.requestRenderAll();
    
    return gridObjects.length > 0;
  } catch (error) {
    logger.error("Error applying emergency grid fix:", error);
    return false;
  }
};
