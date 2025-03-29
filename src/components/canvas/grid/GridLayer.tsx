
/**
 * Grid Layer Component
 * Ensures grid is rendered and maintained on canvas
 * @module components/canvas/grid/GridLayer
 */
import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useReliableGrid } from "@/hooks/useReliableGrid";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface GridLayerProps {
  /** Reference to the Fabric canvas */
  fabricCanvas: FabricCanvas | null;
  /** Canvas dimensions */
  dimensions: { width: number; height: number };
  /** Whether to show debug interface */
  showDebug?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = ({
  fabricCanvas,
  dimensions,
  showDebug = false
}) => {
  const [checkCount, setCheckCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Create ref to pass to useReliableGrid
  const fabricCanvasRef = { current: fabricCanvas };
  
  // Initialize grid with our new reliable grid hook
  const { 
    gridLayerRef, 
    createGrid, 
    gridInitialized, 
    isCreatingGrid,
    gridObjectCount 
  } = useReliableGrid({
    fabricCanvasRef,
    canvasDimensions: dimensions
  });
  
  // More aggressive grid creation on component mount
  useEffect(() => {
    if (fabricCanvas) {
      // Try to create grid with short delay to ensure canvas is ready
      const timer = setTimeout(() => {
        logger.info("Initial grid creation attempt from GridLayer");
        createGrid();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [fabricCanvas, createGrid]);
  
  // Wrap createGrid in try-catch with diagnostics
  const safeCreateGrid = useCallback(() => {
    try {
      setLastError(null);
      if (!fabricCanvas) {
        setLastError("No canvas available");
        return;
      }
      
      console.log("Dimensions for grid creation:", dimensions);
      if (!dimensions.width || !dimensions.height) {
        setLastError("Invalid dimensions");
        console.error("Cannot create grid: Invalid dimensions", dimensions);
        return;
      }
      
      // Execute grid creation
      createGrid();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setLastError(errorMessage);
      console.error("Error creating grid:", error);
      logger.error("Grid creation error:", error);
    }
  }, [fabricCanvas, dimensions, createGrid]);
  
  // Refresh grid periodically with better error handling
  useEffect(() => {
    // Initial check - make sure we have a grid
    if (fabricCanvas && (!gridInitialized || gridLayerRef.current.length === 0)) {
      console.log("No grid detected on mount, creating grid...");
      safeCreateGrid();
    }
    
    // Setup periodic check
    const gridCheckInterval = setInterval(() => {
      setCheckCount(prev => prev + 1);
      
      if (fabricCanvas) {
        // If no grid at all, try to create it
        if (!gridInitialized || gridLayerRef.current.length === 0) {
          console.log("No grid detected during periodic check, creating grid...");
          safeCreateGrid();
        }
        // If grid exists but has very few objects, it might be incomplete
        else if (gridLayerRef.current.length < 10) {
          console.log("Grid appears incomplete, recreating...");
          safeCreateGrid();
        }
      }
    }, 2000);
    
    return () => clearInterval(gridCheckInterval);
  }, [fabricCanvas, gridInitialized, gridLayerRef, safeCreateGrid]);
  
  // Handle manual refresh
  const handleRefreshGrid = () => {
    if (fabricCanvas) {
      toast.success("Refreshing grid...");
      safeCreateGrid();
    } else {
      toast.error("Cannot create grid: Canvas not available");
    }
  };
  
  if (!fabricCanvas) {
    return null;
  }
  
  return (
    <>
      {showDebug && (
        <div className="absolute top-2 right-2 bg-white/95 p-3 rounded shadow text-xs z-10">
          <div className="font-bold mb-1">Grid Status</div>
          <div>Grid objects: {gridLayerRef.current.length}</div>
          <div>Status: {gridInitialized ? 'Initialized' : 'Not initialized'}</div>
          <div>Checks: {checkCount}</div>
          {lastError && (
            <div className="text-red-500 mt-1">Error: {lastError}</div>
          )}
          <Button 
            size="sm"
            variant="outline"
            className="mt-2 text-xs h-7 px-2"
            disabled={isCreatingGrid}
            onClick={handleRefreshGrid}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Grid
          </Button>
        </div>
      )}
    </>
  );
};
