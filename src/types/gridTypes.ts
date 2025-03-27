
/**
 * Type definitions for grid functionality
 * @module gridTypes
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { CanvasDimensions } from './geometryTypes';

/**
 * Grid creation callback type
 * @typedef {Function} GridCreationCallback
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {FabricObject[]} - Array of created grid objects
 */
export type GridCreationCallback = (canvas: FabricCanvas) => FabricObject[];

/**
 * Grid creation state type
 * @typedef {Object} GridCreationState
 */
export interface GridCreationState {
  /** Whether grid creation is currently in progress */
  creationInProgress: boolean;
  /** Count of consecutive failed creation attempts */
  consecutiveResets: number;
  /** Maximum allowed consecutive reset attempts */
  maxConsecutiveResets: number;
  /** Timestamp of last grid creation attempt */
  lastAttemptTime: number;
  /** Timestamp of last successful grid creation */
  lastCreationTime: number;
  /** Whether grid exists on canvas */
  exists: boolean;
  /** Timeout ID for safety check (to prevent stuck creation) */
  safetyTimeout: number | null;
  /** Minimum time between creation attempts in ms */
  throttleInterval: number;
  /** Minimum time between recreations in ms */
  minRecreationInterval: number;
  /** Maximum number of recreations allowed per session */
  maxRecreations: number;
  /** Total grid creation attempts made */
  totalCreations: number;
  /** Last dimensions used for grid creation */
  lastDimensions: CanvasDimensions | null;
  /** Lock mechanism to prevent concurrent creation attempts */
  creationLock: {
    /** Unique identifier for the lock */
    id: number;
    /** Timestamp when lock was acquired */
    timestamp: number;
    /** Whether lock is currently held */
    isLocked: boolean;
  };
  /** Health check information */
  health?: {
    /** Last verification timestamp */
    lastCheck: number;
    /** Whether grid was verified as existing */
    verified: boolean;
    /** Number of grid objects at last check */
    objectCount: number;
    /** Number of failures detected */
    failures: number;
  };
  
  // Deprecated properties (kept for backward compatibility)
  inProgress?: boolean;
  startTime?: number;
  attempts?: number;
  complete?: boolean;
}
