
/**
 * Safe canvas initialization utilities
 * Handles initialization with better error handling and recovery
 * @module canvas/safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

// State to track initialization attempts
const initializationState = {
  attemptCount: 0,
  lastAttemptTime: 0,
  isInProgress: false,
  maxAttempts: 5,
  canInitialize: true,
  blockedReason: "",
  errors: [] as string[]
};

/**
 * Reset the initialization state tracking
 * Used when component remounts or when retry is needed
 */
export const resetInitializationState = (): void => {
  initializationState.attemptCount = 0;
  initializationState.lastAttemptTime = 0;
  initializationState.isInProgress = false;
  initializationState.canInitialize = true;
  initializationState.blockedReason = "";
  initializationState.errors = [];
  logger.info("Canvas initialization state has been reset");
};

/**
 * Prepare a canvas element for initialization
 * Sets initial state and prepares the DOM element
 * @param {HTMLCanvasElement} canvasElement - Canvas element to prepare
 */
export const prepareCanvasForInitialization = (canvasElement: HTMLCanvasElement): void => {
  // Add a class to indicate initialization is in progress
  canvasElement.classList.add("canvas-initializing");
  
  // Remove any old error indicators
  canvasElement.classList.remove("canvas-error");
  
  // Set tabindex to make canvas focusable
  canvasElement.setAttribute("tabindex", "0");
  
  // Set aria attributes for accessibility
  canvasElement.setAttribute("aria-label", "Floor plan drawing canvas");
  canvasElement.setAttribute("role", "application");
  
  // Record that initialization is in progress
  initializationState.isInProgress = true;
};

/**
 * Validate that a canvas has been properly initialized
 * @param {FabricCanvas} canvas - Canvas to validate
 * @returns {boolean} True if canvas passed validation
 */
export const validateCanvasInitialization = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Check essential Fabric.js methods exist
    if (typeof canvas.renderAll !== "function") return false;
    if (typeof canvas.setWidth !== "function") return false;
    if (typeof canvas.setHeight !== "function") return false;
    
    // Get basic properties to verify canvas object is working
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Should have valid dimensions
    if (width <= 0 || height <= 0) return false;
    
    // Mark initialization as complete
    initializationState.isInProgress = false;
    
    return true;
  } catch (error) {
    logger.error("Canvas validation failed:", error);
    return false;
  }
};

/**
 * Handle initialization failure
 * Records error and may block further attempts
 * @param {string} reason - Reason for failure
 * @param {boolean} blockFurtherAttempts - Whether to block further attempts
 */
export const handleInitializationFailure = (
  reason: string, 
  blockFurtherAttempts: boolean = false
): void => {
  initializationState.errors.push(reason);
  initializationState.isInProgress = false;
  
  // Check if we've exceeded maximum attempts
  if (initializationState.attemptCount >= initializationState.maxAttempts) {
    initializationState.canInitialize = false;
    initializationState.blockedReason = 
      `Canvas initialization blocked after ${initializationState.maxAttempts} attempts`;
    logger.error(initializationState.blockedReason);
  }
  
  // Explicitly block further attempts if specified
  if (blockFurtherAttempts) {
    initializationState.canInitialize = false;
    initializationState.blockedReason = reason;
    logger.error(`Canvas initialization explicitly blocked: ${reason}`);
  }
};

/**
 * Track initialization attempt
 * Increments counter and records time
 * @returns {number} The current attempt count
 */
export const trackInitializationAttempt = (): number => {
  initializationState.attemptCount += 1;
  initializationState.lastAttemptTime = Date.now();
  return initializationState.attemptCount;
};

/**
 * Check if canvas can be initialized
 * @returns {boolean} True if canvas can be initialized
 */
export const canInitializeCanvas = (): boolean => {
  return initializationState.canInitialize;
};

/**
 * Get the current initialization state
 * @returns {Object} The current initialization state
 */
export const getInitializationState = () => {
  return { ...initializationState };
};
