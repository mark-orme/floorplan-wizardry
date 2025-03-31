
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
  /** Timestamp when lock expires */
  lockExpiresAt?: number;
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
