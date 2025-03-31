
/**
 * Grid recovery plans
 * Provides recovery strategies for grid creation failures
 * @module utils/grid/recoveryPlans
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { createBasicEmergencyGrid } from './gridRenderers';

/**
 * Create a recovery plan for grid creation failures
 * @param {Error} error - The error that triggered recovery
 * @param {Array<Function>} recoveryActions - Optional custom recovery actions
 * @returns {Object} Recovery plan with steps and execute function
 */
export const createGridRecoveryPlan = (
  error: Error,
  recoveryActions: Array<() => Promise<boolean>> = []
) => {
  logger.info("Creating grid recovery plan for error:", error.message);
  
  // Default recovery steps
  const defaultSteps = [
    // Try creating basic emergency grid
    async (canvas: FabricCanvas) => {
      try {
        logger.info("Recovery step: Creating emergency grid");
        const gridObjects = createBasicEmergencyGrid(canvas);
        return gridObjects.length > 0;
      } catch (err) {
        logger.error("Emergency grid creation failed:", err);
        return false;
      }
    },
    
    // Try with delayed recreation
    async (canvas: FabricCanvas) => {
      logger.info("Recovery step: Delayed grid creation");
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            const gridObjects = createBasicEmergencyGrid(canvas);
            resolve(gridObjects.length > 0);
          } catch (err) {
            logger.error("Delayed emergency grid creation failed:", err);
            resolve(false);
          }
        }, 500);
      });
    }
  ];
  
  // Combine custom recovery actions with defaults
  const allSteps = [...recoveryActions];
  
  return {
    error,
    steps: allSteps,
    async execute(canvas: FabricCanvas) {
      logger.info("Executing grid recovery plan");
      
      for (const step of allSteps) {
        try {
          const success = await step();
          if (success) {
            logger.info("Recovery step succeeded");
            return true;
          }
        } catch (err) {
          logger.error("Recovery step failed:", err);
        }
      }
      
      logger.error("All recovery steps failed");
      return false;
    }
  };
};
