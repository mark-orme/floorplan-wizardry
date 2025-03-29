
/**
 * Grid utilities
 * Functions for working with grid objects and canvas
 * @module utils/grid/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { captureError } from "../sentryUtils";
import { ExtendedFabricObject } from "@/types/fabricTypes";
import logger from "@/utils/logger";

/**
 * Validate if canvas is suitable for grid creation
 * 
 * @param {FabricCanvas} canvas - Canvas to validate
 * @returns {boolean} Whether canvas is valid for grid
 */
export const validateCanvasForGrid = (
  canvas: FabricCanvas | null
): boolean => {
  if (!canvas) {
    logger.error("Cannot validate null canvas");
    return false;
  }
  
  try {
    // Check if canvas has valid dimensions
    const hasValidDimensions = !!(
      canvas.width && 
      canvas.height && 
      canvas.width > 0 && 
      canvas.height > 0
    );
    
    // Check if canvas is disposed
    const isDisposed = !!(canvas as any).disposed;
    
    // Log validation results
    console.log("Grid canvas validation:", {
      hasValidDimensions,
      isDisposed,
      width: canvas.width,
      height: canvas.height
    });
    
    return hasValidDimensions && !isDisposed;
  } catch (error) {
    logger.error("Error validating canvas for grid:", error);
    captureError(error, "grid-canvas-validation-error", {
      level: "error",
      tags: {
        component: "gridUtils",
        operation: "validateCanvas"
      }
    });
    return false;
  }
};

/**
 * Get grid object counts by type
 * 
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 * @returns {Object} Counts of different grid object types
 */
export const getGridObjectCounts = (
  gridObjects: FabricObject[]
): { small: number; large: number; total: number } => {
  try {
    const counts = {
      small: 0,
      large: 0,
      total: gridObjects.length
    };
    
    gridObjects.forEach(obj => {
      const typedObj = obj as ExtendedFabricObject;
      if (typedObj.gridType === 'small') {
        counts.small++;
      } else if (typedObj.gridType === 'large') {
        counts.large++;
      }
    });
    
    return counts;
  } catch (error) {
    logger.error("Error counting grid objects:", error);
    captureError(error, "grid-object-count-error", {
      level: "warning",
      tags: {
        component: "gridUtils",
        operation: "countObjects"
      }
    });
    return { small: 0, large: 0, total: 0 };
  }
};

/**
 * Check if grid is present and complete on canvas
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {Object} Grid completeness information
 */
export const checkGridCompleteness = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): { complete: boolean; onCanvas: number; total: number; report: string } => {
  if (!canvas || !gridObjects.length) {
    return { 
      complete: false, 
      onCanvas: 0, 
      total: gridObjects.length,
      report: "No canvas or grid objects"
    };
  }
  
  try {
    // Count objects still on canvas
    const objectsOnCanvas = gridObjects.filter(obj => {
      try {
        return canvas.contains(obj);
      } catch (error) {
        return false;
      }
    }).length;
    
    // Check if all expected grid objects are present
    const smallGridCount = gridObjects.filter(obj => 
      (obj as ExtendedFabricObject).gridType === 'small'
    ).length;
    
    const largeGridCount = gridObjects.filter(obj => 
      (obj as ExtendedFabricObject).gridType === 'large'
    ).length;
    
    const isComplete = objectsOnCanvas === gridObjects.length && 
                       objectsOnCanvas > 0 &&
                       smallGridCount > 0 &&
                       largeGridCount > 0;
    
    // Create report
    const report = isComplete
      ? `Grid complete: ${objectsOnCanvas}/${gridObjects.length} objects on canvas`
      : `Grid incomplete: only ${objectsOnCanvas}/${gridObjects.length} objects on canvas`;
    
    return {
      complete: isComplete,
      onCanvas: objectsOnCanvas,
      total: gridObjects.length,
      report
    };
  } catch (error) {
    logger.error("Error checking grid completeness:", error);
    captureError(error, "grid-completeness-check-error", {
      level: "warning",
      tags: {
        component: "gridUtils",
        operation: "checkCompleteness"
      }
    });
    
    return {
      complete: false,
      onCanvas: 0,
      total: gridObjects.length,
      report: `Error checking grid: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Get detailed grid status report
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 * @returns {Object} Detailed grid status
 */
export const getGridStatus = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): Record<string, any> => {
  try {
    const status: Record<string, any> = {
      timestamp: new Date().toISOString(),
      gridExists: gridObjects.length > 0,
      canvasValid: validateCanvasForGrid(canvas)
    };
    
    if (canvas) {
      status.canvas = {
        width: canvas.width,
        height: canvas.height,
        objectCount: canvas.getObjects().length,
        disposed: !!(canvas as any).disposed
      };
    } else {
      status.canvas = "No canvas";
    }
    
    if (gridObjects.length) {
      const completeness = checkGridCompleteness(canvas, gridObjects);
      const counts = getGridObjectCounts(gridObjects);
      
      status.grid = {
        total: gridObjects.length,
        onCanvas: completeness.onCanvas,
        complete: completeness.complete,
        smallGridLines: counts.small,
        largeGridLines: counts.large
      };
    } else {
      status.grid = "No grid objects";
    }
    
    return status;
  } catch (error) {
    logger.error("Error getting grid status:", error);
    captureError(error, "grid-status-error", {
      level: "warning",
      tags: {
        component: "gridUtils",
        operation: "getStatus"
      }
    });
    
    return {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };
  }
};
