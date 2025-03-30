
/**
 * Grid Error Reporting Utilities
 * Enhanced error reporting and diagnostics for grid functionality
 * @module utils/grid/errorReporting
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { GridErrorSeverity } from "./errorTypes";

/**
 * Grid error types for categorization
 */
export enum GridErrorType {
  CREATION_FAILED = 'creation_failed',
  INVALID_CANVAS = 'invalid_canvas',
  MISSING_GRID = 'missing_grid',
  PARTIAL_GRID = 'partial_grid',
  RECOVERY_FAILED = 'recovery_failed',
  INTERNAL_ERROR = 'internal_error'
}

/**
 * Detailed grid error information
 */
export interface GridErrorInfo {
  type: GridErrorType;
  message: string;
  timestamp: number;
  canvasInfo?: Record<string, any>;
  gridInfo?: Record<string, any>;
  error?: unknown;
  recoverable: boolean;
}

// Store recent errors for debugging
const recentGridErrors: GridErrorInfo[] = [];
const MAX_STORED_ERRORS = 10;

/**
 * Log a grid error with detailed diagnostics
 * @param {GridErrorType} type - Error type
 * @param {string} message - Error message
 * @param {Object} options - Additional options
 * @returns {GridErrorInfo} The error info object
 */
export const logGridError = (
  type: GridErrorType,
  message: string,
  options: {
    canvas?: FabricCanvas | null;
    gridObjects?: FabricObject[];
    error?: unknown;
    recoverable?: boolean;
    showToast?: boolean;
  } = {}
): GridErrorInfo => {
  const { canvas, gridObjects, error, recoverable = true, showToast = true } = options;
  
  // Create error info object
  const errorInfo: GridErrorInfo = {
    type,
    message,
    timestamp: Date.now(),
    recoverable,
    error
  };
  
  // Add canvas info if available
  if (canvas) {
    errorInfo.canvasInfo = {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length,
      valid: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    };
  }
  
  // Add grid info if available
  if (gridObjects) {
    errorInfo.gridInfo = {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    };
  }
  
  // Log to console and logger
  console.error(`Grid Error [${type}]: ${message}`, errorInfo);
  logger.error(`Grid Error [${type}]: ${message}`, errorInfo);
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(message, {
      id: `grid-error-${type}`,
      duration: 5000
    });
  }
  
  // Store error for later reference
  recentGridErrors.unshift(errorInfo);
  if (recentGridErrors.length > MAX_STORED_ERRORS) {
    recentGridErrors.pop();
  }
  
  return errorInfo;
};

/**
 * Get recent grid errors for diagnosis
 * @returns {GridErrorInfo[]} Recent grid errors
 */
export const getRecentGridErrors = (): GridErrorInfo[] => {
  return [...recentGridErrors];
};

/**
 * Clear stored grid errors
 */
export const clearGridErrors = (): void => {
  recentGridErrors.length = 0;
};

/**
 * Analyze canvas for potential grid issues
 * @param {FabricCanvas} canvas - Canvas to analyze
 * @param {FabricObject[]} gridObjects - Grid objects
 * @returns {Object} Analysis results
 */
export const analyzeGridIssues = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): {
  hasIssues: boolean;
  issues: string[];
  diagnostics: Record<string, any>;
} => {
  const issues: string[] = [];
  const diagnostics: Record<string, any> = {
    timestamp: Date.now()
  };
  
  // Check canvas
  if (!canvas) {
    issues.push("Canvas is null or undefined");
    return { hasIssues: true, issues, diagnostics: { ...diagnostics, canvasExists: false } };
  }
  
  // Add canvas diagnostics
  diagnostics.canvas = {
    width: canvas.width,
    height: canvas.height,
    valid: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0),
    objectCount: canvas.getObjects().length
  };
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    issues.push(`Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  // Add grid diagnostics
  diagnostics.grid = {
    objectCount: gridObjects.length,
    objectsOnCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 0
  };
  
  if (gridObjects.length === 0) {
    issues.push("No grid objects exist");
  } else if (diagnostics.grid.objectsOnCanvas === 0) {
    issues.push("Grid objects exist but none are on canvas");
  } else if (diagnostics.grid.objectsOnCanvas < gridObjects.length) {
    issues.push(`${gridObjects.length - diagnostics.grid.objectsOnCanvas} grid objects are missing from canvas`);
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    diagnostics
  };
};
