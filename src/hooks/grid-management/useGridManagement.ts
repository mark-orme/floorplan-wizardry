
/**
 * Grid management hook
 * Provides comprehensive grid creation and maintenance functionality
 * 
 * This hook handles:
 * - Grid creation and initialization
 * - Grid validation and recovery
 * - Rate-limiting grid operations for performance
 * - Retry logic for failed grid operations
 * 
 * @module grid-management/useGridManagement
 */
import { useRef, useEffect, useState } from "react";
import { createGridAttemptTracker, markInitialAttempted } from "./gridAttemptTracker";
import { useGridCreationAttempt } from "./useGridCreationAttempt";
import { useDimensionChangeHandler } from "./useDimensionChangeHandler";
import { resetGridProgress } from "@/utils/gridManager";
import { UseGridManagementProps, UseGridManagementResult } from "./types";

// Static variable to track last attempt time across component instances
// This prevents excessive grid creation operations when multiple
// components are mounting/updating simultaneously
let lastGridAttemptTime = 0;

/**
 * Hook for managing grid creation and initialization
 * 
 * Orchestrates the entire grid lifecycle including creation,
 * maintenance, error recovery, and dimension changes
 * 
 * @param {UseGridManagementProps} props - Hook properties
 * @returns {UseGridManagementResult} Grid management utilities
 */
export const useGridManagement = ({
  fabricCanvasRef,
  canvasDimensions,
  debugInfo,
  createGrid
}: UseGridManagementProps): UseGridManagementResult => {
  // Reference to store grid objects for access across renders
  const gridLayerRef = useRef<any[]>([]);
  
  // Track grid creation attempts status
  // This helps implement retry logic and prevents duplicate operations
  const gridAttemptStatusRef = useRef(createGridAttemptTracker());
  
  // State to track last attempt time (for rate limiting)
  const [lastAttemptTime, setLastAttemptTime] = useState(lastGridAttemptTime);
  
  /**
   * Updates the global last attempt time
   * Used to coordinate grid creation across multiple hooks/components
   * 
   * @param {number} time - New timestamp to set
   */
  const updateLastAttemptTime = (time: number) => {
    lastGridAttemptTime = time;
    setLastAttemptTime(time);
  };
  
  // Get grid creation functions from specialized hook
  const { 
    attemptGridCreation, 
    createEmergencyGridOnFailure,
    shouldRateLimit 
  } = useGridCreationAttempt(fabricCanvasRef, gridLayerRef, createGrid);
  
  /**
   * Updates the grid attempt status tracker
   * Used to maintain state about grid creation attempts
   * 
   * @param {Function} updater - Function to update the status
   */
  const updateAttemptStatus = (updater: (status: any) => any) => {
    gridAttemptStatusRef.current = updater(gridAttemptStatusRef.current);
  };
  
  // Handle canvas dimension changes (resize, zoom, etc.)
  useDimensionChangeHandler({
    canvasDimensions,
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    lastAttemptTime,
    updateLastAttemptTime
  });
  
  // Force grid creation on initial load and after errors
  // This is a critical effect that ensures the grid is created
  // when the component mounts
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔴 FORCE GRID CREATION - High priority grid creation for wall snapping");
    }
    
    // Only attempt initial grid creation once per instance
    if (gridAttemptStatusRef.current.initialAttempted) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Initial grid creation already attempted, skipping");
      }
      return;
    }
    
    // Apply rate limiting to prevent excessive grid creation attempts
    if (shouldRateLimit(lastAttemptTime)) {
      console.log(`Grid creation attempted too soon after last attempt, waiting. Last: ${lastAttemptTime}, Now: ${Date.now()}`);
      
      // Schedule attempt after the minimum interval
      const timeoutId = setTimeout(() => {
        attemptGridCreation(
          gridAttemptStatusRef.current,
          updateAttemptStatus,
          lastAttemptTime,
          updateLastAttemptTime
        );
      }, 1000);
      
      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
    
    // Mark initial attempt as completed to prevent duplicate attempts
    updateAttemptStatus(markInitialAttempted);
    
    // Reset any previous grid progress to ensure clean state
    resetGridProgress();
    
    // Record this attempt time
    updateLastAttemptTime(Date.now());
    
    // Start the grid creation process
    attemptGridCreation(
      gridAttemptStatusRef.current,
      updateAttemptStatus,
      lastAttemptTime,
      updateLastAttemptTime
    );
    
  }, [fabricCanvasRef, createGrid, attemptGridCreation, shouldRateLimit, lastAttemptTime, updateLastAttemptTime]);

  // Return only what consuming components need
  return {
    gridLayerRef
  };
};
