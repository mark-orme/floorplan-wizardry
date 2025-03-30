
/**
 * Grid management module
 * Exports grid management related types and utilities
 * @module grid-management
 */

// Export types
export type { GridAttemptTracker } from "./gridAttemptTracker";
export type { UseGridManagementProps, UseGridManagementResult } from "./types";

// Export hooks
export { useGridManagement } from "./useGridManagement";

// Export utilities from gridAttemptTracker
export { 
  incrementAttemptCount, 
  markCreationSuccessful, 
  isMaxAttemptsReached 
} from "./gridAttemptTracker";
