/**
 * Simple Grid Component
 * Renders a reliable grid on the canvas with refresh controls
 */
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw, Grid as GridIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createGridElements } from "@/utils/grid/createGridElements";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { 
  resetGridProgress, 
  isGridCreationInProgress, 
  setGridProgress 
} from "@/utils/gridManager";

interface SimpleGridProps {
  /** The fabric canvas instance */
  canvas: FabricCanvas;
  /** Whether to show grid controls */
  showControls?: boolean;
  /** Whether grid is visible by default */
  defaultVisible?: boolean;
  /** Callback when grid creation completes */
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * Simple Grid Component
 * Renders a grid on the canvas with minimal dependencies
 */
export const SimpleGrid = ({
  canvas,
  showControls = true,
  defaultVisible = true,
  onGridCreated
}: SimpleGridProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [isCreating, setIsCreating] = useState(false);
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const [gridCount, setGridCount] = useState(0);
  const refreshAttemptRef = useRef(0);
  const instanceIdRef = useRef(`grid-${Date.now()}`);
  
  /**
   * Create grid with error handling
   */
  const createGrid = async () => {
    // Skip if already creating
    if (isCreating) {
      console.log("Grid creation already in progress, skipping");
      return;
    }
    
    // Validate canvas
    if (!canvas || !canvas.width || !canvas.height) {
      console.error("Cannot create grid: Invalid canvas", { 
        hasCanvas: !!canvas,
        width: canvas?.width, 
        height: canvas?.height 
      });
      toast.error("Cannot create grid: Canvas is not properly initialized");
      return;
    }
    
    // Attempt to acquire grid creation lock
    if (isGridCreationInProgress()) {
      console.log("Grid creation locked, skipping");
      toast.info("Grid creation already in progress");
      return;
    }
    
    try {
      // Set grid creation in progress
      setGridProgress(true);
      setIsCreating(true);
      refreshAttemptRef.current += 1;
      
      // Log the attempt
      console.log(`Creating grid (attempt ${refreshAttemptRef.current})`, { 
        canvasDimensions: `${canvas.width}x${canvas.height}`,
        existingGrid: gridObjects.length
      });
      
      // Clear existing grid objects
      if (gridObjects.length > 0) {
        gridObjects.forEach(obj => {
          try {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          } catch (error) {
            // Ignore errors when removing
          }
        });
        setGridObjects([]);
        setGridCount(0);
      }
      
      // Create new grid
      const newGridObjects = createGridElements(canvas, {
        smallGridSpacing: 20,
        largeGridSpacing: 100
      });
      
      if (newGridObjects.length > 0) {
        // Update state
        setGridObjects(newGridObjects);
        setGridCount(newGridObjects.length);
        
        // Update visibility
        setVisibility(isVisible, newGridObjects);
        
        // Complete grid creation
        setGridProgress(false);
        
        // Log success
        console.log(`Grid created with instance ${instanceIdRef.current}: ${newGridObjects.length} objects`);
        
        // Notify parent
        if (onGridCreated) {
          onGridCreated(newGridObjects);
        }
        
        // Show success toast with grid info
        toast.success(`Grid created with ${newGridObjects.length} lines`);
        
        // Force render to ensure grid is visible
        canvas.requestRenderAll();
        
        // Log success
        console.log(`Grid created successfully: ${newGridObjects.length} objects`);
        logger.info(`Grid created with ${newGridObjects.length} objects`);
      } else {
        // Grid creation failed to create any objects
        toast.error("Grid creation failed");
        console.error("Grid creation returned no objects");
        logger.error("Grid creation returned no objects");
        
        // Reset grid progress to unblock future attempts
        resetGridProgress();
        
        // Report to Sentry
        captureError(
          new Error("Grid creation returned no objects"),
          "grid-creation-empty",
          {
            level: "error",
            tags: {
              component: "SimpleGrid",
              operation: "createGrid"
            },
            extra: {
              canvasDimensions: `${canvas.width}x${canvas.height}`,
              attempt: refreshAttemptRef.current
            }
          }
        );
      }
    } catch (error) {
      // Handle and report error
      console.error("Error creating grid:", error);
      logger.error("Error creating grid:", error);
      
      // Show error toast
      toast.error(`Grid creation error: ${error instanceof Error ? error.message : "Unknown error"}`);
      
      // Reset grid progress
      resetGridProgress();
    } finally {
      setIsCreating(false);
      setGridProgress(false);
    }
  };
  
  /**
   * Set visibility of grid objects
   */
  const setVisibility = (visible: boolean, objectsToUpdate = gridObjects) => {
    try {
      if (!canvas || objectsToUpdate.length === 0) return;
      
      objectsToUpdate.forEach(obj => {
        try {
          if (canvas.contains(obj)) {
            obj.visible = visible;
          }
        } catch (error) {
          // Ignore errors when setting visibility
        }
      });
      
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error setting grid visibility:", error);
    }
  };
  
  /**
   * Toggle grid visibility
   */
  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    setVisibility(newVisibility);
    
    // Ensure grid exists before toggling
    if (gridObjects.length === 0) {
      createGrid();
    }
  };
  
  // Create grid on initial render
  useEffect(() => {
    if (canvas && defaultVisible) {
      // Short timeout to ensure canvas is fully initialized
      const timer = setTimeout(() => {
        createGrid();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [canvas]);
  
  // Clean up grid objects when component unmounts
  useEffect(() => {
    return () => {
      if (canvas && gridObjects.length > 0) {
        gridObjects.forEach(obj => {
          try {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          } catch (error) {
            // Ignore errors during cleanup
          }
        });
      }
    };
  }, [canvas, gridObjects]);
  
  if (!canvas) {
    return null;
  }
  
  return (
    <>
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-90">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={toggleVisibility}
            className="shadow-sm bg-white/80 h-8"
          >
            {isVisible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isVisible ? "Hide Grid" : "Show Grid"}
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={createGrid}
            disabled={isCreating}
            className="shadow-sm h-8"
          >
            {isCreating ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Refresh Grid
          </Button>
        </div>
      )}
      
      {showControls && gridCount > 0 && (
        <div className="absolute bottom-2 left-2 z-10 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          <GridIcon className="h-3 w-3 inline-block mr-1" />
          {gridCount} grid lines
        </div>
      )}
    </>
  );
};
