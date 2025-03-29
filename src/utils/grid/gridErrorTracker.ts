
/**
 * Grid Error Tracking Utility
 * Provides comprehensive error tracking, diagnostics, and recovery for grid issues
 * @module utils/grid/gridErrorTracker
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { toast } from "sonner";

// Track grid errors and their frequency
interface GridErrorRecord {
  message: string;
  count: number;
  firstOccurred: number;
  lastOccurred: number;
  contexts: Set<string>;
}

// Grid creation attempt metadata
interface GridCreationAttempt {
  timestamp: number;
  canvasDimensions?: { width: number; height: number };
  successful: boolean;
  objectCount: number;
  duration: number;
  error?: string;
}

// Store error statistics
const errorStats: Record<string, GridErrorRecord> = {};
const creationAttempts: GridCreationAttempt[] = [];
const MAX_STORED_ATTEMPTS = 20;

/**
 * Track a grid error with diagnostics
 * @param {Error | string} error - The error that occurred
 * @param {string} context - Where the error occurred
 * @param {Object} metadata - Additional error information
 */
export const trackGridError = (
  error: Error | string,
  context: string,
  metadata: Record<string, any> = {}
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorKey = `${context}:${errorMessage.substring(0, 100)}`;
  
  // Update error stats
  if (!errorStats[errorKey]) {
    errorStats[errorKey] = {
      message: errorMessage,
      count: 0,
      firstOccurred: Date.now(),
      lastOccurred: Date.now(),
      contexts: new Set([context])
    };
  } else {
    errorStats[errorKey].count++;
    errorStats[errorKey].lastOccurred = Date.now();
    errorStats[errorKey].contexts.add(context);
  }
  
  // Log to console
  console.error(`Grid Error in ${context}: ${errorMessage}`, metadata);
  
  // Log to application logger
  logger.error(`Grid Error in ${context}: ${errorMessage}`, {
    context,
    metadata,
    occurrences: errorStats[errorKey].count
  });
  
  // Report to Sentry with rich contextual information
  captureError(
    error instanceof Error ? error : new Error(errorMessage),
    `grid-error-${context}`,
    {
      level: errorStats[errorKey].count > 5 ? "error" : "warning",
      tags: {
        errorSource: "grid",
        context,
        recurring: String(errorStats[errorKey].count > 1)
      },
      extra: {
        ...metadata,
        occurrences: errorStats[errorKey].count,
        firstSeen: new Date(errorStats[errorKey].firstOccurred).toISOString(),
        contexts: Array.from(errorStats[errorKey].contexts)
      }
    }
  );
  
  // Show toast for major errors, but not too frequently to avoid overwhelming user
  const shouldShowToast = errorStats[errorKey].count <= 3 || 
                          (Date.now() - errorStats[errorKey].lastOccurred > 60000);
  if (shouldShowToast) {
    toast.error("Grid rendering issue detected. Attempting to fix automatically.");
  }
};

/**
 * Record a grid creation attempt
 * @param {boolean} successful - Whether the attempt was successful
 * @param {number} objectCount - Number of grid objects created
 * @param {number} duration - How long the creation took in ms
 * @param {Object} options - Additional options
 */
export const recordGridCreationAttempt = (
  successful: boolean,
  objectCount: number,
  duration: number,
  options: {
    error?: string;
    canvasDimensions?: { width: number; height: number };
  } = {}
): void => {
  const attempt: GridCreationAttempt = {
    timestamp: Date.now(),
    successful,
    objectCount,
    duration,
    ...options
  };
  
  creationAttempts.unshift(attempt);
  
  // Limit stored attempts
  if (creationAttempts.length > MAX_STORED_ATTEMPTS) {
    creationAttempts.pop();
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Grid creation attempt ${successful ? 'succeeded' : 'failed'}: ${objectCount} objects in ${duration.toFixed(1)}ms`,
      options
    );
  }
  
  // If we have many failed attempts, report to Sentry
  const recentAttempts = creationAttempts.slice(0, 5);
  const recentFailures = recentAttempts.filter(a => !a.successful).length;
  
  if (recentFailures >= 3) {
    captureError(
      new Error(`Multiple grid creation failures: ${recentFailures} recent failures`),
      "grid-creation-failures",
      {
        level: "error",
        extra: {
          recentAttempts,
          failureRate: `${recentFailures}/${recentAttempts.length}`
        }
      }
    );
  }
};

/**
 * Check canvas health with detailed diagnostics
 * @param {FabricCanvas} canvas - The canvas to check
 * @returns {Object} Health report with diagnostics
 */
export const checkCanvasHealth = (
  canvas: FabricCanvas | null
): Record<string, any> => {
  const report = {
    timestamp: Date.now(),
    canvasValid: false,
    issues: [] as string[],
    contextInfo: {} as Record<string, any>
  };
  
  if (!canvas) {
    report.issues.push("Canvas is null or undefined");
    return report;
  }
  
  // Check canvas dimensions
  report.contextInfo.dimensions = {
    width: canvas.width,
    height: canvas.height
  };
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    report.issues.push(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}`);
  } else {
    report.canvasValid = true;
  }
  
  // Check canvas context
  try {
    // Check if context container exists (without using isRendered)
    const hasContext = !!(canvas as any).contextContainer;
    report.contextInfo.hasRenderingContext = hasContext;
    
    if (!hasContext) {
      report.issues.push("Canvas missing rendering context");
      report.canvasValid = false;
    }
  } catch (error) {
    report.issues.push("Error checking canvas context");
    report.contextInfo.contextError = String(error);
  }
  
  // Check object count
  try {
    const objects = canvas.getObjects();
    report.contextInfo.objectCount = objects.length;
    
    // Check if canvas is disposed
    if ((canvas as any)._isDisposed) {
      report.issues.push("Canvas is disposed");
      report.canvasValid = false;
    }
  } catch (error) {
    report.issues.push("Error getting canvas objects");
  }
  
  return report;
};

/**
 * Get error statistics for diagnosis
 * @returns {Object} Error statistics
 */
export const getGridErrorStats = (): Record<string, any> => {
  return {
    errorCount: Object.keys(errorStats).length,
    errors: Object.values(errorStats),
    creationAttempts: creationAttempts.slice(0, 10)
  };
};

/**
 * Clear error statistics
 */
export const clearGridErrorStats = (): void => {
  Object.keys(errorStats).forEach(key => delete errorStats[key]);
  creationAttempts.length = 0;
  
  logger.info("Grid error statistics cleared");
};
