
/**
 * SimpleGrid Component
 * A no-nonsense grid component that actually works
 */
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid, clearGrid, isCanvasValidForGrid } from "@/utils/grid/simpleGrid";
import { Button } from "@/components/ui/button";
import { RefreshCw, Grid } from "lucide-react";
import { toast } from "sonner";

interface SimpleGridProps {
  canvas: FabricCanvas | null;
  showControls?: boolean;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({ 
  canvas, 
  showControls = false 
}) => {
  const [gridCreated, setGridCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!canvas || !isCanvasValidForGrid(canvas)) return;
    
    // Create grid after a short delay to ensure canvas is fully initialized
    const timeoutId = setTimeout(() => {
      createGrid();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      clearExistingGrid();
    };
  }, [canvas]);
  
  // Handle grid creation
  const createGrid = () => {
    if (!canvas || !isCanvasValidForGrid(canvas)) {
      console.warn("Cannot create grid: Canvas not ready");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Clear existing grid first
      clearExistingGrid();
      
      // Create new grid
      const gridObjects = createSimpleGrid(canvas);
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Update state
      setGridCreated(gridObjects.length > 0);
      
      if (gridObjects.length > 0) {
        console.log(`Grid created with ${gridObjects.length} objects`);
      } else {
        console.error("Grid creation failed: No objects created");
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      toast.error("Failed to create grid");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Clear existing grid
  const clearExistingGrid = () => {
    if (!canvas) return;
    
    try {
      clearGrid(canvas, gridObjectsRef.current);
      gridObjectsRef.current = [];
      setGridCreated(false);
    } catch (error) {
      console.error("Error clearing grid:", error);
    }
  };
  
  // Handle refresh button click
  const handleRefreshGrid = () => {
    toast.info("Refreshing grid...");
    createGrid();
  };
  
  if (!showControls) {
    return null;
  }
  
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-md p-2 z-10 flex items-center space-x-2">
      <Button
        size="sm"
        variant={gridCreated ? "outline" : "default"}
        onClick={handleRefreshGrid}
        disabled={isCreating}
        className="h-8 px-3 text-xs"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isCreating ? 'animate-spin' : ''}`} />
        {gridCreated ? "Refresh Grid" : "Create Grid"}
      </Button>
      
      <div className="text-xs flex items-center">
        <Grid className="h-3 w-3 mr-1" />
        <span>
          {gridCreated 
            ? `${gridObjectsRef.current.length} lines` 
            : "No grid"}
        </span>
      </div>
    </div>
  );
};
