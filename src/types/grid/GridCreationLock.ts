
/**
 * Type definition for grid creation locking mechanism
 * Prevents concurrent grid creation operations
 * 
 * @module types/grid/GridCreationLock
 */

/**
 * Grid creation lock interface
 * Used to synchronize grid creation across components
 */
export default interface GridCreationLock {
  /** Whether grid creation is currently locked */
  isLocked: boolean;
  /** Timestamp when lock was acquired */
  lockedAt: number | null;
  /** Timeout for lock expiration (in ms) */
  lockTimeout: number;
  /** Timestamp when lock expires - required */
  lockExpiresAt: number;
  /** Whether the grid was successfully created */
  gridCreated: boolean;
  /** Number of grid creation attempts */
  attempts: number;
  /** Maximum allowed attempts */
  maxAttempts: number;
  /** Optional error message if grid creation failed */
  error?: string;
}

/**
 * Create a default grid creation lock object
 * @returns Default grid creation lock
 */
export const createDefaultGridCreationLock = (): GridCreationLock => ({
  isLocked: false,
  lockedAt: 0,
  lockTimeout: 5000, // 5 seconds default timeout
  lockExpiresAt: 0,
  gridCreated: false,
  attempts: 0,
  maxAttempts: 3
});

/**
 * Type guard to check if an object is a valid GridCreationLock
 * @param obj - Object to check
 * @returns True if object matches GridCreationLock interface
 */
export const isGridCreationLock = (obj: unknown): obj is GridCreationLock => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'isLocked' in obj &&
    'lockedAt' in obj &&
    'lockTimeout' in obj &&
    'lockExpiresAt' in obj &&
    'gridCreated' in obj &&
    'attempts' in obj &&
    'maxAttempts' in obj
  );
};

/**
 * Validates and normalizes a GridCreationLock object
 * @param lock - Partial GridCreationLock to validate
 * @returns A valid GridCreationLock object
 */
export const validateGridCreationLock = (lock: Partial<GridCreationLock>): GridCreationLock => {
  const defaultLock = createDefaultGridCreationLock();
  
  if (!lock || typeof lock !== 'object') {
    return defaultLock;
  }
  
  return {
    isLocked: typeof lock.isLocked === 'boolean' ? lock.isLocked : defaultLock.isLocked,
    lockedAt: typeof lock.lockedAt === 'number' ? lock.lockedAt : defaultLock.lockedAt,
    lockTimeout: typeof lock.lockTimeout === 'number' ? lock.lockTimeout : defaultLock.lockTimeout,
    lockExpiresAt: typeof lock.lockExpiresAt === 'number' ? lock.lockExpiresAt : defaultLock.lockExpiresAt,
    gridCreated: typeof lock.gridCreated === 'boolean' ? lock.gridCreated : defaultLock.gridCreated,
    attempts: typeof lock.attempts === 'number' ? lock.attempts : defaultLock.attempts,
    maxAttempts: typeof lock.maxAttempts === 'number' ? lock.maxAttempts : defaultLock.maxAttempts,
    error: typeof lock.error === 'string' ? lock.error : undefined
  };
};
