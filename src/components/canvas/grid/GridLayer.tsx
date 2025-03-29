
/**
 * Grid Layer Component
 * Ensures grid is rendered and maintained on canvas
 * @module components/canvas/grid/GridLayer
 */
import { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useReliableGrid } from "@/hooks/useReliableGrid";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  
  // Create ref to pass to useReliableGrid
  const fabricCanvasRef = { current: fabricCanvas };
  
  // Initialize grid
  const { gridLayerRef, createGrid, gridInitialized, isCreatingGrid } = useReliableGrid({
    fabricCanvasRef,
    canvasDimensions: dimensions
  });
  
  // Refresh grid periodically
  useEffect(() => {
    const gridCheckInterval = setInterval(() => {
      setCheckCount(prev => prev + 1);
      
      if (fabricCanvas && (!gridInitialized || gridLayerRef.current.length === 0)) {
        createGrid();
      }
    }, 3000);
    
    return () => clearInterval(gridCheckInterval);
  }, [fabricCanvas, gridInitialized, gridLayerRef, createGrid]);
  
  // Create grid when canvas changes
  useEffect(() => {
    if (fabricCanvas && !gridInitialized) {
      console.log("Canvas changed in GridLayer, creating grid...");
      createGrid();
    }
  }, [fabricCanvas, gridInitialized, createGrid]);
  
  // Handle manual refresh
  const handleRefreshGrid = () => {
    if (fabricCanvas) {
      createGrid();
      toast.success("Refreshing grid...");
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
        <div className="absolute top-2 right-2 bg-white/80 p-2 rounded shadow text-xs">
          <div>Grid objects: {gridLayerRef.current.length}</div>
          <div>Status: {gridInitialized ? 'Initialized' : 'Not initialized'}</div>
          <div>Checks: {checkCount}</div>
          <Button 
            size="sm"
            variant="outline"
            className="mt-1 text-xs h-7 px-2"
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
