
/**
 * Grid management types
 * Type definitions for grid management hooks and utilities
 * @module gridTypes
 */

/**
 * Grid attempt tracker interface
 * Tracks grid creation attempts and status
 * @interface GridAttemptTracker
 */
export interface GridAttemptTracker {
  /** Whether initial grid creation has been attempted */
  initialAttempted: boolean;
  /** Number of attempts made to create grid */
  count: number;
  /** Maximum number of attempts allowed */
  maxAttempts: number;
  /** Whether creation was successful */
  successful: boolean;
  /** Timestamp of the last attempt */
  lastAttemptTime: number;
}

/**
 * Grid creation state interface
 * Tracks the state of grid creation process
 * @interface GridCreationState
 */
export interface GridCreationState {
  /** Whether grid creation is in progress */
  inProgress: boolean;
  /** Whether grid has been created successfully */
  isCreated: boolean;
  /** Number of creation attempts */
  attempts: number;
  /** Timestamp of last attempt */
  lastAttemptTime: number;
  /** Whether there was an error during creation */
  hasError: boolean;
  /** Error message if creation failed */
  errorMessage: string;
  /** Whether currently creating grid */
  isCreating?: boolean;
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
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
}
