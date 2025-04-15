
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { 
  ensureGridVisibility, 
  setGridVisibility,
  forceGridCreationAndVisibility 
} from "@/utils/grid/gridVisibility";
import { createCompleteGrid } from "@/utils/grid/gridRenderers";

export const useGridManagement = (
  canvas: FabricCanvas | null,
  canvasStableRef: React.MutableRefObject<boolean>,
  gridInitializedRef: React.MutableRefObject<boolean>,
  retryCountRef: React.MutableRefObject<number>,
  mountedRef: React.MutableRefObject<boolean>,
  maxRetries: number
) => {
  // Ensure canvas is properly tracked and stable before grid creation
  useEffect(() => {
    if (!canvas) {
      console.log("Canvas not available yet");
      return;
    }

    console.log("Canvas reference received:", !!canvas);
    
    // Wait to confirm canvas is stable before attempting grid creation
    const stabilityTimer = setTimeout(() => {
      if (mountedRef.current) {
        canvasStableRef.current = true;
        console.log("Canvas marked as stable after delay");
      }
    }, 1000);
    
    return () => {
      clearTimeout(stabilityTimer);
    };
  }, [canvas, canvasStableRef, mountedRef]);
  
  // Separate effect for grid creation to ensure it only runs after canvas is stable
  useEffect(() => {
    if (!canvas || !canvasStableRef.current || gridInitializedRef.current) {
      return;
    }
    
    console.log("Attempting grid creation on stable canvas");
    
    const createGridWithRetry = () => {
      try {
        // Validate canvas dimensions
        if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
          throw new Error("Invalid canvas dimensions for grid creation");
        }

        console.log("Creating grid with dimensions:", canvas.width, "x", canvas.height);
        
        // Create grid with complete renderer
        let gridSuccess = false;
        
        // Try normal grid creation first
        const gridObjects = createCompleteGrid(canvas);
        
        if (gridObjects && gridObjects.length > 0) {
          gridInitializedRef.current = true;
          console.log(`Grid created successfully with ${gridObjects.length} objects`);
          
          // Force grid objects to be visible
          gridObjects.forEach(obj => {
            obj.set('visible', true);
          });
          
          // Re-render the canvas after setting visibility
          canvas.renderAll();
          canvas.requestRenderAll();
          
          toast.success(`Grid created with ${gridObjects.length} objects`);
          gridSuccess = true;
        } 
        
        // If normal grid creation failed, try forced approach
        if (!gridSuccess) {
          console.log("Standard grid creation failed, trying forced approach");
          if (forceGridCreationAndVisibility(canvas)) {
            gridInitializedRef.current = true;
            toast.success("Grid created with emergency approach");
            gridSuccess = true;
          } else {
            throw new Error("Both standard and emergency grid creation failed");
          }
        }
      } catch (error) {
        console.error("Grid creation error:", error);
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`Retrying grid creation (attempt ${retryCountRef.current}/${maxRetries})`);
          
          // Retry after a delay
          setTimeout(createGridWithRetry, 1000);
        } else {
          toast.error("Failed to initialize grid after multiple attempts");
        }
      }
    };
    
    // Start grid creation with delay to ensure canvas is ready
    const timer = setTimeout(createGridWithRetry, 1000);
    
    return () => clearTimeout(timer);
  }, [canvas, canvasStableRef, gridInitializedRef, retryCountRef, maxRetries]);
  
  // Check grid visibility periodically
  useEffect(() => {
    if (!canvas) return;
    
    // Initial check with delay
    const initialCheck = setTimeout(() => {
      if (canvas) {
        console.log("Performing initial grid visibility check");
        ensureGridVisibility(canvas);
      }
    }, 2000);
    
    // Periodic check every 5 seconds
    const intervalCheck = setInterval(() => {
      if (canvas && mountedRef.current) {
        ensureGridVisibility(canvas);
      }
    }, 5000);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(intervalCheck);
    };
  }, [canvas, mountedRef]);

  const toggleGridDebug = (showGridDebug: boolean) => {    
    if (canvas) {
      // Toggle grid visibility based on showGridDebug state
      setGridVisibility(canvas, !showGridDebug);
      toast.info(showGridDebug ? "Grid debug hidden" : "Grid debug visible");
    }
  };
  
  const handleForceRefresh = (
    canvas: FabricCanvas | null, 
    setForceRefreshKey: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (canvas) {
      toast.info("Forcing grid recreation...");
      forceGridCreationAndVisibility(canvas);
    } else {
      // If no canvas, force complete component refresh
      toast.info("Forcing complete refresh...");
      setForceRefreshKey(prev => prev + 1);
    }
  };

  return {
    toggleGridDebug,
    handleForceRefresh
  };
};
