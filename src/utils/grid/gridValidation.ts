
/**
 * Grid validation utilities
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Validate canvas for grid creation
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {boolean} Whether canvas is valid for grid creation
 */
export const validateCanvas = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error("Cannot validate canvas: Canvas is null");
    return false;
  }
  
  if (!canvas.width || !canvas.height) {
    logger.error("Invalid canvas dimensions", { width: canvas.width, height: canvas.height });
    return false;
  }
  
  return true;
};

/**
 * Validate grid state
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {object} Validation result with diagnostics
 */
export const validateGridState = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): { 
  valid: boolean; 
  objectCount: number;
  onCanvas: number;
  visible: number;
  issues: string[];
} => {
  const result = {
    valid: false,
    objectCount: gridObjects.length,
    onCanvas: 0,
    visible: 0,
    issues: [] as string[]
  };
  
  if (!canvas) {
    result.issues.push("Canvas is null");
    return result;
  }
  
  if (!gridObjects.length) {
    result.issues.push("No grid objects found");
    return result;
  }
  
  // Check which objects are on canvas
  const canvasObjects = canvas.getObjects();
  
  result.onCanvas = gridObjects.filter(obj => 
    canvasObjects.includes(obj)
  ).length;
  
  result.visible = gridObjects.filter(obj => 
    obj.visible && canvasObjects.includes(obj)
  ).length;
  
  // Record issues
  if (result.onCanvas < result.objectCount) {
    result.issues.push(`${result.objectCount - result.onCanvas} grid objects missing from canvas`);
  }
  
  if (result.visible < result.onCanvas) {
    result.issues.push(`${result.onCanvas - result.visible} grid objects on canvas but not visible`);
  }
  
  result.valid = result.issues.length === 0;
  
  return result;
};
