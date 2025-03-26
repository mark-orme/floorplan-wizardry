
/**
 * Custom hook for grid management
 * Handles grid creation, recreation, and error recovery
 * @module useGridManagement
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { createBasicEmergencyGrid, retryWithBackoff } from "@/utils/gridCreationUtils";
import { 
  GridAttemptTracker, 
  createGridAttemptTracker, 
  incrementAttemptCount,
  markCreationSuccessful, 
  markInitialAttempted,
  isMaxAttemptsReached,
  GridAttemptStatus
} from "@/utils/gridAttemptTracker";

/**
 * Props for the useGridManagement hook
 * @interface UseGridManagementProps
 */
interface UseGridManagementProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number, height: number };
  /** Debug information about canvas state */
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  /** Function to create grid elements */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Return type for the useGridManagement hook
 * @interface UseGridManagementResult
 */
interface UseGridManagementResult {
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}

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
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track grid creation attempts with status object
  const gridAttemptStatusRef = useRef<GridAttemptTracker>(createGridAttemptTracker());
  
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
    const attemptGridCreation = (): boolean => {
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
      
      return false;
    };
    
    // Create emergency grid as last resort
    const createEmergencyGridOnFailure = (): void => {
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
    
  }, [fabricCanvasRef, createGrid]);

  // Add a second grid creation attempt when canvas dimensions change
  useEffect(() => {
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0 && fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions changed, recreating grid", canvasDimensions);
      }
      
      // Short timeout to ensure canvas is ready
      setTimeout(() => {
        resetGridProgress();
        createGrid(fabricCanvasRef.current!);
      }, 100);
    }
  }, [canvasDimensions.width, canvasDimensions.height, fabricCanvasRef, createGrid]);

  return {
    gridLayerRef
  };
};
