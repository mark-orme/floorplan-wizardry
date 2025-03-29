
/**
 * SimpleGrid Component
 * A no-nonsense grid component that actually works
 */
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw, Grid } from "lucide-react";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { ExtendedFabricObject } from "@/types/fabricTypes";

interface SimpleGridProps {
  canvas: FabricCanvas | null;
  showControls?: boolean;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({ 
  canvas, 
  showControls = true  // Changed default to true to ensure controls are visible
}) => {
  const [gridCreated, setGridCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!canvas) return;
    
    console.log("Canvas detected in SimpleGrid, creating grid...");
    
    // Create grid after a short delay to ensure canvas is fully initialized
    const timeoutId = setTimeout(() => {
      createGrid();
    }, 300); // Increased delay for better reliability
    
    return () => {
      clearTimeout(timeoutId);
      clearExistingGrid();
    };
  }, [canvas]);
  
  // Direct grid creation function without relying on external utilities
  const createGrid = () => {
    if (!canvas) {
      console.warn("Cannot create grid: Canvas not available");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Clear existing grid first
      clearExistingGrid();
      
      // Get dimensions for grid calculation
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      
      console.log("Creating grid with dimensions:", width, "x", height);
      
      const gridObjects: FabricObject[] = [];
      
      // Create small grid lines
      const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
      
      // Create horizontal small grid lines
      for (let y = 0; y <= height; y += smallGridSize) {
        const line = new Line([0, y, width, y], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        
        // Add custom properties for identification
        (line as ExtendedFabricObject).objectType = 'grid';
        (line as ExtendedFabricObject).gridType = 'small';
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Create vertical small grid lines
      for (let x = 0; x <= width; x += smallGridSize) {
        const line = new Line([x, 0, x, height], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        
        // Add custom properties for identification
        (line as ExtendedFabricObject).objectType = 'grid';
        (line as ExtendedFabricObject).gridType = 'small';
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Create large grid lines
      const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
      
      // Create horizontal large grid lines
      for (let y = 0; y <= height; y += largeGridSize) {
        const line = new Line([0, y, width, y], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        
        // Add custom properties for identification
        (line as ExtendedFabricObject).objectType = 'grid';
        (line as ExtendedFabricObject).gridType = 'large';
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Create vertical large grid lines
      for (let x = 0; x <= width; x += largeGridSize) {
        const line = new Line([x, 0, x, height], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        
        // Add custom properties for identification
        (line as ExtendedFabricObject).objectType = 'grid';
        (line as ExtendedFabricObject).gridType = 'large';
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Force render all
      canvas.requestRenderAll();
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Update state
      setGridCreated(gridObjects.length > 0);
      
      if (gridObjects.length > 0) {
        console.log(`Grid created with ${gridObjects.length} objects`);
        toast.success(`Grid created with ${gridObjects.length} lines`);
      } else {
        console.error("Grid creation failed: No objects created");
        toast.error("Failed to create grid");
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
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      gridObjectsRef.current = [];
      setGridCreated(false);
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error clearing grid:", error);
    }
  };
  
  // Handle refresh button click
  const handleRefreshGrid = () => {
    toast.info("Refreshing grid...");
    createGrid();
  };
  
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
