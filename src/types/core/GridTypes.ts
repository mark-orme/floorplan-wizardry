
/**
 * Grid types and state interfaces
 * @module types/core/GridTypes
 */

/**
 * Grid creation lock state
 * Used for preventing concurrent grid creation attempts
 */
export interface GridCreationLock {
  /** Whether the grid creation is locked */
  isLocked: boolean;
  /** Identifier of the entity that locked the grid creation */
  lockedBy: string;
  /** Timestamp when the grid was locked */
  lockedAt: number;
  /** Maximum lock time in milliseconds */
  maxLockTime: number;
  /** Timestamp when the lock expires */
  lockExpiresAt: number;
}

/**
 * Default grid creation lock state
 */
export const DEFAULT_GRID_CREATION_LOCK: GridCreationLock = {
  isLocked: false,
  lockedBy: '',
  lockedAt: 0,
  maxLockTime: 30000, // 30 seconds default lock time
  lockExpiresAt: 0
};

/**
 * Grid creation state
 * Tracks the state of grid creation/initialization
 */
export interface GridCreationState {
  /** Whether grid creation has started */
  started: boolean;
  /** Whether grid creation has completed */
  completed: boolean;
  /** Number of objects created */
  objectCount: number;
  /** Timestamp when grid creation started */
  startTime: number;
  /** Timestamp when grid creation ended */
  endTime: number;
  /** Error string if any */
  error: string | null;
  /** Whether grid creation is in progress */
  inProgress: boolean;
  /** Whether grid has been created */
  isCreated: boolean;
  /** Number of attempts made to create the grid */
  attempts: number;
  /** Timestamp of last attempt */
  lastAttemptTime: number;
  /** Error message if any */
  errorMessage: string;
  /** Whether there was an error */
  hasError: boolean;
  /** Whether creation is in progress */
  creationInProgress: boolean;
  /** Number of consecutive resets */
  consecutiveResets: number;
  /** Maximum allowed consecutive resets */
  maxConsecutiveResets: number;
  /** Time of last creation */
  lastCreationTime: number;
  /** Throttle interval in milliseconds */
  throttleInterval: number;
  /** Whether the grid exists */
  exists: boolean;
  /** Total number of creations */
  totalCreations: number;
  /** Maximum allowed recreations */
  maxRecreations: number;
  /** Minimum interval between recreations */
  minRecreationInterval: number;
  /** Grid creation lock state */
  creationLock: GridCreationLock;
}

/**
 * Default grid creation state
 */
export const DEFAULT_GRID_CREATION_STATE: GridCreationState = {
  started: false,
  completed: false,
  objectCount: 0,
  startTime: 0,
  endTime: 0,
  error: null,
  inProgress: false,
  isCreated: false,
  attempts: 0,
  lastAttemptTime: 0,
  errorMessage: '',
  hasError: false,
  creationInProgress: false,
  consecutiveResets: 0,
  maxConsecutiveResets: 3,
  lastCreationTime: 0,
  throttleInterval: 2000, // 2 seconds
  exists: false,
  totalCreations: 0,
  maxRecreations: 5,
  minRecreationInterval: 5000, // 5 seconds
  creationLock: { ...DEFAULT_GRID_CREATION_LOCK }
};
