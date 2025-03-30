
/**
 * Grid error types and categorization
 * Defines error severity levels and categorization functions
 * @module grid/errorTypes
 */
import { toast } from "sonner";

/**
 * Toast messages for grid errors
 */
export const GRID_ERROR_MESSAGES = {
  GRID_CREATION_FAILED: "Grid creation failed. Please try refreshing the page.",
  GRID_CREATION_PARTIAL: "Grid creation was only partially successful.",
  GRID_MISSING: "Grid is missing or incomplete. Try refreshing the page.",
  GRID_RECOVERY_FAILED: "Unable to recover grid. Please refresh the page."
};

/**
 * Error severities for categorization
 */
export enum GridErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Categorize grid error by severity
 * @param {Error} error - The error to categorize
 * @returns {GridErrorSeverity} Error severity
 */
export const categorizeGridError = (error: Error): GridErrorSeverity => {
  const message = error.message.toLowerCase();
  
  // Critical errors that indicate severe problems
  if (message.includes('disposed') || 
      message.includes('destroyed') || 
      message.includes('removed')) {
    return GridErrorSeverity.CRITICAL;
  }
  
  // High severity errors that likely require user intervention
  if (message.includes('canvas') || 
      message.includes('context') || 
      message.includes('rendering')) {
    return GridErrorSeverity.HIGH;
  }
  
  // Medium severity errors that might be recoverable
  if (message.includes('object') || 
      message.includes('add') || 
      message.includes('remove')) {
    return GridErrorSeverity.MEDIUM;
  }
  
  // Default to low severity
  return GridErrorSeverity.LOW;
};
