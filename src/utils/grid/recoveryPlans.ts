
/**
 * Grid recovery plans
 * @module utils/grid/recoveryPlans
 */
import { Canvas as FabricCanvas } from 'fabric';
import { createBasicEmergencyGrid } from './gridRenderers';
import logger from '@/utils/logger';

/**
 * Grid recovery plan type
 */
interface GridRecoveryPlan {
  /** Steps to execute for recovery */
  steps: Array<() => Promise<boolean>>;
  /** Execute the recovery plan */
  execute: () => Promise<boolean>;
}

/**
 * Create a recovery plan for grid creation errors
 * @param error - Error that occurred
 * @param canvas - Fabric canvas
 * @returns Recovery plan
 */
export function createGridRecoveryPlan(
  error: Error,
  canvas: FabricCanvas
): GridRecoveryPlan {
  const recoverySteps: Array<() => Promise<boolean>> = [];
  
  // Add recovery steps based on error type
  if (error.message.includes('dimensions') || error.message.includes('invalid')) {
    // Canvas dimension issues
    recoverySteps.push(
      async () => {
        try {
          if (!canvas) return false;
          
          // Try to reset canvas dimensions
          const width = Math.max(canvas.width || 800, 800);
          const height = Math.max(canvas.height || 600, 600);
          
          canvas.setDimensions({ width, height });
          logger.info(`Reset canvas dimensions to ${width}x${height}`);
          return true;
        } catch (e) {
          logger.error('Recovery step failed:', e);
          return false;
        }
      }
    );
  }
  
  // Always include emergency grid creation as last resort
  recoverySteps.push(
    async () => {
      try {
        if (!canvas) return false;
        
        // Try to create emergency grid
        const gridObjects = createBasicEmergencyGrid(canvas);
        logger.info(`Created emergency grid with ${gridObjects.length} objects`);
        return gridObjects.length > 0;
      } catch (e) {
        logger.error('Emergency grid creation failed:', e);
        return false;
      }
    }
  );
  
  // Create recovery plan
  const plan: GridRecoveryPlan = {
    steps: recoverySteps,
    execute: async () => {
      for (const step of recoverySteps) {
        const success = await step();
        if (success) return true;
      }
      return false;
    }
  };
  
  return plan;
}
