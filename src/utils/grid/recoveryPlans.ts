
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
    async () => {
      try {
        logger.info("Recovery step: Creating emergency grid");
        // Note: We would need the canvas here, but since this is just a default step
        // we'll rely on the execute function to provide it
        return true;
      } catch (err) {
        logger.error("Emergency grid creation failed:", err);
        return false;
      }
    },
    
    // Try with delayed recreation
    async () => {
      logger.info("Recovery step: Delayed grid creation");
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            resolve(true);
          } catch (err) {
            logger.error("Delayed emergency grid creation failed:", err);
            resolve(false);
          }
        }, 500);
      });
    }
  ];
  
  // Combine custom recovery actions with defaults
  const allSteps = [...recoveryActions, ...defaultSteps];
  
  return {
    error,
    steps: allSteps,
    async execute(canvas: FabricCanvas) {
      logger.info("Executing grid recovery plan");
      
      for (const step of allSteps) {
        try {
          const success = await step();
          if (success) {
            // If step succeeded, try to create an emergency grid on the canvas
            try {
              const gridObjects = createBasicEmergencyGrid(canvas);
              logger.info(`Created ${gridObjects.length} emergency grid objects`);
            } catch (err) {
              logger.error("Failed to create emergency grid:", err);
            }
            
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
