
/**
 * Grid error handlers
 * @module utils/grid/errorHandlers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { GridErrorSeverity, categorizeGridError } from './errorTypes';
import { createGridRecoveryPlan } from './recoveryPlans';
import logger from '@/utils/logger';

/**
 * Handle grid creation error
 * @param error - Error that occurred
 * @param canvas - Fabric canvas
 * @returns Whether the error was handled successfully
 */
export async function handleGridCreationError(
  error: Error,
  canvas: FabricCanvas
): Promise<boolean> {
  // Categorize error
  const severity = categorizeGridError(error);
  
  // Log error with appropriate level
  switch (severity) {
    case GridErrorSeverity.HIGH:
      logger.error('Critical grid creation error:', error);
      break;
    case GridErrorSeverity.MEDIUM:
      logger.warn('Grid creation error:', error);
      break;
    case GridErrorSeverity.LOW:
      logger.info('Minor grid creation issue:', error);
      break;
  }
  
  // For high and medium severity, attempt recovery
  if (severity === GridErrorSeverity.HIGH || severity === GridErrorSeverity.MEDIUM) {
    try {
      // Create and execute recovery plan
      const recoveryPlan = createGridRecoveryPlan(error, canvas);
      const success = await recoveryPlan.execute();
      
      logger.info(`Grid recovery ${success ? 'succeeded' : 'failed'}`);
      return success;
    } catch (recoveryError) {
      logger.error('Error during grid recovery:', recoveryError);
      return false;
    }
  }
  
  // For low severity, just log and continue
  return true;
}
