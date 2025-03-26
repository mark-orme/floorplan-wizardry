
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
  isMaxAttemptsReached
} from "@/utils/gridAttemptTracker";

// Track last attempt time to rate-limit grid creation
let lastGridAttemptTime = 0;
const MIN_ATTEMPT_INTERVAL = 1000; // 1 second between attempts

/**
 * Props for the useGridManagement hook
 * @interface UseGridManagementProps
 */
interface UseGridManagementProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number, height: number } | undefined;
  /** Debug information about canvas state */
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
    [key: string]: unknown;
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
    
    // Check rate-limiting - don't create grid too frequently
    const now = Date.now();
    if (now - lastGridAttemptTime < MIN_ATTEMPT_INTERVAL) {
      console.log(`Grid creation attempted too soon after last attempt, waiting. Last: ${lastGridAttemptTime}, Now: ${now}`);
      
      // Schedule attempt after the minimum interval
      const timeoutId = setTimeout(() => {
        attemptGridCreation();
      }, MIN_ATTEMPT_INTERVAL);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Mark initial attempt as completed
    gridAttemptStatusRef.current = markInitialAttempted(gridAttemptStatusRef.current);
    
    // Always reset progress first to break any stuck locks
    resetGridProgress();
    
    // Update attempt time
    lastGridAttemptTime = now;
    
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
          gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
          
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
          gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
          return true;
        }
        
        // If standard grid creation failed, try emergency grid
        console.log("Standard grid creation returned 0 objects, trying emergency grid");
        const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
        
        if (emergencyGrid && emergencyGrid.length > 0) {
          console.log(`Emergency grid created with ${emergencyGrid.length} objects`);
          canvas.requestRenderAll();
          gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
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
              gridAttemptStatusRef.current = markCreationSuccessful(gridAttemptStatusRef.current);
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
    // Add null/undefined check for canvasDimensions
    if (canvasDimensions && canvasDimensions.width > 0 && canvasDimensions.height > 0 && fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions changed, recreating grid", canvasDimensions);
      }
      
      // Check rate-limiting - don't create grid too frequently
      const now = Date.now();
      if (now - lastGridAttemptTime < MIN_ATTEMPT_INTERVAL) {
        console.log("Grid recreation for dimensions change attempted too soon, skipping");
        return;
      }
      
      // Update attempt time
      lastGridAttemptTime = now;
      
      // Short timeout to ensure canvas is ready
      setTimeout(() => {
        resetGridProgress();
        
        // Check if canvas still exists
        if (!fabricCanvasRef.current) {
          console.log("Canvas no longer exists when attempting to recreate grid");
          return;
        }
        
        try {
          const grid = createGrid(fabricCanvasRef.current);
          
          // If standard grid creation fails, try emergency grid
          if (!grid || grid.length === 0) {
            console.log("Standard grid recreation returned 0 objects, trying emergency grid");
            createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          }
        } catch (error) {
          console.error("Error during grid recreation:", error);
          
          // Try emergency grid on error
          if (fabricCanvasRef.current) {
            createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          }
        }
      }, 100);
    }
  }, [canvasDimensions?.width, canvasDimensions?.height, fabricCanvasRef, createGrid]);

  return {
    gridLayerRef
  };
};
