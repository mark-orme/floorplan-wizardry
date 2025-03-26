
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

// State tracking for canvas initialization
let initializationState = {
  attemptCount: 0,
  lastAttemptTime: 0,
  isInProgress: false,
  maxAttempts: 3,
  canInitialize: true,
  blockedReason: '',
  errors: [] as string[],
  initializationInProgress: false,
  canvasDisposalInProgress: false,
  isInitialized: false
};

// Global safety timeouts
let safetyTimeout: NodeJS.Timeout | null = null;
let creationTimeout: NodeJS.Timeout | null = null;

/**
 * Reset canvas initialization state
 * Call this when a complete reset is needed
 */
export const resetInitializationState = () => {
  // Clear any pending timeouts
  if (safetyTimeout) clearTimeout(safetyTimeout);
  if (creationTimeout) clearTimeout(creationTimeout);
  
  // Reset the state object
  initializationState = {
    attemptCount: 0,
    lastAttemptTime: 0,
    isInProgress: false,
    maxAttempts: 3,
    canInitialize: true,
    blockedReason: '',
    errors: [],
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    isInitialized: false
  };
  
  logger.info("Canvas initialization state reset");
};

/**
 * Get current initialization state (read-only)
 * @returns Current initialization state
 */
export const getInitializationState = () => {
  return { ...initializationState };
};

/**
 * Update initialization state
 * @param updates - Partial state updates
 */
export const updateInitializationState = (updates: Partial<typeof initializationState>) => {
  initializationState = {
    ...initializationState,
    ...updates
  };
};

/**
 * Check if canvas initialization can proceed
 * @returns Object with result and reason
 */
export const canInitializeCanvas = () => {
  // Check if initialization is already in progress
  if (initializationState.isInProgress) {
    return {
      shouldContinue: false,
      reason: 'Initialization already in progress'
    };
  }
  
  // Check for too many attempts
  if (initializationState.attemptCount >= initializationState.maxAttempts) {
    return {
      isMaxAttemptsReached: true,
      shouldContinue: false,
      reason: `Maximum attempts (${initializationState.maxAttempts}) reached`
    };
  }
  
  // Check for rapid reinitializations
  const now = Date.now();
  const timeSinceLastAttempt = now - initializationState.lastAttemptTime;
  if (initializationState.lastAttemptTime > 0 && timeSinceLastAttempt < 1000) {
    return {
      isCycleDetected: true,
      shouldContinue: false,
      reason: 'Initialization cycle detected (too frequent attempts)'
    };
  }
  
  return {
    shouldContinue: true,
    reason: 'Canvas initialization can proceed'
  };
};

/**
 * Record canvas initialization attempt
 */
export const recordInitializationAttempt = () => {
  updateInitializationState({
    attemptCount: initializationState.attemptCount + 1,
    lastAttemptTime: Date.now(),
    isInProgress: true,
    initializationInProgress: true
  });
};

/**
 * Record canvas disposal start
 */
export const recordDisposalStart = () => {
  updateInitializationState({
    canvasDisposalInProgress: true
  });
};

/**
 * Record canvas initialization completed
 * @param success - Whether initialization was successful
 * @param error - Error message if initialization failed
 */
export const recordInitializationCompleted = (success: boolean, error?: string) => {
  updateInitializationState({
    isInProgress: false,
    isInitialized: success,
    initializationInProgress: false,
    canvasDisposalInProgress: false
  });
  
  if (!success && error) {
    initializationState.errors.push(error);
  }
};

/**
 * Initialize canvas with safety mechanisms
 * @param canvasElement - Canvas element to initialize
 * @param options - Canvas initialization options
 * @returns New FabricCanvas instance
 */
export const safeInitializeCanvas = (
  canvasElement: HTMLCanvasElement | null,
  options: Record<string, any> = {}
): FabricCanvas | null => {
  if (!canvasElement) {
    logger.error('Cannot initialize canvas: element is null');
    return null;
  }
  
  try {
    // Record initialization attempt
    recordInitializationAttempt();
    
    // Start a safety timeout to prevent hanging initializations
    if (safetyTimeout) clearTimeout(safetyTimeout);
    safetyTimeout = setTimeout(() => {
      if (initializationState.initializationInProgress) {
        logger.warn('Canvas initialization safety timeout triggered');
        recordInitializationCompleted(false, 'Safety timeout triggered');
      }
    }, 5000);
    
    // Create new Fabric canvas
    const canvas = new FabricCanvas(canvasElement, options);
    
    // We were successful, so complete initialization
    recordInitializationCompleted(true);
    if (safetyTimeout) clearTimeout(safetyTimeout);
    
    return canvas;
  } catch (error) {
    logger.error('Error initializing canvas:', error);
    recordInitializationCompleted(false, String(error));
    if (safetyTimeout) clearTimeout(safetyTimeout);
    return null;
  }
};

/**
 * Safely dispose of a canvas
 * @param canvas - Canvas to dispose
 */
export const safeDisposeCanvas = (canvas: FabricCanvas | null): void => {
  if (!canvas) return;
  
  try {
    recordDisposalStart();
    canvas.dispose();
    logger.info('Canvas disposed successfully');
  } catch (error) {
    logger.error('Error disposing canvas:', error);
  } finally {
    updateInitializationState({
      canvasDisposalInProgress: false
    });
  }
};

/**
 * Safely check if canvas is initialized
 * @param canvas - Canvas to check
 */
export const isCanvasInitialized = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Check if canvas has basic properties that would be set during initialization
    return (
      canvas.getWidth !== undefined &&
      canvas.getHeight !== undefined &&
      !initializationState.initializationInProgress &&
      !initializationState.canvasDisposalInProgress
    );
  } catch (error) {
    logger.error('Error checking canvas initialization:', error);
    return false;
  }
};

/**
 * Get metrics about canvas initialization
 */
export const getInitializationMetrics = () => {
  return {
    attempts: initializationState.attemptCount,
    maxAttempts: initializationState.maxAttempts,
    lastAttemptTime: initializationState.lastAttemptTime,
    isInitialized: initializationState.isInitialized,
    errors: [...initializationState.errors]
  };
};
