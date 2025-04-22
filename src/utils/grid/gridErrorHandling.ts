
/**
 * Grid error handling utilities
 * @module grid/gridErrorHandling
 */

import { toast } from "sonner";
import logger from "../logger";

// Import from gridManager directly
import { resetGridProgress } from "../gridManager";
import { captureError } from "../sentryUtils";

/**
 * Handle grid creation error
 * @param {Error} error - Error to handle
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 */
export const handleGridCreationError = (
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
): void => {
  // Log error
  logger.error("Grid creation error:", error);
  console.error("Grid creation error:", error);
  
  // Set error state
  setHasError(true);
  setErrorMessage(error.message || "Unknown grid creation error");
  
  // Show toast
  toast.error("Error creating grid", {
    description: error.message || "Unknown error",
    duration: 3000
  });
  
  // Reset grid progress
  resetGridProgress();
  
  // Report to Sentry
  captureError(error, {
    level: 'error',
    tags: {
      component: 'grid',
      operation: 'creation'
    }
  });
};

/**
 * Format grid error for logging
 * @param {Error} error - Error to format
 * @returns {string} Formatted error
 */
export const formatGridError = (error: Error): string => {
  return `Grid Error: ${error.message}\nStack: ${error.stack || "No stack trace"}`;
};

/**
 * Get error severity level
 * @param {Error} error - Error to check
 * @returns {string} Severity level
 */
export const getErrorSeverity = (error: Error): "low" | "medium" | "high" => {
  const message = error.message.toLowerCase();
  
  if (message.includes("canvas") || message.includes("disposed")) {
    return "high";
  }
  
  if (message.includes("render") || message.includes("object")) {
    return "medium";
  }
  
  return "low";
};
