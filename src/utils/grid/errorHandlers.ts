
/**
 * Grid error handlers
 * @module utils/grid/errorHandlers
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GridErrorSeverity, categorizeGridError } from "./errorTypes";
import { createGridRecoveryPlan } from "./recoveryPlans";
import { createBasicEmergencyGrid } from "./gridRenderers";
import logger from "@/utils/logger";

/**
 * Interface for grid error context
 */
interface GridErrorContext {
  /** The canvas where the error occurred */
  canvas?: Canvas | null;
  /** The error message */
  message: string;
  /** The original error */
  error: Error;
  /** Additional context information */
  context?: Record<string, any>;
}

/**
 * Handle grid creation error
 * Attempts to recover from grid creation errors
 * 
 * @param {GridErrorContext} errorContext - Context for the error
 * @returns {Promise<FabricObject[] | null>} Created grid objects or null if recovery failed
 */
export const handleGridCreationError = async (
  errorContext: GridErrorContext
): Promise<FabricObject[] | null> => {
  const { canvas, message, error, context } = errorContext;
  
  logger.error("Grid creation error:", message, error, context);
  
  // If no canvas, can't recover
  if (!canvas) {
    logger.error("Cannot recover: No canvas available");
    return null;
  }
  
  // Determine error severity
  const severity = categorizeGridError(error);
  
  // For HIGH severity errors, try emergency grid
  if (severity === GridErrorSeverity.HIGH || severity === GridErrorSeverity.CRITICAL) {
    logger.warn(`${severity} severity error detected, using emergency grid`);
    
    try {
      // Try to create an emergency grid
      const emergencyGrid = createBasicEmergencyGrid(canvas);
      
      if (emergencyGrid.length > 0) {
        logger.info("Successfully created emergency grid as fallback");
        return emergencyGrid;
      }
    } catch (emergencyError) {
      logger.error("Emergency grid creation also failed:", emergencyError);
    }
  }
  
  // For MEDIUM and LOW severity errors, try recovery plan
  if (severity === GridErrorSeverity.MEDIUM || severity === GridErrorSeverity.LOW) {
    logger.info(`${severity} severity error detected, attempting recovery`);
    
    // Create recovery actions
    const recoveryActions = [
      // Wait a bit and try to create a simplified grid
      async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        try {
          const emergencyGrid = createBasicEmergencyGrid(canvas);
          return emergencyGrid.length > 0;
        } catch {
          return false;
        }
      }
    ];
    
    // Create and execute recovery plan
    const recoveryPlan = createGridRecoveryPlan(error, recoveryActions);
    const recoverySucceeded = await recoveryPlan.execute();
    
    if (recoverySucceeded) {
      logger.info("Grid recovery successful");
      return canvas.getObjects().filter(obj => obj.objectType === 'grid');
    }
  }
  
  logger.error("Grid recovery failed");
  return null;
};
