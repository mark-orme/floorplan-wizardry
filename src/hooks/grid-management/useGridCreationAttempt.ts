
/**
 * Grid creation attempt hook
 * Manages grid creation attempts with retry logic
 * @module grid-management/useGridCreationAttempt
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { incrementAttemptCount, markCreationSuccessful, isMaxAttemptsReached } from "./gridAttemptTracker";
import { GridAttemptTracker } from "./types";
import { MIN_ATTEMPT_INTERVAL, DEFAULT_ATTEMPT_DELAY } from "./constants";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

/**
 * Hook for managing grid creation attempts
 * @returns {Object} Grid creation attempt utilities
 */
export const useGridCreationAttempt = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<any[]>,
  createGrid: (canvas: FabricCanvas) => any[]
) => {
  /**
   * Check if we should rate limit creation attempts
   * @param {number} lastAttemptTime - Timestamp of last attempt
   * @returns {boolean} Whether to rate limit
   */
  const shouldRateLimit = useCallback((lastAttemptTime: number): boolean => {
    return Date.now() - lastAttemptTime < MIN_ATTEMPT_INTERVAL;
  }, []);

  /**
   * Attempt to create grid with retry logic
   * @param {GridAttemptTracker} status - Current attempt status
   * @param {Function} updateAttemptStatus - Function to update status
   * @param {number} lastAttemptTime - Timestamp of last attempt
   * @param {Function} updateLastAttemptTime - Function to update time
   */
  const attemptGridCreation = useCallback((
    status: GridAttemptTracker,
    updateAttemptStatus: (updater: (status: GridAttemptTracker) => GridAttemptTracker) => void,
    lastAttemptTime: number,
    updateLastAttemptTime: (time: number) => void
  ) => {
    // Check rate-limiting
    if (shouldRateLimit(lastAttemptTime)) {
      console.log(`Grid creation attempt too soon after last attempt, waiting`);
      return;
    }

    // Update attempt status
    updateAttemptStatus(incrementAttemptCount);
    updateLastAttemptTime(Date.now());

    if (!fabricCanvasRef.current) {
      console.log("Canvas not available for grid creation");
      return;
    }

    // Attempt to create grid
    try {
      console.log("Attempting to create grid");
      const grid = createGrid(fabricCanvasRef.current);

      if (grid && grid.length > 0) {
        console.log(`Grid created with ${grid.length} objects`);
        updateAttemptStatus(markCreationSuccessful);
      } else {
        console.log("Grid creation returned empty grid, will retry");
        if (!isMaxAttemptsReached(status)) {
          setTimeout(() => attemptGridCreation(
            status,
            updateAttemptStatus,
            lastAttemptTime,
            updateLastAttemptTime
          ), DEFAULT_ATTEMPT_DELAY);
        }
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      
      if (!isMaxAttemptsReached(status)) {
        setTimeout(() => attemptGridCreation(
          status,
          updateAttemptStatus,
          lastAttemptTime,
          updateLastAttemptTime
        ), DEFAULT_ATTEMPT_DELAY);
      }
    }
  }, [fabricCanvasRef, createGrid, shouldRateLimit]);

  /**
   * Create emergency grid as fallback
   */
  const createEmergencyGridOnFailure = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.log("Canvas not available for emergency grid creation");
      return;
    }

    console.log("Creating emergency grid as fallback");
    createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
  }, [fabricCanvasRef, gridLayerRef]);

  return {
    attemptGridCreation,
    createEmergencyGridOnFailure,
    shouldRateLimit
  };
};
