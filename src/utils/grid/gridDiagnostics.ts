
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import logger from "@/utils/logger";

/**
 * Diagnostic result interface
 */
interface GridDiagnosticResult {
  hasCanvas: boolean;
  canvasReady: boolean;
  canvasDimensions: {
    width: number;
    height: number;
  };
  gridExists: boolean;
  gridCount: number;
  gridObjectsOnCanvas: number;
  issues: string[];
}

/**
 * Run grid diagnostics
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @returns {GridDiagnosticResult} Diagnostic results
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas
): GridDiagnosticResult => {
  const issues: string[] = [];
  
  // Check if canvas exists
  if (!canvas) {
    issues.push("Canvas is null or undefined");
    return {
      hasCanvas: false,
      canvasReady: false,
      canvasDimensions: { width: 0, height: 0 },
      gridExists: false,
      gridCount: 0,
      gridObjectsOnCanvas: 0,
      issues
    };
  }
  
  // Check canvas dimensions
  const width = canvas.width || 0;
  const height = canvas.height || 0;
  
  if (width <= 0 || height <= 0) {
    issues.push(`Invalid canvas dimensions: ${width}x${height}`);
  }
  
  // Check grid objects
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => obj.objectType === 'grid');
  
  if (gridObjects.length === 0) {
    issues.push("No grid objects found on canvas");
  }
  
  return {
    hasCanvas: true,
    canvasReady: width > 0 && height > 0,
    canvasDimensions: { width, height },
    gridExists: gridObjects.length > 0,
    gridCount: gridObjects.length,
    gridObjectsOnCanvas: gridObjects.length,
    issues
  };
};

/**
 * Apply grid fixes based on diagnostic results
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {GridDiagnosticResult} results - Diagnostic results
 * @returns {boolean} Whether fixes were applied
 */
export const applyGridFixes = (
  canvas: FabricCanvas,
  results: GridDiagnosticResult
): boolean => {
  if (!canvas) return false;
  
  // If no grid objects, create emergency grid
  if (!results.gridExists) {
    logger.info("Creating emergency grid during fix");
    const newGrid = createBasicEmergencyGrid(canvas);
    return newGrid.length > 0;
  }
  
  return true;
};

/**
 * Emergency grid fix
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const emergencyGridFix = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) return [];
  
  // Clear any existing grid objects
  const existingGrid = canvas.getObjects().filter(obj => 
    obj.objectType === 'grid'
  );
  
  existingGrid.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Create new grid
  return createBasicEmergencyGrid(canvas);
};
