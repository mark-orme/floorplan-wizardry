
/**
 * Grid error handling utilities
 * Provides error handling and user feedback
 * @module grid/errorHandlers
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "../logger";
import { captureError, startPerformanceTransaction } from "../sentry";
import { GridErrorSeverity, categorizeGridError, GRID_ERROR_MESSAGES } from "./errorTypes";

/**
 * Handle grid creation errors
 * Provides error handling and user feedback
 * 
 * @param {Error} error - The error that occurred
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 * @param {FabricCanvas} [canvas] - Optional canvas instance for additional context
 * @param {FabricObject[]} [gridObjects] - Optional grid objects for additional context
 */
export const handleGridCreationError = (
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
  canvas?: FabricCanvas | null,
  gridObjects?: FabricObject[] | null
): void => {
  // Start error handling performance tracking
  const transaction = startPerformanceTransaction('grid-error-handling', {
    tags: {
      errorType: error.name,
      context: 'grid-creation'
    }
  });
  
  if (process.env.NODE_ENV === 'development') {
    logger.error("Error creating grid:", error);
  }
  
  // Update error state
  setHasError(true);
  setErrorMessage(`Error creating grid: ${error.message}`);
  
  // Categorize error severity
  const severity = categorizeGridError(error);
  
  // Diagnose grid failure with detailed information
  const diagnosis = {
    timestamp: new Date().toISOString(),
    context: "grid-creation-error",
    errorSeverity: severity,
    canvasState: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length,
      initialized: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    } : 'Canvas is null',
    gridObjects: gridObjects ? {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    } : 'No grid objects',
    browserInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
    }
  };
  
  // Create enhanced error data with detailed debugging info
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    canvas: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects()?.length || 0,
      initialized: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    } : 'No canvas',
    gridObjects: gridObjects ? {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    } : 'No grid objects',
    diagnosis
  };
  
  // Report to Sentry with enhanced context
  captureError(error, 'grid-creation', {
    level: severity === GridErrorSeverity.CRITICAL || severity === GridErrorSeverity.HIGH ? 'error' : 'warning',
    tags: {
      component: 'grid',
      operation: 'creation',
      error_type: error.name,
      critical: (severity === GridErrorSeverity.CRITICAL).toString(),
      severity: severity
    },
    extra: errorData
  });
  
  // Notify user of the issue with a toast
  toast.error(GRID_ERROR_MESSAGES.GRID_CREATION_FAILED, {
    id: "grid-error",
    duration: 5000
  });
  
  // Calculate and report performance metrics
  transaction.finish(severity);
};
