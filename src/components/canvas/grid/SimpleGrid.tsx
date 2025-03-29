
/**
 * SimpleGrid Component
 * A no-nonsense grid component that actually works
 */
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw, Grid, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { ExtendedFabricObject } from "@/types/fabricTypes";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";

interface SimpleGridProps {
  canvas: FabricCanvas | null;
  showControls?: boolean;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({ 
  canvas, 
  showControls = true
}) => {
  const [gridCreated, setGridCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const creationAttemptsRef = useRef(0);
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for grid creation");
      return;
    }
    
    logger.info("Canvas detected in SimpleGrid, creating grid...");
    console.log("[SimpleGrid] Canvas detected, initializing grid creation", {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      canvasObjects: canvas.getObjects().length
    });
    
    // Create grid after a short delay to ensure canvas is fully initialized
    const timeoutId = setTimeout(() => {
      createGrid();
    }, 500); // Increased delay for better reliability
    
    return () => {
      clearTimeout(timeoutId);
      clearExistingGrid();
    };
  }, [canvas]);
  
  // Direct grid creation function without relying on external utilities
  const createGrid = () => {
    if (!canvas) {
      const errorMsg = "Cannot create grid: Canvas not available";
      logger.error(errorMsg);
      setError(errorMsg);
      return;
    }
    
    setIsCreating(true);
    creationAttemptsRef.current += 1;
    
    try {
      // Log detailed canvas info for debugging
      console.log("[SimpleGrid] Creating grid with canvas:", {
        width: canvas.width,
        height: canvas.height,
        objects: canvas.getObjects().length,
        attempt: creationAttemptsRef.current
      });
      
      if (!canvas.width || !canvas.height) {
        const dimensionError = `Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`;
        logger.error(dimensionError);
        setError(dimensionError);
        
        captureError(new Error(dimensionError), "grid-dimension-error", {
          level: "error",
          tags: {
            component: "SimpleGrid",
            operation: "grid-creation"
          },
          extra: {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            attempt: creationAttemptsRef.current
          }
        });
        
        setIsCreating(false);
        toast.error("Grid creation failed: Canvas has invalid dimensions");
        return;
      }
      
      // Clear existing grid first
      clearExistingGrid();
      
      // Get dimensions for grid calculation
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      
      logger.info(`Creating grid with dimensions: ${width}x${height}`);
      console.log(`[SimpleGrid] Creating grid with dimensions: ${width}x${height}`);
      
      const gridObjects: FabricObject[] = [];
      
      // Create small grid lines with explicit spacing value
      const smallGridSize = 10; // Using direct value instead of constant for reliability
      
      // Create horizontal small grid lines
      for (let y = 0; y <= height; y += smallGridSize) {
        const line = new Line([0, y, width, y], {
          stroke: "#f0f0f0", // Using direct value instead of constant
          strokeWidth: 0.5,
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
          stroke: "#f0f0f0", // Using direct value instead of constant
          strokeWidth: 0.5,
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
      
      // Create large grid lines with explicit spacing value
      const largeGridSize = 50; // Using direct value instead of constant for reliability
      
      // Create horizontal large grid lines
      for (let y = 0; y <= height; y += largeGridSize) {
        const line = new Line([0, y, width, y], {
          stroke: "#d0d0d0", // Using direct value instead of constant
          strokeWidth: 1,
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
          stroke: "#d0d0d0", // Using direct value instead of constant
          strokeWidth: 1,
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
      
      // Force render all and check rendering success
      try {
        canvas.requestRenderAll();
        console.log(`[SimpleGrid] Canvas rendering requested with ${gridObjects.length} grid objects`);
      } catch (renderError) {
        logger.error("Error during canvas rendering:", renderError);
        captureError(renderError, "grid-render-error", {
          level: "error",
          tags: {
            component: "SimpleGrid",
            operation: "canvas-render"
          }
        });
      }
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Update state
      setGridCreated(gridObjects.length > 0);
      setError(null);
      
      if (gridObjects.length > 0) {
        logger.info(`Grid created with ${gridObjects.length} objects`);
        console.log(`[SimpleGrid] ✅ Grid created with ${gridObjects.length} objects`);
        toast.success(`Grid created with ${gridObjects.length} lines`);
      } else {
        const noObjectsError = "Grid creation failed: No objects created";
        logger.error(noObjectsError);
        setError(noObjectsError);
        
        captureError(new Error(noObjectsError), "grid-creation-empty", {
          level: "error",
          tags: {
            component: "SimpleGrid",
            operation: "grid-creation"
          }
        });
        
        toast.error("Failed to create grid");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error creating grid:", error);
      console.error("[SimpleGrid] ❌ Error creating grid:", error);
      setError(errorMessage);
      
      // Report to Sentry with detailed context
      captureError(error, "grid-creation-exception", {
        level: "error",
        tags: {
          component: "SimpleGrid",
          operation: "grid-creation",
          attempt: String(creationAttemptsRef.current)
        },
        extra: {
          canvasInfo: canvas ? {
            width: canvas.width,
            height: canvas.height,
            objectCount: canvas.getObjects().length,
            valid: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
          } : 'Canvas not available'
        }
      });
      
      toast.error("Failed to create grid");
      
      // Try emergency grid creation
      if (creationAttemptsRef.current < 3) {
        logger.info("Attempting emergency grid creation");
        setTimeout(() => {
          createEmergencyGrid();
        }, 500);
      }
    } finally {
      setIsCreating(false);
    }
  };
  
  // Emergency grid creation as fallback
  const createEmergencyGrid = () => {
    if (!canvas) return;
    
    try {
      logger.info("Creating emergency grid");
      console.log("[SimpleGrid] 🚨 Creating emergency grid");
      
      // Clear existing grid
      clearExistingGrid();
      
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      const gridObjects: FabricObject[] = [];
      const gridSpacing = 50;
      
      // Create fewer, simpler grid lines
      for (let y = 0; y <= height; y += gridSpacing) {
        try {
          const line = new Line([0, y, width, y], {
            stroke: '#d0d0d0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false
          });
          
          canvas.add(line);
          gridObjects.push(line);
        } catch (lineError) {
          console.error("Error creating emergency grid line:", lineError);
        }
      }
      
      for (let x = 0; x <= width; x += gridSpacing) {
        try {
          const line = new Line([x, 0, x, height], {
            stroke: '#d0d0d0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false
          });
          
          canvas.add(line);
          gridObjects.push(line);
        } catch (lineError) {
          console.error("Error creating emergency grid line:", lineError);
        }
      }
      
      // Force render
      canvas.requestRenderAll();
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Update state
      setGridCreated(gridObjects.length > 0);
      
      if (gridObjects.length > 0) {
        logger.info(`Emergency grid created with ${gridObjects.length} objects`);
        toast.success(`Simple grid created with ${gridObjects.length} lines`);
      } else {
        logger.error("Emergency grid creation failed");
        toast.error("Emergency grid creation failed");
      }
    } catch (error) {
      logger.error("Critical error in emergency grid creation:", error);
      captureError(error, "emergency-grid-creation-failed", {
        level: "fatal",
        tags: {
          component: "SimpleGrid",
          operation: "emergency-grid"
        }
      });
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
      logger.error("Error clearing grid:", error);
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
      
      {error && (
        <div className="text-xs flex items-center text-red-500">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span className="truncate max-w-[100px]" title={error}>
            Error
          </span>
        </div>
      )}
    </div>
  );
};
