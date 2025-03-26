
/**
 * Type definitions for debug and diagnostic information
 * @module debugTypes
 */
import { PerformanceMetrics } from './performanceTypes';

/**
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether canvas dimensions have been properly set */
  dimensionsSet: boolean;
  /** Whether the drawing brush has been initialized */
  brushInitialized: boolean;
  /** Number of grid creation attempts */
  gridCreationAttempts?: number;
  /** Number of grid creation failures */
  gridCreationFailures?: number;
  /** Time taken for the last grid creation (ms) */
  lastGridCreationTime?: number;
  /** Last error message */
  lastError?: string | null;
  /** Timestamp of the last error */
  lastErrorTime?: number;
  /** Number of objects on the canvas */
  canvasObjects?: number;
  /** Number of grid objects on the canvas */
  gridObjects?: number;
  /** Current canvas width */
  canvasWidth?: number;
  /** Current canvas height */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Whether the grid is visible */
  gridVisible?: boolean;
  /** Performance statistics */
  performanceStats?: Partial<PerformanceMetrics>;
  /** Last action performed */
  lastAction?: string;
}
