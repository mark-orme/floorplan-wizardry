
/**
 * Grid recovery plans module
 * Provides recovery strategies for grid creation failures
 * @module grid/recoveryPlans
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "../logger";

/**
 * Recovery plan for grid creation
 */
export interface GridRecoveryPlan {
  /** Plan description */
  description: string;
  /** Whether to clear the canvas */
  clearCanvas: boolean;
  /** Whether to resize the canvas */
  resizeCanvas: boolean;
  /** Whether to retry with simplified grid */
  useSimplifiedGrid: boolean;
  /** Whether to disable background grid */
  disableBackgroundGrid: boolean;
  /** Maximum number of retry attempts */
  maxRetries: number;
}

/**
 * Create a grid recovery plan based on error and canvas state
 * 
 * @param {Error} error - The error that occurred
 * @param {FabricCanvas | null} canvas - Canvas reference
 * @returns {GridRecoveryPlan} Recovery plan
 */
export const createGridRecoveryPlan = (error: Error, canvas: FabricCanvas | null): GridRecoveryPlan => {
  const errorMessage = error.message.toLowerCase();
  const errorName = error.name;
  const canvasValid = canvas && canvas.width && canvas.height;
  const hasObjects = canvas && canvas.getObjects().length > 0;
  
  // Log recovery attempt
  logger.info("Creating grid recovery plan", {
    errorName,
    errorMessage: error.message,
    canvasValid,
    hasObjects: hasObjects ? canvas?.getObjects().length : 0
  });
  
  // Default recovery plan
  const defaultPlan: GridRecoveryPlan = {
    description: "Standard recovery",
    clearCanvas: false,
    resizeCanvas: false,
    useSimplifiedGrid: false,
    disableBackgroundGrid: false,
    maxRetries: 3
  };
  
  // Canvas initialization errors
  if (!canvasValid || errorMessage.includes("canvas")) {
    return {
      ...defaultPlan,
      description: "Canvas initialization recovery",
      clearCanvas: true,
      resizeCanvas: true,
      maxRetries: 2
    };
  }
  
  // Rendering or performance errors
  if (errorMessage.includes("render") || errorMessage.includes("maximum")) {
    return {
      ...defaultPlan,
      description: "Rendering performance recovery",
      useSimplifiedGrid: true,
      disableBackgroundGrid: true,
      maxRetries: 5
    };
  }
  
  // Object-related errors
  if (errorMessage.includes("object") || errorMessage.includes("element")) {
    return {
      ...defaultPlan,
      description: "Object recovery",
      clearCanvas: hasObjects || false,
      useSimplifiedGrid: true,
      maxRetries: 3
    };
  }
  
  // Return default plan for unknown errors
  return defaultPlan;
};
