
/**
 * Custom hook for grid management
 * @module useGridManagement
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { createBasicEmergencyGrid, retryWithBackoff } from "@/utils/gridCreationUtils";
import { 
  createGridAttemptTracker, 
  incrementAttemptCount,
  markCreationSuccessful, 
  markInitialAttempted,
  isMaxAttemptsReached
} from "@/utils/gridAttemptTracker";

interface UseGridManagementProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasDimensions: { width: number, height: number };
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook for managing grid creation and initialization
 */
export const useGridManagement = ({
  fabricCanvasRef,
  canvasDimensions,
  debugInfo,
  createGrid
}: UseGridManagementProps) => {
  // Grid layer reference - initialize with empty array
  const gridLayerRef = useRef<any[]>([]);
  
  // Track grid creation attempts with status object
  const gridAttemptStatusRef = useRef(createGridAttemptTracker());
  
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
    
    // Mark initial attempt as completed
    gridAttemptStatusRef.current = markInitialAttempted(gridAttemptStatusRef.current);
    
    // Always reset progress first to break any stuck locks
    resetGridProgress();
    
    // Function to attempt grid creation
    const attemptGridCreation = () => {
      if (!fabricCanvasRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Fabric canvas not available yet, retrying soon");
        }
        
        setTimeout(() => {
          attemptGridCreation();
        }, 100);
        return false;
      }
      
      // Increment attempt count
      gridAttemptStatusRef.current = incrementAttemptCount(gridAttemptStatusRef.current);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Grid creation attempt ${gridAttemptStatusRef.current.count}/${gridAttemptStatusRef.current.maxAttempts}`);
      }
      
      // Force unlock before creation
      resetGridProgress();
      
      // Try immediate grid creation first
      try {
        if (!gridLayerRef.current) {
          gridLayerRef.current = [];
        }
        
        const grid = createGrid(fabricCanvasRef.current);
        
        if (grid && grid.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Grid created successfully with ${grid.length} objects`);
          }
          fabricCanvasRef.current.requestRenderAll();
          gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
          return true;
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error during grid creation attempt:", err);
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
            gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
            return true;
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error during delayed grid creation attempt:", err);
          }
        }
        
        // If we're here, grid creation failed
        if (!isMaxAttemptsReached(gridAttemptStatusRef.current)) {
          // Schedule next attempt with shorter exponential backoff
          retryWithBackoff(
            attemptGridCreation, 
            gridAttemptStatusRef.current.count,
            gridAttemptStatusRef.current.maxAttempts
          );
        } else {
          // If all attempts failed, try creating a basic grid directly
          createEmergencyGridOnFailure();
        }
      }, 50);
    };
    
    // Create emergency grid as last resort
    const createEmergencyGridOnFailure = () => {
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
    };
    
    // Start the first attempt
    attemptGridCreation();
    
  }, [fabricCanvasRef.current]);

  // Add a second grid creation attempt when canvas dimensions change
  useEffect(() => {
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0 && fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions changed, recreating grid", canvasDimensions);
      }
      
      // Short timeout to ensure canvas is ready
      setTimeout(() => {
        resetGridProgress();
        createGrid(fabricCanvasRef.current);
      }, 100);
    }
  }, [canvasDimensions.width, canvasDimensions.height]);

  return {
    gridLayerRef
  };
};
