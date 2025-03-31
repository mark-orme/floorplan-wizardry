/**
 * Grid recovery plans
 * @module utils/grid/recoveryPlans
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Create grid recovery plan
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {Error} error - The error that occurred
 * @returns {Function[]} Recovery functions to try
 */
export const createGridRecoveryPlan = (
  canvas: FabricCanvas | null,
  error: Error
): (() => Promise<boolean>)[] => {
  if (!canvas) {
    logger.error("Cannot create recovery plan: Canvas is null");
    return [];
  }
  
  const message = error.message.toLowerCase();
  const recoveryPlan: (() => Promise<boolean>)[] = [];
  
  // Add delay recovery
  recoveryPlan.push(async () => {
    logger.info("Applying recovery: Wait and try again");
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  });
  
  // Add canvas reset if dimensions issue
  if (message.includes("dimensions") || message.includes("size")) {
    recoveryPlan.push(async () => {
      logger.info("Applying recovery: Reset canvas dimensions");
      
      if (!canvas.width || !canvas.height) {
        canvas.setDimensions({ width: 800, height: 600 });
      }
      
      return true;
    });
  }
  
  // Add clear objects if overflow issue
  if (message.includes("overflow") || message.includes("too many") || message.includes("maximum")) {
    recoveryPlan.push(async () => {
      logger.info("Applying recovery: Clear excess objects");
      
      const objects = canvas.getObjects();
      const gridObjects = objects.filter(obj => 
        obj.objectType === "grid"
      );
      
      // Keep only first 100 grid objects
      if (gridObjects.length > 100) {
        for (let i = 100; i < gridObjects.length; i++) {
          canvas.remove(gridObjects[i]);
        }
      }
      
      return true;
    });
  }
  
  return recoveryPlan;
};
