
/**
 * Grid safety hook
 * Manages safety mechanisms for grid creation
 * @module useGridSafety
 */
import { useCallback, useRef } from "react";
import logger from "@/utils/logger";

/**
 * Default safety timeout duration in milliseconds
 * @constant {number}
 */
const DEFAULT_SAFETY_TIMEOUT = 5000; // 5 seconds

/**
 * Interface for grid creation lock state
 * @interface GridCreationLock
 */
interface GridCreationLock {
  /** Unique identifier for the lock */
  id: number;
  /** Whether the lock is currently held */
  isLocked: boolean;
  /** Timestamp when the lock was acquired */
  timestamp: number;
}

/**
 * Interface for safety lock acquisition result
 * @interface SafetyLockResult
 */
interface SafetyLockResult {
  /** Unique ID of the acquired lock */
  lockId: number;
  /** ID of the safety timeout */
  safetyTimeoutId: number;
}

/**
 * Interface for grid safety hook result
 * @interface GridSafetyResult
 */
interface GridSafetyResult {
  /** Function to acquire a safety lock */
  acquireSafetyLock: (timeout?: number) => SafetyLockResult | null;
  /** Function to release a safety lock */
  releaseSafetyLock: (lockId: number) => boolean;
  /** Function to check if safety lock is held */
  isSafetyLockHeld: () => boolean;
  /** Function to reset safety state */
  resetSafetyState: () => void;
}

/**
 * Hook for managing grid creation safety
 * Implements lock mechanism and safety timeouts
 * 
 * @returns {GridSafetyResult} Safety management functions
 */
export const useGridSafety = (): GridSafetyResult => {
  // Safety state refs
  const safetyTimeoutRef = useRef<number | null>(null);
  const creationLockRef = useRef<GridCreationLock>({ 
    id: 0, 
    isLocked: false, 
    timestamp: 0 
  });
  
  /**
   * Acquire a safety lock for grid creation
   * Prevents concurrent grid creation operations
   * 
   * @param {number} [timeout] - Custom timeout duration
   * @returns {SafetyLockResult|null} Lock information or null if couldn't acquire
   */
  const acquireSafetyLock = useCallback((
    timeout: number = DEFAULT_SAFETY_TIMEOUT
  ): SafetyLockResult | null => {
    // Check if lock is already held
    if (creationLockRef.current.isLocked) {
      logger.debug("Grid creation lock already held, can't acquire new lock");
      return null;
    }
    
    // Clear any existing timeout
    if (safetyTimeoutRef.current !== null) {
      window.clearTimeout(safetyTimeoutRef.current);
    }
    
    // Generate a new lock ID
    const lockId = Math.floor(Math.random() * 1000000);
    
    // Set the lock
    creationLockRef.current = {
      id: lockId,
      isLocked: true,
      timestamp: Date.now()
    };
    
    // Set up safety timeout to release lock automatically
    const safetyTimeoutId = window.setTimeout(() => {
      logger.warn(`Grid creation safety timeout triggered after ${timeout}ms`);
      releaseSafetyLock(lockId);
    }, timeout);
    
    // Store timeout ID
    safetyTimeoutRef.current = safetyTimeoutId;
    
    logger.debug(`Grid creation safety lock acquired: ${lockId}, timeout: ${timeout}ms`);
    
    return { lockId, safetyTimeoutId };
  }, []);
  
  /**
   * Release a safety lock
   * Clears timeout and releases lock
   * 
   * @param {number} lockId - ID of the lock to release
   * @returns {boolean} Whether lock was successfully released
   */
  const releaseSafetyLock = useCallback((lockId: number): boolean => {
    // Verify lock ID matches
    if (creationLockRef.current.id !== lockId) {
      logger.warn(`Attempted to release grid creation lock with incorrect ID: ${lockId} vs ${creationLockRef.current.id}`);
      return false;
    }
    
    // Clear safety timeout
    if (safetyTimeoutRef.current !== null) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    
    // Release the lock
    creationLockRef.current = {
      id: 0,
      isLocked: false,
      timestamp: 0
    };
    
    logger.debug(`Grid creation safety lock released: ${lockId}`);
    
    return true;
  }, []);
  
  /**
   * Check if safety lock is held
   * @returns {boolean} Whether lock is currently held
   */
  const isSafetyLockHeld = useCallback((): boolean => {
    return creationLockRef.current.isLocked;
  }, []);
  
  /**
   * Reset safety state
   * Clears timeout and releases any held lock
   */
  const resetSafetyState = useCallback((): void => {
    // Clear safety timeout
    if (safetyTimeoutRef.current !== null) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    
    // Reset lock
    creationLockRef.current = {
      id: 0,
      isLocked: false,
      timestamp: 0
    };
    
    logger.debug("Grid creation safety state reset");
  }, []);
  
  return {
    acquireSafetyLock,
    releaseSafetyLock,
    isSafetyLockHeld,
    resetSafetyState
  };
};
