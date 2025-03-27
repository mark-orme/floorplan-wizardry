
/**
 * Grid management module
 * Exports grid management related types and utilities
 * @module grid-management
 */

// Export types
export type { GridAttemptTracker } from "./types";
export type { UseGridManagementProps, UseGridManagementResult } from "./types";

// Export hooks
export { useGridManagement } from "./useGridManagement";

// Export utilities
export { 
  incrementAttemptCount, 
  markCreationSuccessful, 
  isMaxAttemptsReached 
} from "./gridAttemptTracker";

// The original contents
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
