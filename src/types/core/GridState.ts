
/**
 * Grid state type definitions
 * @module types/core/GridState
 */

import { Object as FabricObject } from "fabric";

/**
 * Grid creation lock object
 * Prevents concurrent grid operations
 */
export interface GridCreationLock {
  /** Unique identifier for the lock */
  id: number;
  /** Timestamp when the lock was created */
  timestamp: number;
  /** Whether the lock is currently active */
  isLocked: boolean;
}

/**
 * Grid creation state for tracking grid creation attempts
 */
export interface GridCreationState {
  /** Whether grid creation is in progress */
  inProgress: boolean;
  /** Whether a grid has been successfully created */
  isCreated: boolean;
  /** Number of creation attempts made */
  attempts: number;
  /** Timestamp of the last attempt */
  lastAttemptTime: number;
  /** Whether the last attempt resulted in an error */
  hasError: boolean;
  /** Error message from the last failed attempt */
  errorMessage: string;
  /** Whether a creation operation is currently in progress */
  creationInProgress: boolean;
  /** Number of consecutive grid reset operations */
  consecutiveResets: number;
  /** Maximum allowed consecutive reset operations */
  maxConsecutiveResets: number;
  /** Whether the grid currently exists */
  exists: boolean;
  /** Timestamp of the last successful creation */
  lastCreationTime: number;
  /** Minimum time between creation attempts in ms */
  throttleInterval: number;
  /** Total number of grid creations */
  totalCreations: number;
  /** Maximum number of allowed recreations */
  maxRecreations: number;
  /** Minimum time between recreation attempts in ms */
  minRecreationInterval: number;
  /** Lock object to prevent concurrent creation */
  creationLock: GridCreationLock;
}

/**
 * Grid style properties
 */
export interface GridStyle {
  /** Color of small grid lines */
  smallGridColor: string;
  /** Color of large grid lines */
  largeGridColor: string;
  /** Width of small grid lines in pixels */
  smallGridWidth: number;
  /** Width of large grid lines in pixels */
  largeGridWidth: number;
  /** Opacity of the grid (0-1) */
  opacity: number;
}

/**
 * Grid options for creation and display
 */
export interface GridOptions {
  /** Whether to show the grid */
  visible: boolean;
  /** Whether to snap to grid points */
  snapToGrid: boolean;
  /** Grid spacing in pixels */
  spacing: number;
  /** Grid visual style */
  style: GridStyle;
  /** Whether to extend grid beyond canvas borders */
  extendBeyondCanvas: boolean;
}

/**
 * Grid configuration for advanced settings
 */
export interface GridConfig {
  /** Grid display options */
  options: GridOptions;
  /** Whether grid is enabled */
  enabled: boolean;
  /** Maximum number of small grid lines (performance) */
  maxSmallGridLines: number;
  /** Maximum number of large grid lines (performance) */
  maxLargeGridLines: number;
}

/**
 * Grid dimensions properties
 */
export interface GridDimensions {
  /** Width of the grid in pixels */
  width: number;
  /** Height of the grid in pixels */
  height: number;
  /** Spacing between small grid lines */
  smallGridSpacing: number;
  /** Spacing between large grid lines */
  largeGridSpacing: number;
}

/**
 * Grid parameters for creation
 */
export interface GridParameters {
  /** Grid dimensions */
  dimensions: GridDimensions;
  /** Grid configuration */
  config: GridConfig;
}

/**
 * Complete grid object containing all grid-related information
 */
export interface Grid {
  /** Grid creation state */
  creationState: GridCreationState;
  /** Grid parameters */
  parameters: GridParameters;
  /** All grid objects */
  objects: FabricObject[];
  /** Small grid line objects */
  smallGridObjects: FabricObject[];
  /** Large grid line objects */
  largeGridObjects: FabricObject[];
}
