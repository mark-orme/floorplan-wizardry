
/**
 * Hook for grid creation attempts with retry logic
 * @module grid-management/useGridCreationAttempt
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { startGridCreation, finishGridCreation, handleGridCreationError } from "@/utils/gridManager";
import logger from "@/utils/logger";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

// Constants
const MIN_RETRY_INTERVAL = 1000; // Minimum time between attempts in ms
const EMERGENCY_INSTANCE_ID = "emergency-grid";

/**
 * Types for grid attempt tracker
 */
interface GridAttemptTracker {
  initialAttempted: boolean;
  totalAttempts: number;
  successfulAttempts: number;
  lastError: Error | null;
}

/**
 * Hook for managing grid creation attempts with retries
 * @param {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid layer objects
 * @param {Function} createGrid - Function to create grid objects
 * @returns {Object} Grid creation attempt utilities
 */
export const useGridCreationAttempt = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
) => {
  /**
   * Check if we should rate limit grid creation
   * @param {number} lastAttemptTime - Timestamp of last attempt
   * @returns {boolean} Whether to rate limit
   */
  const shouldRateLimit = useCallback((lastAttemptTime: number): boolean => {
    const now = Date.now();
    return now - lastAttemptTime < MIN_RETRY_INTERVAL;
  }, []);
  
  /**
   * Create an emergency grid as fallback
   * @returns {boolean} Success indicator
   */
  const createEmergencyGridOnFailure = useCallback((): boolean => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.error("Cannot create emergency grid: Canvas is null");
      return false;
    }
    
    try {
      logger.warn("Creating emergency grid after failure");
      console.warn("🚨 Creating emergency grid after regular grid creation failed");
      
      // Start emergency grid creation
      startGridCreation();
      
      // Create emergency grid
      const emergencyGrid = createBasicEmergencyGrid(canvas);
      
      // Update grid layer reference
      gridLayerRef.current = emergencyGrid;
      
      // Finish grid creation
      finishGridCreation(EMERGENCY_INSTANCE_ID, emergencyGrid);
      
      return emergencyGrid.length > 0;
    } catch (error) {
      const err = error as Error;
      logger.error("Emergency grid creation failed:", err);
      handleGridCreationError(err);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef]);
  
  /**
   * Attempt to create grid
   * @param {GridAttemptTracker} status - Current attempt status
   * @param {Function} updateStatus - Function to update attempt status
   * @param {number} lastAttemptTime - Timestamp of last attempt
   * @param {Function} updateLastAttemptTime - Function to update timestamp
   * @returns {boolean} Success indicator
   */
  const attemptGridCreation = useCallback((
    status: GridAttemptTracker,
    updateStatus: (updater: (status: GridAttemptTracker) => GridAttemptTracker) => void,
    lastAttemptTime: number,
    updateLastAttemptTime: (time: number) => void
  ): boolean => {
    if (shouldRateLimit(lastAttemptTime)) {
      logger.debug("Grid creation throttled");
      return false;
    }
    
    // Update attempt timestamp
    updateLastAttemptTime(Date.now());
    
    // Update attempt count
    updateStatus(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1
    }));
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.error("Cannot create grid: Canvas is null");
      return false;
    }
    
    try {
      // Check dimensions
      if (!canvas.width || !canvas.height || 
          canvas.width === 0 || canvas.height === 0) {
        logger.error("Grid creation failed: Canvas has zero dimensions");
        return false;
      }
      
      // Start grid creation process
      if (!startGridCreation()) {
        logger.warn("Grid creation already in progress");
        return false;
      }
      
      // Create grid
      const instanceId = `grid-${Date.now()}`;
      const gridObjects = createGrid(canvas);
      
      // Save grid objects in reference
      gridLayerRef.current = gridObjects;
      
      // Finish grid creation
      finishGridCreation(instanceId, gridObjects);
      
      // Update success count
      updateStatus(prev => ({
        ...prev,
        successfulAttempts: prev.successfulAttempts + 1,
        lastError: null
      }));
      
      return true;
    } catch (error) {
      const err = error as Error;
      logger.error("Grid creation failed:", err);
      
      // Update error state
      updateStatus(prev => ({
        ...prev,
        lastError: err
      }));
      
      // Handle error
      handleGridCreationError(err);
      
      // Try emergency grid
      return createEmergencyGridOnFailure();
    }
  }, [fabricCanvasRef, gridLayerRef, createGrid, shouldRateLimit, createEmergencyGridOnFailure]);
  
  return {
    attemptGridCreation,
    createEmergencyGridOnFailure,
    shouldRateLimit
  };
};
