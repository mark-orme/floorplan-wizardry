
/**
 * Grid error types and severity levels
 * Defines error categories and messages for grid functionality
 * @module grid/errorTypes
 */

/**
 * Error severity levels for grid operations
 */
export enum GridErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

/**
 * Standard error messages for grid operations
 */
export const GRID_ERROR_MESSAGES = {
  GRID_CREATION_FAILED: "Failed to create grid. The application will attempt to recover.",
  CANVAS_INITIALIZATION_FAILED: "Canvas initialization failed. Please reload the page.",
  GRID_RENDERING_ERROR: "Error rendering grid. Some elements may not display correctly.",
  GRID_PERFORMANCE_ISSUE: "Grid performance issue detected. Reducing detail level.",
  GRID_RECOVERY_FAILED: "Grid recovery failed. Please reload the application."
};

/**
 * Categorize grid error by severity based on message content and error type
 * 
 * @param {Error} error - The error to categorize
 * @returns {GridErrorSeverity} The error severity level
 */
export const categorizeGridError = (error: Error): GridErrorSeverity => {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();
  
  // Critical errors that affect the entire application
  if (name.includes("fatal") || 
      message.includes("cannot read property") || 
      message.includes("is not a function") ||
      message.includes("canvas disposed")) {
    return GridErrorSeverity.CRITICAL;
  }
  
  // High severity errors that affect grid functionality
  if (message.includes("render") || 
      message.includes("canvas") || 
      message.includes("initialization")) {
    return GridErrorSeverity.HIGH;
  }
  
  // Medium severity errors that affect grid appearance
  if (message.includes("grid") || 
      message.includes("object") || 
      message.includes("line")) {
    return GridErrorSeverity.MEDIUM;
  }
  
  // Low severity errors that don't significantly impact functionality
  return GridErrorSeverity.LOW;
};
