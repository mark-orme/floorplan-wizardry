
/**
 * Grid creation state interface
 * Contains information about the current state of grid creation
 */
export interface GridCreationState {
  /** Whether grid creation has started */
  started: boolean;
  /** Whether grid creation is complete */
  completed: boolean;
  /** Timestamp of when grid creation started */
  startTime?: number;
  /** Timestamp of when grid creation completed */
  endTime?: number;
  /** Number of grid objects created */
  objectCount: number;
  /** Any error that occurred during grid creation */
  error?: string;
}

/**
 * Grid creation lock interface
 * Used to prevent multiple simultaneous grid creation attempts
 */
export interface GridCreationLock {
  /** Whether the grid creation is locked */
  isLocked: boolean;
  /** ID of the grid creation process holding the lock */
  lockId?: string;
  /** Timestamp when the lock was acquired */
  timestamp?: number;
}

/**
 * Default grid creation state
 */
export const DEFAULT_GRID_CREATION_STATE: GridCreationState = {
  started: false,
  completed: false,
  objectCount: 0
};

/**
 * Default grid creation lock
 */
export const DEFAULT_GRID_CREATION_LOCK: GridCreationLock = {
  isLocked: false
};
