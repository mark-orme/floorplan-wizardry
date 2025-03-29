
/**
 * Grid Utilities
 * Centralized utilities for grid operations, error handling, and validation
 * @module utils/grid/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";

/**
 * Validate if the canvas is ready for grid operations
 * @param {FabricCanvas} canvas - Canvas to validate
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvasForGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error("Grid operation failed: Canvas is null");
    return false;
  }
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    logger.error("Grid operation failed: Canvas has invalid dimensions", {
      width: canvas.width,
      height: canvas.height
    });
    return false;
  }
  
  return true;
};

/**
 * Check if grid objects are properly configured
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} Whether grid objects are valid
 */
export const validateGridObjects = (gridObjects: FabricObject[]): boolean => {
  if (!Array.isArray(gridObjects)) {
    logger.error("Grid objects validation failed: Not an array");
    return false;
  }
  
  if (gridObjects.length === 0) {
    logger.warn("Grid objects validation: Empty grid");
    return false;
  }
  
  // Check object types
  const validObjects = gridObjects.every(obj => 
    obj && (obj.type === 'line' || obj.type === 'rect' || obj.type === 'text')
  );
  
  if (!validObjects) {
    logger.error("Grid objects validation failed: Invalid object types");
    return false;
  }
  
  return true;
};

/**
 * Count grid objects on canvas
 * @param {FabricCanvas} canvas - The canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects reference
 * @returns {Object} Counts of grid objects
 */
export const countGridObjects = (
  canvas: FabricCanvas, 
  gridObjects: FabricObject[]
): { total: number; onCanvas: number; missing: number } => {
  if (!validateCanvasForGrid(canvas)) {
    return { total: 0, onCanvas: 0, missing: 0 };
  }
  
  const total = gridObjects.length;
  const onCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  
  return {
    total,
    onCanvas,
    missing: total - onCanvas
  };
};

/**
 * Handle grid errors consistently
 * @param {unknown} error - The error that occurred
 * @param {string} context - Error context
 * @param {boolean} showToast - Whether to show a toast notification
 */
export const handleGridError = (
  error: unknown, 
  context: string, 
  showToast = true
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Log error
  logger.error(`Grid error (${context}):`, error);
  console.error(`Grid error (${context}):`, error);
  
  // Show toast if enabled
  if (showToast) {
    toast.error(`Grid error: ${errorMessage}`, {
      id: `grid-error-${context}`,
      duration: 5000
    });
  }
};

/**
 * Diagnose grid health and provide human-readable status
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects
 * @returns {Object} Grid health diagnostics
 */
export const getGridHealth = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): { 
  status: 'healthy' | 'degraded' | 'failed';
  message: string;
  details: Record<string, any>;
} => {
  if (!canvas) {
    return {
      status: 'failed',
      message: 'Canvas is not available',
      details: { canvasExists: false }
    };
  }
  
  const canvasValid = validateCanvasForGrid(canvas);
  if (!canvasValid) {
    return {
      status: 'failed',
      message: 'Canvas has invalid dimensions',
      details: {
        canvasExists: true,
        width: canvas.width,
        height: canvas.height
      }
    };
  }
  
  const counts = countGridObjects(canvas, gridObjects);
  
  if (counts.total === 0) {
    return {
      status: 'failed',
      message: 'No grid objects exist',
      details: counts
    };
  }
  
  if (counts.onCanvas === 0) {
    return {
      status: 'failed',
      message: 'Grid exists but no objects are on canvas',
      details: counts
    };
  }
  
  if (counts.missing > 0) {
    return {
      status: 'degraded',
      message: `${counts.missing} grid objects are missing from canvas`,
      details: counts
    };
  }
  
  return {
    status: 'healthy',
    message: 'Grid is healthy',
    details: counts
  };
};
