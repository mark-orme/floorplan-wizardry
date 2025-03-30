/**
 * Grid error handling module
 * Handles errors and retries for grid creation
 * @module grid/errorHandling
 */
import { toast } from "sonner";
import logger from "../logger";
import { captureError, captureMessage, startPerformanceTransaction } from "../sentry";
import { Canvas, Object as FabricObject } from "fabric";

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

/**
 * Handle grid creation errors
 * Provides error handling and user feedback
 * 
 * @param {Error} error - The error that occurred
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 * @param {Canvas} [canvas] - Optional canvas instance for additional context
 * @param {FabricObject[]} [gridObjects] - Optional grid objects for additional context
 */
export const handleGridCreationError = (
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
  canvas?: Canvas | null,
  gridObjects?: FabricObject[] | null
): void => {
  // Start error handling performance tracking
  const transaction = startPerformanceTransaction('grid-error-handling', {
    errorType: error.name,
    context: 'grid-creation'
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

/**
 * Create a recovery plan for grid issues
 * Provides multi-step recovery strategy for grid failures
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @param {string} failureContext - Context in which the failure occurred
 * @returns {Object} Recovery plan with steps to fix the issues
 */
export const createGridRecoveryPlan = (
  canvas: Canvas,
  gridObjects: FabricObject[],
  failureContext: string
): Record<string, any> => {
  // Create a recovery plan based on identified issues
  const plan = {
    timestamp: new Date().toISOString(),
    context: failureContext,
    needsCanvasReset: false,
    needsGridRecreation: false,
    needsFullRefresh: false,
    suggestedActions: [] as string[],
    diagnostic: {}
  };
  
  // Check for critical issues
  if (!canvas || !canvas.width || !canvas.height) {
    plan.needsFullRefresh = true;
    plan.suggestedActions.push("Refresh the page to reinitialize canvas");
    plan.diagnostic = { canvas: "invalid" };
    return plan;
  }
  
  // Check grid objects
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  plan.diagnostic = {
    canvasDimensions: { width: canvas.width, height: canvas.height },
    totalGridObjects: gridObjects.length,
    gridObjectsOnCanvas,
    percentOnCanvas: gridObjects.length ? Math.round((gridObjectsOnCanvas / gridObjects.length) * 100) : 0
  };
  
  // Grid is completely missing
  if (gridObjects.length === 0) {
    plan.needsGridRecreation = true;
    plan.suggestedActions.push("Recreate entire grid");
  }
  // Grid is partially missing
  else if (gridObjectsOnCanvas < gridObjects.length) {
    if (gridObjectsOnCanvas === 0) {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push("Recreate entire grid - all objects missing from canvas");
    } else {
      plan.needsGridRecreation = true;
      plan.suggestedActions.push(`Recreate grid - only ${gridObjectsOnCanvas}/${gridObjects.length} objects on canvas`);
    }
  }
  
  // Log the recovery plan to application log
  logger.info(`Grid recovery plan for ${failureContext}:`, plan);
  
  // Report the recovery plan to Sentry
  captureMessage(
    `Grid recovery plan for ${failureContext}`,
    "grid-recovery-plan",
    {
      level: "info",
      tags: {
        component: "grid",
        operation: "recovery",
        context: failureContext,
        needs_recreation: plan.needsGridRecreation.toString(),
        needs_refresh: plan.needsFullRefresh.toString()
      },
      extra: plan
    }
  );
  
  return plan;
};

/**
 * Track grid creation performance metrics
 * 
 * @param {boolean} success - Whether grid creation was successful
 * @param {number} duration - Duration in milliseconds
 * @param {Object} dimensions - Canvas dimensions
 * @param {number} objectCount - Number of grid objects created
 */
export const trackGridCreationPerformance = (
  success: boolean, 
  duration: number, 
  dimensions: { width: number; height: number },
  objectCount: number
): void => {
  // Log performance data
  logger.debug("Grid creation performance:", {
    success,
    duration,
    dimensions,
    objectCount,
    objectsPerSecond: Math.round(objectCount / (duration / 1000))
  });
  
  // Report performance data to Sentry
  captureMessage(
    `Grid creation ${success ? "succeeded" : "failed"} in ${duration.toFixed(1)}ms`,
    "grid-creation-performance",
    {
      level: "info",
      tags: {
        component: "grid",
        operation: "creation-performance",
        success: success.toString()
      },
      extra: {
        duration,
        dimensions,
        objectCount,
        timestamp: new Date().toISOString(),
        objectsPerSecond: Math.round(objectCount / (duration / 1000)),
        performanceInfo: {
          // Check if memory API is available before accessing it
          // The Performance.memory is a non-standard API only available in some browsers
          memory: typeof performance !== 'undefined' && 
                 'memory' in performance ? {
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize
          } : 'Not available'
        }
      }
    }
  );
};
