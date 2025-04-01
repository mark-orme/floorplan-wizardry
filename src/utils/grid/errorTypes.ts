
/**
 * Grid error types and utilities
 * @module utils/grid/errorTypes
 */

/**
 * Grid error severity levels
 */
export enum GridErrorSeverity {
  /** Low severity, non-critical errors */
  LOW = 'low',
  /** Medium severity, may affect functionality but not critical */
  MEDIUM = 'medium',
  /** High severity, critical errors that prevent grid functionality */
  HIGH = 'high'
}

/**
 * Standard grid error messages
 */
export const GRID_ERROR_MESSAGES = {
  CANVAS_NULL: 'Canvas is null or undefined',
  CANVAS_INVALID: 'Canvas has invalid dimensions',
  GRID_EMPTY: 'No grid objects found',
  GRID_CREATION_FAILED: 'Failed to create grid',
  GRID_VISIBILITY_FAILED: 'Failed to update grid visibility',
  CANVAS_INITIALIZATION_FAILED: 'Canvas initialization failed',
  GRID_RENDERING_ERROR: 'Error rendering grid',
  GRID_MISSING_REQUIRED_METHODS: 'Canvas missing required methods',
  MARKER_CREATION_FAILED: 'Failed to create grid markers'
};

/**
 * Categorize a grid error by severity
 * @param error - Error to categorize
 * @returns Error severity
 */
export function categorizeGridError(error: Error): GridErrorSeverity {
  const message = error.message || '';
  
  // High severity errors
  if (
    message.includes('null') ||
    message.includes('undefined') ||
    message.includes('initialization failed')
  ) {
    return GridErrorSeverity.HIGH;
  }
  
  // Medium severity errors
  if (
    message.includes('dimensions') ||
    message.includes('grid') ||
    message.includes('creation failed') ||
    message.includes('rendering error')
  ) {
    return GridErrorSeverity.MEDIUM;
  }
  
  // Default to low severity
  return GridErrorSeverity.LOW;
}
