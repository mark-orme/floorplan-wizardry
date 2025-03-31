
/**
 * Grid error types
 * @module utils/grid/errorTypes
 */

/**
 * Grid error severity enum
 */
export enum GridErrorSeverity {
  /** Low severity error */
  LOW = "low",
  /** Medium severity error */
  MEDIUM = "medium",
  /** High severity error */
  HIGH = "high",
  /** Critical severity error */
  CRITICAL = "critical"
}

/**
 * Grid error messages
 */
export const GRID_ERROR_MESSAGES = {
  CANVAS_NULL: "Canvas is null",
  CANVAS_INVALID: "Canvas has invalid dimensions",
  GRID_EMPTY: "No grid objects created",
  GRID_CREATION_FAILED: "Grid creation failed",
  GRID_VISIBILITY_FAILED: "Failed to ensure grid visibility"
};

/**
 * Categorize grid error by severity
 * 
 * @param {Error} error - The error to categorize
 * @returns {GridErrorSeverity} Error severity
 */
export const categorizeGridError = (error: Error): GridErrorSeverity => {
  const message = error.message.toLowerCase();
  
  if (message.includes("null") || message.includes("undefined")) {
    return GridErrorSeverity.HIGH;
  }
  
  if (message.includes("dimensions") || message.includes("size")) {
    return GridErrorSeverity.MEDIUM;
  }
  
  if (message.includes("grid") || message.includes("line")) {
    return GridErrorSeverity.MEDIUM;
  }
  
  return GridErrorSeverity.LOW;
};
