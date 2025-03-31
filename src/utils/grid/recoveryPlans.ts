
/**
 * Grid recovery plans
 * Provides strategies for recovering from grid-related errors
 * @module utils/grid/recoveryPlans
 */

import logger from "@/utils/logger";

/**
 * Interface for a grid recovery plan
 */
interface GridRecoveryPlan {
  /** Error that triggered the recovery plan */
  originalError: Error;
  /** Recovery steps to attempt */
  steps: (() => Promise<boolean>)[];
  /** Execute the recovery plan */
  execute: () => Promise<boolean>;
}

/**
 * Create a recovery plan for a grid error
 * @param {Error} error - The error that occurred
 * @param {(() => Promise<boolean>)[]} recoveryActions - Recovery actions to attempt
 * @returns {GridRecoveryPlan} Recovery plan
 */
export const createGridRecoveryPlan = (
  error: Error,
  recoveryActions: (() => Promise<boolean>)[] = []
): GridRecoveryPlan => {
  logger.warn("Creating grid recovery plan for error:", error.message);
  
  // Default recovery steps
  const defaultSteps: (() => Promise<boolean>)[] = [
    // Basic recovery step - wait and retry
    async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    }
  ];
  
  // Combine provided actions with default steps
  const steps = [...recoveryActions, ...defaultSteps];
  
  // Create the recovery plan
  const recoveryPlan: GridRecoveryPlan = {
    originalError: error,
    steps,
    
    // Execute the recovery plan
    execute: async () => {
      logger.info("Executing grid recovery plan with", steps.length, "steps");
      
      for (let i = 0; i < steps.length; i++) {
        try {
          logger.debug(`Executing recovery step ${i + 1}/${steps.length}`);
          const result = await steps[i]();
          
          if (result) {
            logger.info(`Recovery step ${i + 1} succeeded`);
            return true;
          }
          
          logger.warn(`Recovery step ${i + 1} failed, trying next step`);
        } catch (stepError) {
          logger.error(`Error in recovery step ${i + 1}:`, stepError);
        }
      }
      
      logger.error("All recovery steps failed");
      return false;
    }
  };
  
  return recoveryPlan;
};
