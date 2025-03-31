
/**
 * Grid recovery plans
 * @module utils/grid/recoveryPlans
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Recovery plan interface
 */
interface GridRecoveryPlan {
  clearCanvas: boolean;
  resizeCanvas: boolean;
  useSimplifiedGrid: boolean;
  disableBackgroundGrid: boolean;
  recreateGridOnly: boolean;
}

/**
 * Create a grid recovery plan based on the encountered error
 * 
 * @param {Error} error - The error that occurred
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @returns {GridRecoveryPlan} Recovery plan
 */
export const createGridRecoveryPlan = (
  error: Error,
  canvas: FabricCanvas
): GridRecoveryPlan => {
  const errorMessage = error.message.toLowerCase();
  const objectCount = canvas ? canvas.getObjects().length : 0;
  
  // Default recovery plan
  const plan: GridRecoveryPlan = {
    clearCanvas: false,
    resizeCanvas: false,
    useSimplifiedGrid: false,
    disableBackgroundGrid: false,
    recreateGridOnly: true
  };
  
  // Canvas initialization issues
  if (
    errorMessage.includes("canvas") && 
    (errorMessage.includes("null") || 
     errorMessage.includes("undefined") ||
     errorMessage.includes("initialize"))
  ) {
    plan.resizeCanvas = true;
    plan.clearCanvas = true;
    plan.useSimplifiedGrid = true;
    logger.warn("Recovery plan: Canvas initialization issues detected");
  }
  
  // Rendering issues
  else if (
    errorMessage.includes("render") || 
    errorMessage.includes("draw")
  ) {
    plan.useSimplifiedGrid = true;
    plan.disableBackgroundGrid = true;
    logger.warn("Recovery plan: Rendering issues detected");
  }
  
  // Object creation issues
  else if (
    errorMessage.includes("object") || 
    errorMessage.includes("create") || 
    objectCount > 100
  ) {
    plan.clearCanvas = true;
    plan.useSimplifiedGrid = true;
    logger.warn("Recovery plan: Object issues detected");
  }
  
  return plan;
};
