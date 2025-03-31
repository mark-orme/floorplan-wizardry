
/**
 * Grid types and interfaces
 * Defines types for grid creation and management
 * @module types/core/GridTypes
 */

/**
 * Grid creation lock interface
 * Controls grid creation synchronization
 */
export interface GridCreationLock {
  /** Whether the grid is currently locked for creation */
  isLocked: boolean;
  /** ID of the operation that acquired the lock */
  lockedBy: string | null;
  /** Timestamp when the lock was acquired */
  lockedAt: number | null;
  /** Maximum time the lock can be held */
  maxLockTime: number;
}

/**
 * Default grid creation lock
 * Initial values for grid creation lock
 */
export const DEFAULT_GRID_CREATION_LOCK: GridCreationLock = {
  isLocked: false,
  lockedBy: null,
  lockedAt: null,
  maxLockTime: 5000
};

/**
 * Grid creation state interface
 * Tracks the state of grid creation on the canvas
 */
export interface GridCreationState {
  /** Whether grid creation has started */
  started: boolean;
  /** Whether grid creation has completed */
  completed: boolean;
  /** Count of grid objects created */
  objectCount: number;
  /** Time when grid creation started */
  startTime: number;
  /** Time when grid creation ended */
  endTime: number;
  /** Error message if grid creation failed */
  error: string | null;
  /** Whether grid creation is in progress */
  inProgress: boolean;
  /** Whether the grid has been created successfully */
  isCreated: boolean;
  /** Number of attempts to create the grid */
  attempts: number;
  /** Time of the last creation attempt */
  lastAttemptTime: number;
  /** Whether there was an error during creation */
  hasError: boolean;
  /** Error message if there was an error */
  errorMessage: string;
  /** Whether grid creation is currently in progress */
  creationInProgress: boolean;
  /** Number of consecutive reset operations */
  consecutiveResets: number;
  /** Maximum allowed consecutive resets */
  maxConsecutiveResets: number;
  /** Whether the grid exists */
  exists: boolean;
  /** Time of last successful creation */
  lastCreationTime: number;
  /** Minimum interval between recreation attempts */
  throttleInterval: number;
  /** Total number of creation operations */
  totalCreations: number;
  /** Maximum number of recreation attempts */
  maxRecreations: number;
  /** Minimum interval between recreation attempts */
  minRecreationInterval: number;
  /** Lock for grid creation synchronization */
  creationLock?: GridCreationLock;
}

/**
 * Default grid creation state
 * Initial values for grid creation state
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
  hasError: false,
  errorMessage: '',
  creationInProgress: false,
  consecutiveResets: 0,
  maxConsecutiveResets: 3,
  exists: false,
  lastCreationTime: 0,
  throttleInterval: 1000,
  totalCreations: 0,
  maxRecreations: 5,
  minRecreationInterval: 500,
  creationLock: DEFAULT_GRID_CREATION_LOCK
};
