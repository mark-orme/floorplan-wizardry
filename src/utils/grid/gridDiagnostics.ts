
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import { createBasicEmergencyGrid } from "./gridRenderers";
import logger from "@/utils/logger";

/**
 * Interface for grid diagnostic result
 */
interface GridDiagnosticResult {
  /** Whether a canvas is available */
  hasCanvas: boolean;
  /** Whether the canvas is ready */
  canvasReady: boolean;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Whether grid exists */
  gridExists: boolean;
  /** Grid object count */
  gridCount: number;
  /** Grid objects on canvas */
  gridObjectsOnCanvas: number;
  /** Issues found */
  issues: string[];
}

/**
 * Run grid diagnostics
 * @param {Canvas} canvas - The fabric canvas instance
 * @returns {GridDiagnosticResult} Diagnostic results
 */
export const runGridDiagnostics = (canvas: Canvas): GridDiagnosticResult => {
  const result: GridDiagnosticResult = {
    hasCanvas: !!canvas,
    canvasReady: false,
    canvasDimensions: { width: 0, height: 0 },
    gridExists: false,
    gridCount: 0,
    gridObjectsOnCanvas: 0,
    issues: []
  };
  
  if (!canvas) {
    result.issues.push(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return result;
  }
  
  // Canvas dimensions
  result.canvasDimensions = {
    width: canvas.width || 0,
    height: canvas.height || 0
  };
  
  if (result.canvasDimensions.width <= 0 || result.canvasDimensions.height <= 0) {
    result.issues.push(GRID_ERROR_MESSAGES.CANVAS_INVALID);
  } else {
    result.canvasReady = true;
  }
  
  // Check grid objects
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => obj.objectType === 'grid');
  
  result.gridExists = gridObjects.length > 0;
  result.gridCount = gridObjects.length;
  result.gridObjectsOnCanvas = gridObjects.length;
  
  if (!result.gridExists) {
    result.issues.push(GRID_ERROR_MESSAGES.GRID_EMPTY);
  }
  
  return result;
};

/**
 * Apply grid fixes based on diagnostic results
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {GridDiagnosticResult} diagnosticResult - Diagnostic results
 * @returns {FabricObject[]} Fixed grid objects
 */
export const applyGridFixes = (
  canvas: Canvas, 
  diagnosticResult: GridDiagnosticResult
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot apply grid fixes: Canvas is null");
    return [];
  }
  
  if (!diagnosticResult.hasCanvas || !diagnosticResult.canvasReady) {
    logger.error("Cannot apply grid fixes: Canvas not ready");
    return [];
  }
  
  // If grid doesn't exist, create it
  if (!diagnosticResult.gridExists || diagnosticResult.gridCount === 0) {
    logger.info("Creating new grid as part of grid fixes");
    return createBasicEmergencyGrid(canvas);
  }
  
  // If grid exists but has issues, try to fix them
  const existingGridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  
  // Ensure grid is at the back
  existingGridObjects.forEach(obj => {
    canvas.sendObjectToBack(obj);
  });
  
  canvas.renderAll();
  logger.info(`Applied grid fixes to ${existingGridObjects.length} grid objects`);
  
  return existingGridObjects;
};

/**
 * Emergency grid fix when all else fails
 * @param {Canvas} canvas - The fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const emergencyGridFix = (canvas: Canvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot perform emergency grid fix: Canvas is null");
    return [];
  }
  
  logger.warn("Performing emergency grid fix");
  
  // Remove all existing grid objects
  const existingGridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  existingGridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Create a new minimal grid
  const gridObjects = createBasicEmergencyGrid(canvas);
  
  logger.info(`Emergency grid fix created ${gridObjects.length} new grid objects`);
  
  return gridObjects;
};
