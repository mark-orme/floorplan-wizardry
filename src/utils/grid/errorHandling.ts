
/**
 * Grid error handling module
 * Handles errors and retries for grid creation
 * @module grid/errorHandling
 */
import { toast } from "sonner";
import logger from "../logger";
import { captureError } from "../sentryUtils";
import { Canvas, Object as FabricObject } from "fabric";

/**
 * Toast messages for grid errors
 */
export const GRID_ERROR_MESSAGES = {
  GRID_CREATION_FAILED: "Grid creation failed. Please try refreshing the page.",
  GRID_CREATION_PARTIAL: "Grid creation was only partially successful.",
  GRID_MISSING: "Grid is missing or incomplete. Try refreshing the page.",
  GRID_RECOVERY_FAILED: "Unable to recover grid. Please refresh the page."
};

/**
 * Handle grid creation errors
 * Provides error handling and user feedback
 * 
 * @param {Error} error - The error that occurred
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 * @param {Canvas} [canvas] - Optional canvas instance for additional context
 * @param {FabricObject[]} [gridObjects] - Optional grid objects for additional context
 */
export const handleGridCreationError = (
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
  canvas?: Canvas | null,
  gridObjects?: FabricObject[] | null
): void => {
  if (process.env.NODE_ENV === 'development') {
    logger.error("Error creating grid:", error);
  }
  
  // Update error state
  setHasError(true);
  setErrorMessage(`Error creating grid: ${error.message}`);
  
  // Diagnose grid failure
  const diagnosis = {
    timestamp: new Date().toISOString(),
    context: "grid-creation-error",
    canvasState: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length,
      initialized: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    } : 'Canvas is null',
    gridObjects: gridObjects ? {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    } : 'No grid objects'
  };
  
  // Create enhanced error data with detailed debugging info
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    canvas: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects()?.length || 0,
      initialized: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    } : 'No canvas',
    gridObjects: gridObjects ? {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    } : 'No grid objects',
    diagnosis
  };
  
  // Report to Sentry with enhanced context
  captureError(error, 'grid-creation', {
    tags: {
      component: 'grid',
      operation: 'creation',
      error_type: error.name,
      critical: 'true'
    },
    extra: errorData,
    level: 'error'
  });
  
  // Notify user of the issue with a toast
  toast.error(GRID_ERROR_MESSAGES.GRID_CREATION_FAILED, {
    id: "grid-error",
    duration: 5000
  });
};

/**
 * Create a recovery plan for grid issues
 * Provides multi-step recovery strategy for grid failures
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @param {string} failureContext - Context in which the failure occurred
 * @returns {Object} Recovery plan with steps to fix the issues
 */
export const createGridRecoveryPlan = (
  canvas: Canvas,
  gridObjects: FabricObject[],
  failureContext: string
): Record<string, any> => {
  // Create a recovery plan based on identified issues
  const plan = {
    timestamp: new Date().toISOString(),
    context: failureContext,
    needsCanvasReset: false,
    needsGridRecreation: false,
    needsFullRefresh: false,
    suggestedActions: [] as string[],
    diagnostic: {}
  };
  
  // Check for critical issues
  if (!canvas || !canvas.width || !canvas.height) {
    plan.needsFullRefresh = true;
    plan.suggestedActions.push("Refresh the page to reinitialize canvas");
    plan.diagnostic = { canvas: "invalid" };
    return plan;
  }
  
  // Check grid objects
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  plan.diagnostic = {
    canvasDimensions: { width: canvas.width, height: canvas.height },
    totalGridObjects: gridObjects.length,
    gridObjectsOnCanvas,
    percentOnCanvas: gridObjects.length ? Math.round((gridObjectsOnCanvas / gridObjects.length) * 100) : 0
  };
  
  // Grid is completely missing
  if (gridObjects.length === 0) {
    plan.needsGridRecreation = true;
    plan.suggestedActions.push("Recreate entire grid");
  }
  // Grid is partially missing
  else if (gridObjectsOnCanvas < gridObjects.length) {
    if (gridObjectsOnCanvas === 0) {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push("Recreate entire grid - all objects missing from canvas");
    } else {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push(`Recreate grid - only ${gridObjectsOnCanvas}/${gridObjects.length} objects on canvas`);
    }
  }
  
  // Log the recovery plan to Sentry
  captureError(
    new Error(`Grid recovery plan for ${failureContext}`),
    "grid-recovery-plan",
    {
      level: "info",
      tags: {
        component: "grid",
        operation: "recovery",
        context: failureContext,
        needs_recreation: String(plan.needsGridRecreation),
        needs_refresh: String(plan.needsFullRefresh)
      },
      extra: plan
    }
  );
  
  return plan;
};
