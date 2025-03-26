
/**
 * Safe Canvas Initialization Utilities
 * Functions for safely initializing and validating canvas
 * @module safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Initialization status tracking object
 * @type {Object}
 */
let initializationStatus = {
  inProgress: false,
  attemptCount: 0,
  lastAttemptTime: 0,
  blocked: false,
  errorCount: 0,
  successCount: 0
};

/**
 * Reset the initialization state
 * Call this when component remounts
 */
export function resetInitializationState(): void {
  initializationStatus = {
    inProgress: false,
    attemptCount: 0,
    lastAttemptTime: 0,
    blocked: false,
    errorCount: 0,
    successCount: 0
  };
  logger.info("Canvas initialization state reset");
}

/**
 * Get the current initialization status
 * @returns {Object} Current initialization status
 */
export function getInitializationStatus() {
  return { ...initializationStatus };
}

/**
 * Prepare canvas element for initialization
 * @param {HTMLCanvasElement} canvasElement - The canvas element to prepare
 */
export function prepareCanvasForInitialization(canvasElement: HTMLCanvasElement): void {
  if (!canvasElement) return;

  // Clear any existing content
  const context = canvasElement.getContext('2d');
  if (context) {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  
  // Set data attribute to mark canvas as being initialized
  canvasElement.setAttribute('data-initialization-in-progress', 'true');
  
  // Log this attempt
  initializationStatus.attemptCount++;
  initializationStatus.lastAttemptTime = Date.now();
  initializationStatus.inProgress = true;
  
  // Block if too many attempts
  if (initializationStatus.attemptCount > 5 && 
      Date.now() - initializationStatus.lastAttemptTime < 10000) {
    initializationStatus.blocked = true;
    logger.warn(`Canvas initialization blocked after ${initializationStatus.attemptCount} attempts`);
    throw new Error(`Canvas initialization blocked after ${initializationStatus.attemptCount} attempts`);
  }
}

/**
 * Validate canvas initialization
 * @param {FabricCanvas} canvas - The fabric canvas to validate
 * @returns {boolean} True if canvas is valid
 */
export function validateCanvasInitialization(canvas: FabricCanvas | null): boolean {
  if (!canvas) {
    initializationStatus.errorCount++;
    return false;
  }
  
  // Basic validation checks
  const isValid = (
    canvas.width > 0 &&
    canvas.height > 0 &&
    typeof canvas.add === 'function' &&
    typeof canvas.renderAll === 'function'
  );
  
  // Update status
  if (isValid) {
    initializationStatus.successCount++;
    initializationStatus.inProgress = false;
  } else {
    initializationStatus.errorCount++;
  }
  
  return isValid;
}

/**
 * Handle initialization failure
 * @param {string} errorMessage - Error message
 * @param {boolean} critical - Whether this is a critical failure
 */
export function handleInitializationFailure(errorMessage: string, critical: boolean = false): void {
  initializationStatus.errorCount++;
  initializationStatus.inProgress = false;
  
  if (critical) {
    initializationStatus.blocked = true;
  }
  
  logger.error(`Canvas initialization failed: ${errorMessage}`, { 
    critical,
    status: { ...initializationStatus }
  });
}

