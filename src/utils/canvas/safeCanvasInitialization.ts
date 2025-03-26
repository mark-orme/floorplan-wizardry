
/**
 * Safe canvas initialization utilities
 * Provides functions to ensure canvas is initialized safely without loops
 * @module safeCanvasInitialization
 */
import { Canvas } from "fabric";
import logger from "../logger";
import { forceCleanCanvasElement } from "../fabric";
import { toast } from "sonner";

// Initialization state tracker to prevent loops across components
const initializationState = {
  globalAttempts: 0,
  maxGlobalAttempts: 8,
  consecutiveAttempts: 0,
  maxConsecutiveAttempts: 3,
  lastAttemptTime: 0,
  minTimeBetweenAttempts: 1000, // ms
  cooldownActive: false,
  cooldownTimeout: null as number | null,
  blockedUntil: 0
};

/**
 * Reset the initialization state tracking
 * Used when canvas is successfully created
 */
export const resetInitializationState = (): void => {
  initializationState.globalAttempts = 0;
  initializationState.consecutiveAttempts = 0;
  initializationState.lastAttemptTime = 0;
  initializationState.cooldownActive = false;
  
  if (initializationState.cooldownTimeout) {
    window.clearTimeout(initializationState.cooldownTimeout);
    initializationState.cooldownTimeout = null;
  }
  
  initializationState.blockedUntil = 0;
  
  logger.info("Canvas initialization state has been reset");
};

/**
 * Check if canvas initialization is currently allowed
 * Used to prevent initialization loops
 * 
 * @returns {boolean} True if initialization is allowed, false otherwise
 */
export const canInitializeCanvas = (): boolean => {
  const now = Date.now();
  
  // If we're in a cooldown period, block initialization
  if (initializationState.cooldownActive) {
    return false;
  }
  
  // If we're blocked until a specific time, check if that time has passed
  if (initializationState.blockedUntil > 0 && now < initializationState.blockedUntil) {
    return false;
  }
  
  // Check if enough time has passed since the last attempt
  const timeSinceLastAttempt = now - initializationState.lastAttemptTime;
  if (timeSinceLastAttempt < initializationState.minTimeBetweenAttempts) {
    logger.warn(`Attempted to initialize too quickly: ${timeSinceLastAttempt}ms since last attempt`);
    return false;
  }
  
  return true;
};

/**
 * Track a canvas initialization attempt
 * Updates initialization state and checks if we should allow this attempt
 * 
 * @returns {{ 
 *   allowed: boolean,
 *   reason?: string,
 *   attemptCount: number,
 *   globalCount: number 
 * }} Initialization status
 */
export const trackInitializationAttempt = () => {
  const now = Date.now();
  
  // Update attempt counts
  initializationState.consecutiveAttempts++;
  initializationState.globalAttempts++;
  initializationState.lastAttemptTime = now;
  
  // Check if we've exceeded the maximum number of attempts
  if (initializationState.globalAttempts > initializationState.maxGlobalAttempts) {
    logger.error(`Too many global initialization attempts (${initializationState.globalAttempts}), blocking further attempts`);
    
    // Block initialization for 30 seconds
    initializationState.blockedUntil = now + 30000;
    
    return {
      allowed: false,
      reason: "max-global-attempts",
      attemptCount: initializationState.consecutiveAttempts,
      globalCount: initializationState.globalAttempts
    };
  }
  
  // Check if we've exceeded the maximum number of consecutive attempts
  if (initializationState.consecutiveAttempts > initializationState.maxConsecutiveAttempts) {
    logger.warn(`Too many consecutive initialization attempts (${initializationState.consecutiveAttempts}), entering cooldown`);
    
    // Activate cooldown for 5 seconds
    initializationState.cooldownActive = true;
    
    if (initializationState.cooldownTimeout) {
      window.clearTimeout(initializationState.cooldownTimeout);
    }
    
    initializationState.cooldownTimeout = window.setTimeout(() => {
      logger.info("Initialization cooldown period ended");
      initializationState.cooldownActive = false;
      initializationState.consecutiveAttempts = 0;
      initializationState.cooldownTimeout = null;
    }, 5000);
    
    return {
      allowed: false,
      reason: "max-consecutive-attempts",
      attemptCount: initializationState.consecutiveAttempts,
      globalCount: initializationState.globalAttempts
    };
  }
  
  return {
    allowed: true,
    attemptCount: initializationState.consecutiveAttempts,
    globalCount: initializationState.globalAttempts
  };
};

/**
 * Clean a canvas element and prepare it for re-initialization
 * Helps break initialization loops by ensuring a clean slate
 * 
 * @param {HTMLCanvasElement} canvasElement Canvas element to clean
 * @returns {boolean} Success status
 */
export const prepareCanvasForInitialization = (canvasElement: HTMLCanvasElement): boolean => {
  if (!canvasElement) return false;
  
  try {
    // Remove any Fabric.js data attributes
    forceCleanCanvasElement(canvasElement);
    
    // Force repaint by temporarily changing dimensions
    const originalWidth = canvasElement.width;
    const originalHeight = canvasElement.height;
    
    // Set to 1px to force a complete reset
    canvasElement.width = 1;
    canvasElement.height = 1;
    
    // Force a layout recalculation
    canvasElement.getBoundingClientRect();
    
    // Restore original dimensions
    canvasElement.width = originalWidth || 800;
    canvasElement.height = originalHeight || 600;
    
    logger.info("Canvas element prepared for initialization");
    return true;
  } catch (error) {
    logger.error("Failed to prepare canvas for initialization:", error);
    return false;
  }
};

/**
 * Validate canvas after initialization to ensure it's properly set up
 * 
 * @param {Canvas | null} canvas Fabric canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export const validateCanvasInitialization = (canvas: Canvas | null): boolean => {
  if (!canvas) {
    logger.error("Canvas validation failed: canvas is null");
    return false;
  }
  
  try {
    // Check dimensions
    if (canvas.width <= 0 || canvas.height <= 0) {
      logger.error("Canvas validation failed: invalid dimensions", {
        width: canvas.width,
        height: canvas.height
      });
      return false;
    }
    
    // Check if the canvas element exists and is a canvas element
    const element = canvas.getElement();
    if (!element || !(element instanceof HTMLCanvasElement)) {
      logger.error("Canvas validation failed: invalid element");
      return false;
    }
    
    // All checks passed
    logger.info("Canvas validation passed");
    return true;
  } catch (error) {
    logger.error("Canvas validation error:", error);
    return false;
  }
};

/**
 * Handle canvas initialization failure with appropriate user feedback
 * 
 * @param {Error | string} error The error that occurred
 * @param {boolean} showToast Whether to show a toast notification
 */
export const handleInitializationFailure = (
  error: Error | string,
  showToast: boolean = true
): void => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  logger.error("Canvas initialization failed:", errorMessage);
  
  // Show a toast notification if requested
  if (showToast) {
    toast.error("Failed to initialize canvas. Please refresh the page.", {
      id: "canvas-init-error",
      duration: 5000
    });
  }
  
  // Increment the consecutive attempts counter
  initializationState.consecutiveAttempts++;
};
