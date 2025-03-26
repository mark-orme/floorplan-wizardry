
/**
 * Canvas resizing state module
 * Manages global resizing state to track operation status
 * @module canvas-resizing/state
 */
import { ResizingState } from "./types";

/**
 * Global resizing state used across resize operations
 * Helps track resize status across hook instances
 */
export const resizingState: ResizingState = {
  initialResizeComplete: false,
  resizeInProgress: false,
  lastResizeTime: 0
};

/**
 * Reset the resizing state to initial values
 * Used to force a fresh resize operation
 */
export const resetResizingState = (): void => {
  resizingState.initialResizeComplete = false;
  resizingState.resizeInProgress = false;
  resizingState.lastResizeTime = 0;
};
