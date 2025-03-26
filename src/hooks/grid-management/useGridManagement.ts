
/**
 * Grid management hook
 * Main hook for managing grid creation and initialization
 * @module grid-management/useGridManagement
 */
import { useRef, useEffect, useState } from "react";
import { createGridAttemptTracker, markInitialAttempted } from "./gridAttemptTracker";
import { useGridCreationAttempt } from "./useGridCreationAttempt";
import { useDimensionChangeHandler } from "./useDimensionChangeHandler";
import { resetGridProgress } from "@/utils/gridManager";
import { UseGridManagementProps, UseGridManagementResult } from "./types";

// Track last attempt time to rate-limit grid creation
let lastGridAttemptTime = 0;

/**
 * Hook for managing grid creation and initialization
 * @param {UseGridManagementProps} props - Hook properties
 * @returns {UseGridManagementResult} Grid management utilities
 */
export const useGridManagement = ({
  fabricCanvasRef,
  canvasDimensions,
  debugInfo,
  createGrid
}: UseGridManagementProps): UseGridManagementResult => {
  // Grid layer reference - initialize with empty array
  const gridLayerRef = useRef<any[]>([]);
  
  // Track grid creation attempts with status object
  const gridAttemptStatusRef = useRef(createGridAttemptTracker());
  
  // State to track last attempt time
  const [lastAttemptTime, setLastAttemptTime] = useState(lastGridAttemptTime);
  
  // Update the global last attempt time
  const updateLastAttemptTime = (time: number) => {
    lastGridAttemptTime = time;
    setLastAttemptTime(time);
  };
  
  // Use grid creation attempt hook
  const { 
    attemptGridCreation, 
    createEmergencyGridOnFailure,
    shouldRateLimit 
  } = useGridCreationAttempt(fabricCanvasRef, gridLayerRef, createGrid);
  
  // Update grid attempt status
  const updateAttemptStatus = (updater: (status: any) => any) => {
    gridAttemptStatusRef.current = updater(gridAttemptStatusRef.current);
  };
  
  // Use dimension change handler
  useDimensionChangeHandler({
    canvasDimensions,
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    lastAttemptTime,
    updateLastAttemptTime
  });
  
  // IMPROVED: Force grid creation on initial load and after any error with higher priority
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔴 FORCE GRID CREATION - High priority grid creation for wall snapping");
    }
    
    // Only attempt initial grid creation once
    if (gridAttemptStatusRef.current.initialAttempted) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Initial grid creation already attempted, skipping");
      }
      return;
    }
    
    // Check rate-limiting - don't create grid too frequently
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
      
      return () => clearTimeout(timeoutId);
    }
    
    // Mark initial attempt as completed
    updateAttemptStatus(markInitialAttempted);
    
    // Always reset progress first to break any stuck locks
    resetGridProgress();
    
    // Update attempt time
    updateLastAttemptTime(Date.now());
    
    // Start the first attempt
    attemptGridCreation(
      gridAttemptStatusRef.current,
      updateAttemptStatus,
      lastAttemptTime,
      updateLastAttemptTime
    );
    
  }, [fabricCanvasRef, createGrid, attemptGridCreation, shouldRateLimit, lastAttemptTime, updateLastAttemptTime]);

  return {
    gridLayerRef
  };
};
