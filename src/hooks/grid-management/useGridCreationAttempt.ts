
/**
 * Grid creation attempt hook
 * Manages grid creation attempts with retry logic
 * @module grid-management/useGridCreationAttempt
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { createBasicEmergencyGrid, retryWithBackoff } from "@/utils/gridCreationUtils";
import { 
  GridAttemptTracker,
  incrementAttemptCount,
  markCreationSuccessful,
  isMaxAttemptsReached
} from "./";
import { MIN_ATTEMPT_INTERVAL } from "./constants";

/**
 * Hook for managing grid creation attempts
 * 
 * @param {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {(canvas: FabricCanvas) => FabricObject[]} createGrid - Function to create grid
 * @returns {Object} Grid creation attempt functions
 */
export const useGridCreationAttempt = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
) => {
  /**
   * Attempt to create grid with retry mechanism
   * 
   * @param {GridAttemptTracker} gridAttemptStatus - Current attempt status
   * @param {Function} updateAttemptStatus - Function to update attempt status
   * @param {number} lastAttemptTime - Time of last attempt
   * @param {Function} updateLastAttemptTime - Function to update last attempt time
   * @returns {boolean} Whether attempt was successful
   */
  const attemptGridCreation = useCallback((
    gridAttemptStatus: GridAttemptTracker,
    updateAttemptStatus: (updater: (status: GridAttemptTracker) => GridAttemptTracker) => void,
    lastAttemptTime: number,
    updateLastAttemptTime: (time: number) => void
  ): boolean => {
    if (!fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Fabric canvas not available yet, retrying soon");
      }
      
      setTimeout(() => {
        attemptGridCreation(gridAttemptStatus, updateAttemptStatus, lastAttemptTime, updateLastAttemptTime);
      }, 100);
      return false;
    }
    
    // Increment attempt count
    updateAttemptStatus(incrementAttemptCount);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Grid creation attempt ${gridAttemptStatus.count}/${gridAttemptStatus.maxAttempts}`);
    }
    
    // Force unlock before creation
    resetGridProgress();
    
    // Try immediate grid creation first
    try {
      if (!gridLayerRef.current) {
        gridLayerRef.current = [];
      }
      
      const canvas = fabricCanvasRef.current;
      
      if (!canvas) {
        console.error("Canvas is null during grid creation attempt");
        return false;
      }
      
      // Check if canvas already has grid objects
      const existingObjects = canvas.getObjects();
      if (existingObjects.length > 0) {
        console.log(`Canvas already has ${existingObjects.length} objects, might have grid already`);
        
        // Assume some of these are grid objects and mark as successful
        updateAttemptStatus(markCreationSuccessful);
        
        // Update gridLayerRef with existing objects that might be grid
        // This is a heuristic approach - assuming objects with certain properties are grid
        const possibleGridObjects = existingObjects.filter(obj => 
          (obj.selectable === false || obj.evented === false) && 
          ((obj as any).type === 'line' || (obj as any).type === 'text')
        );
        
        if (possibleGridObjects.length > 0) {
          console.log(`Found ${possibleGridObjects.length} possible grid objects in canvas`);
          gridLayerRef.current = possibleGridObjects;
          return true;
        }
      }
      
      const grid = createGrid(canvas);
      
      if (grid && grid.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Grid created successfully with ${grid.length} objects`);
        }
        fabricCanvasRef.current.requestRenderAll();
        updateAttemptStatus(markCreationSuccessful);
        return true;
      }
      
      // If standard grid creation failed, try emergency grid
      console.log("Standard grid creation returned 0 objects, trying emergency grid");
      const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      if (emergencyGrid && emergencyGrid.length > 0) {
        console.log(`Emergency grid created with ${emergencyGrid.length} objects`);
        canvas.requestRenderAll();
        updateAttemptStatus(markCreationSuccessful);
        return true;
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error during grid creation attempt:", err);
      }
      
      // Try emergency grid on error
      try {
        if (fabricCanvasRef.current) {
          console.log("Error during normal grid creation, trying emergency grid");
          const emergencyGrid = createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          
          if (emergencyGrid && emergencyGrid.length > 0) {
            console.log(`Emergency grid created with ${emergencyGrid.length} objects after error`);
            fabricCanvasRef.current.requestRenderAll();
            updateAttemptStatus(markCreationSuccessful);
            return true;
          }
        }
      } catch (emergencyError) {
        console.error("Even emergency grid creation failed:", emergencyError);
      }
    }
    
    // If immediate creation failed, try again with shorter timeout
    setTimeout(() => {
      if (!fabricCanvasRef.current) return;
      
      try {
        resetGridProgress();
        if (!gridLayerRef.current) {
          gridLayerRef.current = [];
        }
        
        const grid = createGrid(fabricCanvasRef.current);
        
        if (grid && grid.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Grid created with ${grid.length} objects (delayed attempt)`);
          }
          fabricCanvasRef.current.requestRenderAll();
          updateAttemptStatus(markCreationSuccessful);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error during delayed grid creation attempt:", err);
        }
      }
      
      // If we're here, grid creation failed
      if (!isMaxAttemptsReached(gridAttemptStatus)) {
        // Schedule next attempt with shorter exponential backoff
        // Convert the function to async to match the required type
        const asyncRetry = async (): Promise<any> => {
          return attemptGridCreation(
            gridAttemptStatus,
            updateAttemptStatus,
            lastAttemptTime,
            updateLastAttemptTime
          );
        };
        
        retryWithBackoff(
          asyncRetry, 
          gridAttemptStatus.count,
          gridAttemptStatus.maxAttempts
        );
      } else {
        // If all attempts failed, try creating a basic grid directly
        createEmergencyGridOnFailure();
      }
    }, 50);
    
    return false;
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Create emergency grid as last resort
   * Called when all other attempts fail
   */
  const createEmergencyGridOnFailure = useCallback((): void => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("All grid creation attempts failed, trying emergency method");
      }
      
      // Force a final grid creation on the canvas
      if (fabricCanvasRef.current) {
        createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Even emergency grid creation failed:", err);
      }
    }
  }, [fabricCanvasRef, gridLayerRef]);

  /**
   * Check if rate limiting should be applied
   * 
   * @param {number} lastAttemptTime - Time of last attempt
   * @returns {boolean} Whether to apply rate limiting
   */
  const shouldRateLimit = useCallback((lastAttemptTime: number): boolean => {
    const now = Date.now();
    return now - lastAttemptTime < MIN_ATTEMPT_INTERVAL;
  }, []);

  return {
    attemptGridCreation,
    createEmergencyGridOnFailure,
    shouldRateLimit
  };
};
