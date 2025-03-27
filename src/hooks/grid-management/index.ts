
/**
 * Grid management module
 * Exports grid management related types and utilities
 * @module grid-management
 */

export interface GridAttemptTracker {
  count: number;
  maxAttempts: number;
  successful: boolean;
  lastAttemptTime: number;
}

export const incrementAttemptCount = (status: GridAttemptTracker): GridAttemptTracker => ({
  ...status,
  count: status.count + 1,
  lastAttemptTime: Date.now()
});

export const markCreationSuccessful = (status: GridAttemptTracker): GridAttemptTracker => ({
  ...status,
  successful: true
});

export const isMaxAttemptsReached = (status: GridAttemptTracker): boolean => 
  status.count >= status.maxAttempts;
