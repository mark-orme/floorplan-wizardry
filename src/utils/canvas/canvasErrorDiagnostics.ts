import logger from '@/utils/logger';

/**
 * Canvas Error Diagnostics
 * Utilities for logging and handling canvas-related errors
 */

export function logCanvasError(errorType: string, message: string, details?: any) {
  logger.canvasError(message, { type: errorType, details });
}

/**
 * Handle a generic canvas error
 * @param error Error object
 * @param context Context in which the error occurred
 */
export function handleCanvasError(error: any, context: string = 'Unknown'): void {
  const errorMessage = `Canvas error in ${context}: ${error.message || error}`;
  logCanvasError('Generic', errorMessage, { error });
}

/**
 * Handle a specific type of canvas error
 * @param errorType Type of error
 * @param message Error message
 * @param details Additional details about the error
 */
export function handleSpecificCanvasError(errorType: string, message: string, details?: any): void {
  logCanvasError(errorType, message, details);
}

/**
 * Report an issue with canvas initialization
 * @param message Error message
 * @param details Additional details
 */
export function reportCanvasInitializationError(message: string, details?: any): void {
  logCanvasError('Initialization', message, details);
}

/**
 * Report an issue with canvas rendering
 * @param message Error message
 * @param details Additional details
 */
export function reportCanvasRenderingError(message: string, details?: any): void {
  logCanvasError('Rendering', message, details);
}

/**
 * Report an issue with canvas event handling
 * @param message Error message
 * @param details Additional details
 */
export function reportCanvasEventError(message: string, details?: any): void {
  logCanvasError('Event Handling', message, details);
}

/**
 * Report an issue with canvas data processing
 * @param message Error message
 * @param details Additional details
 */
export function reportCanvasDataError(message: string, details?: any): void {
  logCanvasError('Data Processing', message, details);
}
