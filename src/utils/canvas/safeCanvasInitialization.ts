
/**
 * Safe canvas initialization utilities
 * @module canvas/safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

/**
 * Initialization state interface
 */
interface InitializationState {
  attemptCount: number;
  lastAttemptTime: number;
  isInProgress: boolean;
  maxAttempts: number;
  canInitialize: boolean;
  blockedReason: string;
  errors: string[];
  initializationInProgress: boolean;
  canvasDisposalInProgress: boolean;
  isInitialized: boolean;
}

// Global initialization state
let initState: InitializationState = {
  attemptCount: 0,
  lastAttemptTime: 0,
  isInProgress: false,
  maxAttempts: 5,
  canInitialize: true,
  blockedReason: '',
  errors: [],
  initializationInProgress: false,
  canvasDisposalInProgress: false,
  isInitialized: false
};

/**
 * Reset initialization state
 */
export const resetInitializationState = (): void => {
  initState = {
    attemptCount: 0,
    lastAttemptTime: 0,
    isInProgress: false,
    maxAttempts: 5,
    canInitialize: true,
    blockedReason: '',
    errors: [],
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    isInitialized: false
  };
  logger.info('Canvas initialization state reset');
};

/**
 * Check if initialization should continue
 * @returns Validation result with status and message
 */
export const shouldContinueInitialization = (): { 
  shouldContinue: boolean; 
  reason?: string; 
  isMaxAttemptsReached: boolean; 
  isCycleDetected: boolean;
} => {
  const now = Date.now();
  const timeSinceLastAttempt = now - initState.lastAttemptTime;
  
  // Check if max attempts reached
  if (initState.attemptCount >= initState.maxAttempts) {
    return { 
      shouldContinue: false, 
      reason: `Maximum initialization attempts (${initState.maxAttempts}) reached`,
      isMaxAttemptsReached: true,
      isCycleDetected: false
    };
  }
  
  // Check for rapid cycles (prevent infinite loops)
  if (timeSinceLastAttempt < 100 && initState.attemptCount > 2) {
    return { 
      shouldContinue: false, 
      reason: 'Initialization cycle detected (too many attempts in short time)',
      isMaxAttemptsReached: false,
      isCycleDetected: true
    };
  }
  
  // Check if already initialized
  if (initState.isInitialized) {
    return { 
      shouldContinue: false, 
      reason: 'Canvas already initialized',
      isMaxAttemptsReached: false,
      isCycleDetected: false
    };
  }
  
  // Check if initialization is already in progress
  if (initState.initializationInProgress) {
    return { 
      shouldContinue: false, 
      reason: 'Initialization already in progress',
      isMaxAttemptsReached: false,
      isCycleDetected: false
    };
  }
  
  // Check if canvas disposal is in progress
  if (initState.canvasDisposalInProgress) {
    return { 
      shouldContinue: false, 
      reason: 'Canvas disposal in progress',
      isMaxAttemptsReached: false,
      isCycleDetected: false
    };
  }
  
  return { 
    shouldContinue: true,
    isMaxAttemptsReached: false,
    isCycleDetected: false
  };
};

/**
 * Prepare canvas element for initialization
 * @param canvasElement - Canvas element to prepare
 */
export const prepareCanvasForInitialization = (canvasElement: HTMLCanvasElement): void => {
  if (!canvasElement) {
    throw new Error('Cannot prepare null canvas element');
  }
  
  // Increment attempt counter
  initState.attemptCount++;
  initState.lastAttemptTime = Date.now();
  initState.initializationInProgress = true;
  
  try {
    // Make sure the element is visible
    canvasElement.style.display = 'block';
    
    // Clear any existing inline styles that might interfere
    canvasElement.style.position = 'relative';
    canvasElement.style.userSelect = 'none';
    
    // Reset any transform
    canvasElement.style.transform = 'none';
    
    // Mark that initialization has started
    logger.info(`Preparing canvas for initialization (attempt ${initState.attemptCount})`);
  } catch (error) {
    logger.error('Error preparing canvas for initialization:', error);
    throw error;
  }
};

/**
 * Validate that canvas initialization succeeded
 * @param canvas - Canvas instance to validate
 * @returns Whether canvas is valid
 */
export const validateCanvasInitialization = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    initState.errors.push('Canvas is null after initialization');
    initState.initializationInProgress = false;
    return false;
  }
  
  try {
    // Check that canvas has required methods
    const isValid = (
      typeof canvas.getWidth === 'function' &&
      typeof canvas.getHeight === 'function' &&
      typeof canvas.add === 'function' &&
      typeof canvas.remove === 'function' &&
      typeof canvas.getObjects === 'function'
    );
    
    if (isValid) {
      initState.isInitialized = true;
      initState.initializationInProgress = false;
      logger.info('Canvas initialization validated successfully');
      return true;
    } else {
      initState.errors.push('Canvas is missing required methods');
      initState.initializationInProgress = false;
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    initState.errors.push(`Error validating canvas: ${errorMessage}`);
    initState.initializationInProgress = false;
    return false;
  }
};

/**
 * Handle initialization failure
 * @param error - Error message or object
 * @param shouldReset - Whether to reset canvas state
 */
export const handleInitializationFailure = (error: unknown, shouldReset: boolean = false): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Log the error
  logger.error('Canvas initialization failed:', errorMessage);
  
  // Store the error
  initState.errors.push(errorMessage);
  
  // Reset the initialization state if requested
  initState.initializationInProgress = false;
  
  if (shouldReset) {
    resetInitializationState();
  }
};

/**
 * Get current initialization state attempts
 * @returns Current attempt count
 */
export const getInitializationAttempts = (): number => {
  return initState.attemptCount;
};

/**
 * Get initialization errors
 * @returns Array of error messages
 */
export const getInitializationErrors = (): string[] => {
  return [...initState.errors];
};
