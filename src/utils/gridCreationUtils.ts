
/**
 * Grid creation utilities
 * Simple utilities for creating and validating grid
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import { 
  createGridLayer, 
  createFallbackGrid
} from "./grid/gridCreation";
import { validateCanvas, getDetailedGridValidation } from "./grid/gridValidation";
import { throttledLog, throttledError } from "./grid/consoleThrottling";
import { captureError } from "./sentryUtils";

// Grid creation performance tracking
const gridPerformance = {
  creationAttempts: 0,
  successfulCreations: 0,
  lastAttemptTime: 0,
  lastSuccessTime: 0,
  failureReasons: [] as string[],
};

/**
 * Create a complete grid with both small and large scale lines
 * Wrapper for gridCreation.createGridLayer
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export function createCompleteGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  if (!validateCanvas(canvas)) {
    const error = new Error("Invalid canvas for grid creation");
    captureError(error, "grid-creation", {
      tags: { component: "grid", operation: "create-complete" },
      level: "error",
      extra: { 
        canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
        performanceStats: { ...gridPerformance }
      }
    });
    throw error;
  }
  
  // Track performance
  gridPerformance.creationAttempts++;
  gridPerformance.lastAttemptTime = Date.now();
  
  try {
    throttledLog("Creating complete grid");
    const gridObjects = createGridLayer(canvas, gridLayerRef);
    
    // Log successful creation
    if (gridObjects && gridObjects.length > 0) {
      gridPerformance.successfulCreations++;
      gridPerformance.lastSuccessTime = Date.now();
      
      // Report success to Sentry for tracking
      captureError(
        new Error("Grid created successfully"),
        "grid-creation-success",
        {
          level: "info",
          tags: { component: "grid", operation: "create-complete", status: "success" },
          extra: {
            objectCount: gridObjects.length,
            canvasDimensions: { width: canvas.width, height: canvas.height },
            performanceStats: { ...gridPerformance }
          }
        }
      );
    } else {
      // Empty grid objects array is suspicious
      const warning = new Error("Grid creation returned empty objects array");
      gridPerformance.failureReasons.push("empty_objects_array");
      captureError(warning, "grid-creation-warning", {
        level: "warning",
        tags: { component: "grid", operation: "create-complete", status: "empty" },
        extra: { performanceStats: { ...gridPerformance } }
      });
    }
    
    return gridObjects;
  } catch (error) {
    // Track failure reason
    const errorMessage = error instanceof Error ? error.message : String(error);
    gridPerformance.failureReasons.push(errorMessage);
    
    // Report detailed error to Sentry
    captureError(error, "grid-creation-failure", {
      level: "error",
      tags: { component: "grid", operation: "create-complete", status: "failure" },
      extra: {
        canvasDimensions: { width: canvas.width, height: canvas.height },
        gridLayerRefExists: !!gridLayerRef,
        gridLayerLength: gridLayerRef?.current?.length || 0,
        performanceStats: { ...gridPerformance }
      }
    });
    
    throw error;
  }
}

/**
 * Create a basic emergency grid
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export function createBasicEmergencyGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  if (!validateCanvas(canvas)) {
    const error = new Error("Invalid canvas for emergency grid creation");
    captureError(error, "grid-creation", {
      tags: { component: "grid", operation: "create-emergency" },
      level: "error",
      extra: { 
        canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
        performanceStats: { ...gridPerformance }
      }
    });
    throw error;
  }
  
  throttledLog("Creating basic emergency grid");
  
  try {
    return createFallbackGrid(canvas, gridLayerRef);
  } catch (error) {
    captureError(error, "grid-emergency-failure", {
      level: "error",
      tags: { component: "grid", operation: "create-emergency", status: "critical-failure" },
      extra: {
        canvasDimensions: { width: canvas.width, height: canvas.height },
        canvasState: {
          objectCount: canvas.getObjects()?.length || 0,
          viewportTransform: canvas.viewportTransform,
        }
      }
    });
    throw error;
  }
}

/**
 * Validate that grid exists on canvas
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {boolean} Whether grid is valid
 */
export function validateGrid(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Simple validation - check if grid objects exist
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    captureError(new Error("Grid validation failed: no grid objects"), "grid-validation", {
      level: "warning",
      tags: { component: "grid", operation: "validate" }
    });
    return false;
  }
  
  // Check if at least some grid objects are on canvas
  let foundOnCanvas = false;
  
  for (const obj of gridObjects) {
    if (canvas.contains(obj)) {
      foundOnCanvas = true;
      break;
    }
  }
  
  if (!foundOnCanvas) {
    captureError(
      new Error("Grid validation failed: no grid objects found on canvas"), 
      "grid-validation", 
      {
        level: "warning",
        tags: { component: "grid", operation: "validate" },
        extra: {
          gridObjectCount: gridObjects.length,
          canvasObjectCount: canvas.getObjects().length
        }
      }
    );
  }
  
  return foundOnCanvas;
}

/**
 * Verify if grid exists and is valid on the canvas
 * 
 * @param {Canvas | null} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists and is valid
 */
export function verifyGridExists(
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  if (!canvas) return false;
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) return false;
  
  // Check if at least some grid objects are on canvas
  let foundOnCanvas = false;
  for (const obj of gridLayerRef.current) {
    if (canvas.contains(obj)) {
      foundOnCanvas = true;
      break;
    }
  }
  
  if (!foundOnCanvas) {
    captureError(
      new Error("Grid verification failed: grid exists in ref but not on canvas"),
      "grid-verification",
      {
        level: "warning",
        tags: { component: "grid", operation: "verify" },
        extra: {
          gridLayerLength: gridLayerRef.current.length,
          canvasObjectCount: canvas.getObjects().length,
          detailedValidation: getDetailedGridValidation(canvas, gridLayerRef.current)
        }
      }
    );
  }
  
  return foundOnCanvas;
}

/**
 * Reorder grid objects for proper rendering
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export function reorderGridObjects(
  canvas: Canvas,
  gridObjects: FabricObject[]
): void {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendObjectToBack(obj);
    }
  });
}

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} operation - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<any>} Result of the operation
 */
export async function retryWithBackoff<T>(
  operation: () => T | Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let attempt = 1;
  const execute = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts) {
        // Log the final attempt failure with more details
        captureError(error, 'grid-retry-exhausted', {
          level: 'error',
          tags: {
            component: 'grid',
            operation: 'retry',
            final: 'true'
          },
          extra: {
            attempt,
            maxAttempts,
            initialDelay
          }
        });
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      
      // Log each retry attempt
      captureError(
        error instanceof Error 
          ? error 
          : new Error(`Retry error: ${String(error)}`),
        'grid-retry-attempt',
        {
          level: 'warning',
          tags: {
            component: 'grid',
            operation: 'retry',
            final: 'false'
          },
          extra: {
            attempt,
            maxAttempts,
            delay,
            nextAttemptIn: delay
          }
        }
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
      return execute();
    }
  };
  
  return execute();
}

/**
 * Ensure grid exists on canvas, creating it if needed
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid was ensured successfully
 */
export function ensureGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Check if grid already exists
  if (validateGrid(canvas, gridLayerRef.current)) {
    return true;
  }
  
  // Log to Sentry that we're recreating the grid
  captureError(
    new Error("Grid needs recreation"), 
    "grid-recreation", 
    {
      level: "info",
      tags: { component: "grid", operation: "ensure" },
      extra: {
        canvasDimensions: { width: canvas.width, height: canvas.height },
        existingGridSize: gridLayerRef.current.length,
        canvasObjectCount: canvas.getObjects().length
      }
    }
  );
  
  // Grid doesn't exist or is invalid, create it
  try {
    createCompleteGrid(canvas, gridLayerRef);
    return true;
  } catch (error) {
    console.error("Error ensuring grid:", error);
    captureError(error, "grid-ensure-failed", {
      level: "error",
      tags: { component: "grid", operation: "ensure" }
    });
    
    // Try emergency grid as fallback
    try {
      createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Log emergency grid success
      captureError(
        new Error("Emergency grid created successfully"), 
        "grid-emergency-success", 
        {
          level: "info",
          tags: { component: "grid", operation: "ensure-emergency", status: "success" }
        }
      );
      
      return true;
    } catch (fallbackError) {
      console.error("Fallback grid creation also failed:", fallbackError);
      
      // Log critical failure to Sentry
      captureError(fallbackError, "grid-emergency-failed", {
        level: "fatal",
        tags: { component: "grid", operation: "ensure-emergency", status: "critical-failure" }
      });
      
      return false;
    }
  }
}

/**
 * Dump detailed grid state for debugging
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {Object} Detailed grid state
 */
export function dumpGridState(
  canvas: Canvas,
  gridObjects: FabricObject[]
): Record<string, any> {
  const state = {
    timestamp: new Date().toISOString(),
    canvasExists: !!canvas,
    canvasDimensions: canvas ? { width: canvas.width, height: canvas.height } : null,
    zoom: canvas?.getZoom?.() || null,
    gridObjectCount: gridObjects?.length || 0,
    canvasObjectCount: canvas?.getObjects()?.length || 0,
    gridObjectsOnCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 0,
    performanceStats: { ...gridPerformance }
  };
  
  // Log detailed state to Sentry for debugging
  captureError(
    new Error("Grid state dump requested"),
    "grid-state-dump",
    {
      level: "info",
      tags: { component: "grid", operation: "debug" },
      extra: state
    }
  );
  
  return state;
}
