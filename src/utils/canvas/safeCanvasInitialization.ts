
import { Canvas as FabricCanvas } from "fabric";

let canvasInitialized = false;
let initializationAttempt = 0;
let canvasInitStartTime = 0;

/**
 * Reset canvas initialization state
 * Call this when a component using canvas is unmounted
 */
export const resetInitializationState = (): void => {
  canvasInitialized = false;
  initializationAttempt = 0;
  canvasInitStartTime = 0;
};

/**
 * Prepare canvas for initialization
 * @returns {boolean} Whether preparation was successful
 */
export const prepareCanvasForInitialization = (): boolean => {
  canvasInitStartTime = Date.now();
  initializationAttempt++;
  
  return true;
};

/**
 * Validate that canvas initialization completed successfully
 * @param {FabricCanvas} canvas - The canvas to validate
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvasInitialization = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  // Check that canvas has proper dimensions
  if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
    return false;
  }
  
  canvasInitialized = true;
  return true;
};

/**
 * Handle initialization failure
 * @param {Error} error - The error that occurred
 * @returns {string} Error message
 */
export const handleInitializationFailure = (error: Error): string => {
  console.error("Canvas initialization failed:", error);
  
  return error.message || "Unknown initialization error";
};
