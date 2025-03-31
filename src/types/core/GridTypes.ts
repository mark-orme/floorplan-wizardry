
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
  /** Whether grid creation is in progress */
  inProgress: boolean;
  /** Whether grid has been successfully created */
  isCreated: boolean;
  /** Number of creation attempts */
  attempts: number;
  /** Timestamp of last attempt */
  lastAttemptTime: number;
  /** Whether there was an error during creation */
  hasError: boolean;
  /** Error message if creation failed */
  errorMessage: string;
  /** Whether creation is currently in progress */
  creationInProgress: boolean;
  /** Count of consecutive reset attempts */
  consecutiveResets: number;
  /** Maximum allowed consecutive resets */
  maxConsecutiveResets: number;
  /** Whether grid exists */
  exists: boolean;
  /** Timestamp of last creation */
  lastCreationTime: number;
  /** Minimum time between creation attempts */
  throttleInterval: number;
  /** Total number of grid creations */
  totalCreations: number;
  /** Maximum number of allowed recreations */
  maxRecreations: number;
  /** Minimum time between recreation attempts */
  minRecreationInterval: number;
  /** Creation lock to prevent concurrent operations */
  creationLock: GridCreationLock;
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
  /** ID number for the lock */
  id?: number;
}

/**
 * Default grid creation state
 */
export const DEFAULT_GRID_CREATION_STATE: GridCreationState = {
  started: false,
  completed: false,
  objectCount: 0,
  inProgress: false,
  isCreated: false,
  attempts: 0,
  lastAttemptTime: 0,
  hasError: false,
  errorMessage: "",
  creationInProgress: false,
  consecutiveResets: 0,
  maxConsecutiveResets: 5,
  exists: false,
  lastCreationTime: 0,
  throttleInterval: 500,
  totalCreations: 0,
  maxRecreations: 10,
  minRecreationInterval: 1000,
  creationLock: {
    isLocked: false
  }
};

/**
 * Default grid creation lock
 */
export const DEFAULT_GRID_CREATION_LOCK: GridCreationLock = {
  isLocked: false
};
