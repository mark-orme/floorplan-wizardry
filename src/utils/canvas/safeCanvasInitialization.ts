/**
 * Utilities for safe canvas initialization with protection against initialization loops
 * @module safeCanvasInitialization
 */

/**
 * Configuration for initialization tracking
 */
const CONFIG = {
  /** Maximum global initialization attempts allowed */
  MAX_GLOBAL_ATTEMPTS: 12,
  /** Maximum consecutive initialization attempts allowed */
  MAX_CONSECUTIVE_ATTEMPTS: 6,
  /** Time window in ms to consider attempts consecutive */
  TIME_WINDOW_MS: 10000,
};

/**
 * Stores global initialization state
 */
let initializationState = {
  /** Total number of initialization attempts */
  globalAttempts: 0,
  /** Number of consecutive initialization attempts */
  consecutiveAttempts: 0,
  /** Timestamp of last initialization attempt */
  lastAttemptTime: 0,
  /** Whether canvas has been successfully initialized */
  hasInitialized: false,
};

/**
 * Status object returned by initialization tracking
 * @interface InitializationStatus
 */
interface InitializationStatus {
  /** Whether the initialization is allowed */
  allowed: boolean;
  /** Reason why initialization is not allowed */
  reason?: 'max-global-attempts' | 'max-consecutive-attempts';
  /** Current count of consecutive attempts */
  consecutiveCount: number;
  /** Current count of global attempts */
  globalCount: number;
}

/**
 * Reset initialization state tracking
 * Use this after successful initialization or to force reset for testing
 */
export const resetInitializationState = (): void => {
  initializationState = {
    globalAttempts: 0,
    consecutiveAttempts: 0,
    lastAttemptTime: 0,
    hasInitialized: false,
  };
  console.log('🔄 Canvas initialization state reset');
};

/**
 * Track a new initialization attempt and check if it should be allowed
 * @returns {InitializationStatus} Status object with attempt information
 */
export const trackInitializationAttempt = (): InitializationStatus => {
  const now = Date.now();
  
  // Check if this attempt is within the time window of the last attempt
  if (now - initializationState.lastAttemptTime < CONFIG.TIME_WINDOW_MS) {
    initializationState.consecutiveAttempts++;
  } else {
    // Reset consecutive counter if outside time window
    initializationState.consecutiveAttempts = 1;
  }
  
  // Always increment global counter
  initializationState.globalAttempts++;
  
  // Update last attempt time
  initializationState.lastAttemptTime = now;
  
  // Check if we've hit any limits
  if (initializationState.globalAttempts > CONFIG.MAX_GLOBAL_ATTEMPTS) {
    return {
      allowed: false,
      reason: 'max-global-attempts',
      consecutiveCount: initializationState.consecutiveAttempts,
      globalCount: initializationState.globalAttempts
    };
  }
  
  if (initializationState.consecutiveAttempts > CONFIG.MAX_CONSECUTIVE_ATTEMPTS) {
    return {
      allowed: false,
      reason: 'max-consecutive-attempts',
      consecutiveCount: initializationState.consecutiveAttempts,
      globalCount: initializationState.globalAttempts
    };
  }
  
  // Otherwise, allow the attempt
  return {
    allowed: true,
    consecutiveCount: initializationState.consecutiveAttempts,
    globalCount: initializationState.globalAttempts
  };
};

/**
 * Mark canvas as successfully initialized
 * This resets consecutive attempts counter but keeps global count
 */
export const markCanvasInitialized = (): void => {
  initializationState.consecutiveAttempts = 0;
  initializationState.hasInitialized = true;
};

/**
 * Check if canvas initialization is allowed
 * @returns {boolean} Whether initialization is allowed
 */
export const canInitializeCanvas = (): boolean => {
  // If we've never initialized before, always allow first attempt
  if (initializationState.globalAttempts === 0) {
    return true;
  }
  
  // Check against limits
  return (
    initializationState.globalAttempts <= CONFIG.MAX_GLOBAL_ATTEMPTS &&
    initializationState.consecutiveAttempts <= CONFIG.MAX_CONSECUTIVE_ATTEMPTS
  );
};

/**
 * Get current initialization state for debugging
 * @returns Current initialization state object
 */
export const getInitializationState = () => {
  return { ...initializationState };
};
