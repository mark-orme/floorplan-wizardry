
/**
 * Grid Validation Utility
 * Provides comprehensive validation for grid functionality
 * @module utils/grid/gridValidator
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { checkCanvasHealth, trackGridError } from "./gridErrorTracker";
import logger from "../logger";

/**
 * Validate canvas is ready for grid operations
 * @param {FabricCanvas} canvas - The canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export const validateCanvasForGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    trackGridError("Canvas is null or undefined", "canvas-validation");
    return false;
  }
  
  // Check dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    trackGridError(
      `Invalid canvas dimensions: ${canvas.width}x${canvas.height}`,
      "canvas-validation",
      { dimensions: { width: canvas.width, height: canvas.height } }
    );
    return false;
  }
  
  // Check if rendering is available
  if (typeof canvas.renderAll !== 'function') {
    trackGridError("Canvas missing renderAll method", "canvas-validation");
    return false;
  }
  
  // Check if context exists by seeing if objects can be added
  try {
    const testObject = new fabric.Line([0, 0, 1, 1], { visible: false });
    canvas.add(testObject);
    canvas.remove(testObject);
  } catch (error) {
    trackGridError(
      `Canvas context test failed: ${error instanceof Error ? error.message : String(error)}`,
      "canvas-validation"
    );
    return false;
  }
  
  return true;
};

/**
 * Ensure proper tuple type for line coordinates
 * This fixes the type error in gridDiagnostics.ts
 * @param {number[]} coords - Array of coordinates
 * @returns {[number, number, number, number]} Properly typed coordinate tuple
 */
export const ensureCoordsTuple = (coords: number[]): [number, number, number, number] => {
  // Ensure we have exactly 4 elements
  if (coords.length !== 4) {
    const result: [number, number, number, number] = [0, 0, 0, 0];
    
    // Copy available coordinates
    for (let i = 0; i < Math.min(coords.length, 4); i++) {
      result[i] = coords[i];
    }
    
    return result;
  }
  
  // Cast to tuple type
  return coords as [number, number, number, number];
};

/**
 * Validate grid objects
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {Object} Validation results
 */
export const validateGridObjects = (gridObjects: FabricObject[]): Record<string, any> => {
  const results = {
    valid: true,
    count: gridObjects.length,
    issues: [] as string[],
    typeCounts: {} as Record<string, number>
  };
  
  if (gridObjects.length === 0) {
    results.valid = false;
    results.issues.push("No grid objects found");
    return results;
  }
  
  // Count object types
  gridObjects.forEach(obj => {
    const type = obj.type || 'unknown';
    results.typeCounts[type] = (results.typeCounts[type] || 0) + 1;
    
    // Check for invalid objects
    if (!obj.type) {
      results.issues.push("Found object with no type");
      results.valid = false;
    }
  });
  
  return results;
};

/**
 * Perform comprehensive grid health check
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {Object} Health check results
 */
export const checkGridHealth = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): Record<string, any> => {
  const report = {
    timestamp: Date.now(),
    healthy: false,
    canvas: checkCanvasHealth(canvas),
    grid: validateGridObjects(gridObjects),
    suggestedActions: [] as string[]
  };
  
  // Determine overall health
  report.healthy = 
    report.canvas.canvasValid && 
    report.grid.valid && 
    report.canvas.issues.length === 0 && 
    report.grid.issues.length === 0;
  
  // Generate recommended actions
  if (!report.canvas.canvasValid) {
    report.suggestedActions.push("Reset canvas dimensions");
  }
  
  if (gridObjects.length === 0) {
    report.suggestedActions.push("Create new grid objects");
  } else if (report.canvas.canvasValid && canvas) {
    const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
    if (objectsOnCanvas === 0) {
      report.suggestedActions.push("Add existing grid objects to canvas");
    } else if (objectsOnCanvas < gridObjects.length) {
      report.suggestedActions.push("Add missing grid objects to canvas");
    }
  }
  
  return report;
};
