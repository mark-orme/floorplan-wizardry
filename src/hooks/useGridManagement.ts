
/**
 * Custom hook for grid management
 * @module useGridManagement
 */
import { useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Line } from "fabric"; // Added Line import
import { resetGridProgress } from "@/utils/gridManager";

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
  
  // Track grid creation attempts with higher priority
  const gridAttemptCountRef = useRef(0);
  const maxGridAttempts = 12; // Increased for better reliability
  const gridCreationSuccessfulRef = useRef(false);
  
  // Flag to track if initial grid creation has been attempted
  const initialGridAttemptedRef = useRef(false);
  
  // IMPROVED: Force grid creation on initial load and after any error with higher priority
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔴 FORCE GRID CREATION - High priority grid creation for wall snapping");
    }
    
    // Only attempt initial grid creation once
    if (initialGridAttemptedRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Initial grid creation already attempted, skipping");
      }
      return;
    }
    
    initialGridAttemptedRef.current = true;
    
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
      
      gridAttemptCountRef.current++;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Grid creation attempt ${gridAttemptCountRef.current}/${maxGridAttempts}`);
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
          gridCreationSuccessfulRef.current = true;
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
            gridCreationSuccessfulRef.current = true;
            return true;
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error during delayed grid creation attempt:", err);
          }
        }
        
        // If we're here, grid creation failed
        if (gridAttemptCountRef.current < maxGridAttempts) {
          // Schedule next attempt with shorter exponential backoff
          const delay = Math.min(Math.pow(1.3, gridAttemptCountRef.current) * 100, 800);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Scheduling next grid attempt in ${delay}ms`);
          }
          
          setTimeout(() => {
            resetGridProgress();
            attemptGridCreation();
          }, delay);
        } else {
          // If all attempts failed, try creating a basic grid directly
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log("All grid creation attempts failed, trying emergency method");
            }
            
            // Force a final grid creation on the canvas
            if (fabricCanvasRef.current) {
              // This is a direct bypass of the normal grid creation process
              // Create very basic grid lines directly
              const width = fabricCanvasRef.current.width || 800;
              const height = fabricCanvasRef.current.height || 600;
              
              if (!gridLayerRef.current) {
                gridLayerRef.current = [];
              }
              
              for (let x = 0; x <= width; x += 100) {
                const line = new Line([x, 0, x, height], {
                  stroke: '#CCDDEE',
                  selectable: false,
                  evented: false,
                  strokeWidth: x % 500 === 0 ? 1.5 : 0.5
                });
                fabricCanvasRef.current.add(line);
                gridLayerRef.current.push(line);
              }
              
              for (let y = 0; y <= height; y += 100) {
                const line = new Line([0, y, width, y], {
                  stroke: '#CCDDEE',
                  selectable: false,
                  evented: false,
                  strokeWidth: y % 500 === 0 ? 1.5 : 0.5
                });
                fabricCanvasRef.current.add(line);
                gridLayerRef.current.push(line);
              }
              
              fabricCanvasRef.current.requestRenderAll();
              if (process.env.NODE_ENV === 'development') {
                console.log("Created basic emergency grid");
              }
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Even emergency grid creation failed:", err);
            }
          }
        }
      }, 50);
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
