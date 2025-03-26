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
  creationInProgress: boolean;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  lastAttemptTime: number;
  lastCreationTime: number;
  exists: boolean;
  safetyTimeout: number | null;
  throttleInterval: number;
  minRecreationInterval: number;
  maxRecreations: number;
  totalCreations: number;
  lastDimensions: CanvasDimensions | null;
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
  // Keep the properties from the previous definition for backward compatibility
  inProgress?: boolean;
  startTime?: number;
  attempts?: number;
  complete?: boolean;
}
