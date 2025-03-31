
/**
 * Grid validation utilities
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Validate canvas for grid rendering
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvas = (
  canvas: FabricCanvas
): boolean => {
  if (!canvas) {
    logger.error("Canvas is null or undefined");
    return false;
  }
  
  if (!canvas.width || !canvas.height) {
    logger.error("Canvas has invalid dimensions", {
      width: canvas.width,
      height: canvas.height
    });
    return false;
  }
  
  return true;
};

/**
 * Validate grid state
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @returns {Object} Validation results
 */
export const validateGridState = (
  canvas: FabricCanvas
): {valid: boolean, issues: string[]} => {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push("Canvas is null or undefined");
    return { valid: false, issues };
  }
  
  if (!canvas.width || !canvas.height) {
    issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  const gridObjects = canvas.getObjects().filter(obj => 
    obj.objectType === 'grid'
  );
  
  if (gridObjects.length === 0) {
    issues.push("No grid objects found");
  } else if (gridObjects.length < 10) {
    issues.push(`Grid appears incomplete: only ${gridObjects.length} objects found`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};
