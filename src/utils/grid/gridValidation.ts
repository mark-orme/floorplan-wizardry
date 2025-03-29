
/**
 * Grid validation utilities
 * Functions for validating grid state and components
 * @module grid/gridValidation
 */
import { Canvas, Object as FabricObject } from "fabric";
import { throttledLog, throttledError } from "./consoleThrottling";
import { captureError } from "../sentryUtils";

/**
 * Validate canvas for grid creation
 * Checks if canvas is ready for grid creation
 * 
 * @param {Canvas | null | undefined} canvas - The canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export function validateCanvas(canvas: Canvas | null | undefined): boolean {
  if (!canvas) {
    throttledError("Cannot validate null canvas");
    captureError(new Error("Cannot validate null canvas"), "grid-validation", {
      tags: { component: "grid", operation: "validate-canvas" },
      level: "error"
    });
    return false;
  }
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    const dimensions = { width: canvas.width, height: canvas.height };
    throttledError("Canvas has invalid dimensions", dimensions);
    captureError(
      new Error(`Canvas has invalid dimensions: ${JSON.stringify(dimensions)}`),
      "grid-validation", 
      {
        tags: { component: "grid", operation: "validate-dimensions" },
        level: "error",
        extra: { dimensions }
      }
    );
    return false;
  }
  
  return true;
}

/**
 * Check if grid objects are valid
 * 
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} Whether the grid objects are valid
 */
export function validateGridObjects(gridObjects: FabricObject[]): boolean {
  if (!Array.isArray(gridObjects)) {
    throttledError("Grid objects is not an array");
    captureError(
      new Error("Grid objects is not an array"),
      "grid-validation",
      {
        tags: { component: "grid", operation: "validate-objects" },
        level: "error"
      }
    );
    return false;
  }
  
  if (gridObjects.length === 0) {
    throttledLog("Grid objects array is empty");
    captureError(
      new Error("Grid objects array is empty"),
      "grid-validation",
      {
        tags: { component: "grid", operation: "validate-objects" },
        level: "warning" 
      }
    );
    return false;
  }
  
  // Check if all objects have the expected grid properties
  const allValid = gridObjects.every(obj => {
    return obj && obj.get('name') && (obj.get('name') as string).startsWith('grid-');
  });
  
  if (!allValid) {
    throttledError("Some grid objects are invalid");
    captureError(
      new Error("Some grid objects are invalid"),
      "grid-validation",
      {
        tags: { component: "grid", operation: "validate-objects" },
        level: "error",
        extra: {
          objectCount: gridObjects.length,
          invalidCount: gridObjects.filter(obj => 
            !(obj && obj.get('name') && (obj.get('name') as string).startsWith('grid-'))
          ).length
        }
      }
    );
    return false;
  }
  
  return true;
}

/**
 * Validate the entire grid state
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {boolean} Whether the grid state is valid
 */
export function validateGridState(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  // First validate canvas
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Then validate grid objects
  if (!validateGridObjects(gridObjects)) {
    return false;
  }
  
  // Check if grid objects exist on canvas
  const allOnCanvas = gridObjects.every(obj => canvas.contains(obj));
  
  if (!allOnCanvas) {
    throttledError("Some grid objects are not on canvas");
    captureError(
      new Error("Some grid objects are not on canvas"),
      "grid-validation",
      {
        tags: { component: "grid", operation: "validate-state" },
        level: "error",
        extra: {
          totalObjects: gridObjects.length,
          missingObjects: gridObjects.filter(obj => !canvas.contains(obj)).length,
          canvasObjectCount: canvas.getObjects().length
        }
      }
    );
    return false;
  }
  
  return true;
}

/**
 * Count grid objects on canvas
 * 
 * @param {Canvas} canvas - The canvas instance
 * @returns {number} Number of grid objects on canvas
 */
export function countGridObjectsOnCanvas(canvas: Canvas): number {
  if (!validateCanvas(canvas)) {
    return 0;
  }
  
  let gridCount = 0;
  
  canvas.forEachObject(obj => {
    if (obj && obj.get('name') && (obj.get('name') as string).startsWith('grid-')) {
      gridCount++;
    }
  });
  
  return gridCount;
}

/**
 * Detailed grid validation for debugging
 * Provides comprehensive information about grid state
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {Object} Detailed validation results
 */
export function getDetailedGridValidation(
  canvas: Canvas,
  gridObjects: FabricObject[]
): Record<string, any> {
  if (!canvas) {
    return {
      valid: false,
      canvasExists: false,
      reason: "Canvas is null or undefined"
    };
  }
  
  const canvasDimensions = {
    width: canvas.width,
    height: canvas.height,
    zoom: canvas.getZoom?.() || 1,
  };
  
  const canvasValid = validateCanvas(canvas);
  const gridValid = Array.isArray(gridObjects) && gridObjects.length > 0;
  
  const totalCanvasObjects = canvas.getObjects()?.length || 0;
  
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  
  return {
    valid: canvasValid && gridValid && gridObjectsOnCanvas === gridObjects.length,
    canvasExists: !!canvas,
    canvasValid,
    canvasDimensions,
    gridExists: gridValid,
    gridObjectCount: gridObjects.length,
    gridObjectsOnCanvas,
    totalCanvasObjects,
    timestamp: new Date().toISOString()
  };
}
