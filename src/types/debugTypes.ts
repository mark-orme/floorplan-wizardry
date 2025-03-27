
/**
 * Debug-related type definitions
 * @module types/debugTypes
 */

// Re-export from core/DebugInfo to ensure consistent usage
export type { DebugInfoState, PerformanceStats } from './core/DebugInfo';

/**
 * Debug initialization state
 */
export interface DebugInitState {
  /** Whether initialization is in progress */
  initializationInProgress: boolean;
  /** Current initialization step */
  currentStep: string;
  /** Last error message */
  lastError: string | null;
  /** Initialization start time */
  startTime: number;
  /** Elapsed time in ms */
  elapsedTime: number;
}

/**
 * Debug grid state
 */
export interface DebugGridState {
  /** Number of small grid lines */
  smallGridLineCount: number;
  /** Number of large grid lines */
  largeGridLineCount: number;
  /** Total number of grid objects */
  totalGridObjects: number;
  /** Whether grid is locked */
  gridLocked: boolean;
  /** Grid creation time in ms */
  creationTime: number;
}
