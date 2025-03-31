
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { captureMessage } from "@/utils/sentry";
import { createGridRecoveryPlan } from "./recoveryPlans";

/**
 * Grid error messages
 */
export const GRID_ERROR_MESSAGES = {
  CANVAS_NULL: "Canvas is not available",
  CANVAS_INVALID: "Canvas is not valid",
  GRID_EMPTY: "Grid is empty",
  GRID_CREATION_FAILED: "Failed to create grid",
  GRID_VISIBILITY_FAILED: "Failed to set grid visibility",
  CANVAS_INITIALIZATION_FAILED: "Canvas initialization failed",
  GRID_RENDERING_ERROR: "Error rendering grid"
};

/**
 * Grid error severity levels
 */
export enum GridErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  FATAL = "fatal"
}

/**
 * Handle grid creation error
 * @param canvas - Fabric canvas
 * @param error - Error that occurred
 * @returns Whether recovery was successful
 */
export const handleGridCreationError = async (canvas: FabricCanvas, error?: Error): Promise<boolean> => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return false;
  }
  
  // Log error
  logger.error("Grid creation error:", error);
  
  // Capture error message
  captureMessage("Grid creation error", "grid-error", {
    tags: { component: "Grid", severity: GridErrorSeverity.ERROR },
    extra: { 
      errorMessage: error?.message,
      canvasInfo: {
        width: canvas.width,
        height: canvas.height,
        objectCount: canvas.getObjects().length
      }
    }
  });
  
  // Create recovery plan
  const recoveryPlan = createGridRecoveryPlan(canvas, error);
  
  // Try each recovery action
  for (const action of recoveryPlan.actions) {
    const success = await action();
    if (success) {
      logger.info("Grid recovery successful");
      return true;
    }
  }
  
  logger.error("Grid recovery failed, all actions exhausted");
  return false;
};
