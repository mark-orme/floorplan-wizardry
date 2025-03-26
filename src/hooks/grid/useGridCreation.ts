
/**
 * Hook for creating and managing grid objects on canvas
 * Handles the core grid creation functionality
 * @module useGridCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { resetGridProgress } from "@/utils/gridManager";
import { 
  CanvasDimensions, 
  DebugInfoState
} from "@/types/drawingTypes";
import logger from "@/utils/logger";
import { toast } from "sonner";

/**
 * Props for the useGridCreation hook
 * @interface UseGridCreationProps
 */
interface UseGridCreationProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  
  /** Current canvas dimensions */
  canvasDimensions: CanvasDimensions;
  
  /** Setter for debug information state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  
  /** Setter for error state */
  setHasError: (value: boolean) => void;
  
  /** Setter for error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Result type for the useGridCreation hook
 * @interface UseGridCreationResult
 */
type UseGridCreationResult = (canvas: FabricCanvas) => FabricObject[];

/**
 * Hook for grid creation operations
 * Manages the creation of grid lines and objects on the canvas
 * 
 * @param {UseGridCreationProps} props - Hook properties
 * @returns {UseGridCreationResult} Memoized grid creation function
 */
export const useGridCreation = ({
  gridLayerRef,
  canvasDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseGridCreationProps): UseGridCreationResult => {
  
  /**
   * Create grid lines on the canvas
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @returns {FabricObject[]} Array of created grid objects
   */
  const createGridCallback = useCallback((canvas: FabricCanvas): FabricObject[] => {
    console.log("🎨 createGridCallback invoked with canvas dimensions", {
      canvasDimensions,
      gridExists: gridLayerRef?.current?.length > 0,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
      initialized: (canvas as any).initialized
    });
    
    // Enhanced validation for canvas
    if (!canvas) {
      logger.error("🛑 createGrid: Canvas is null or undefined");
      setHasError(true);
      setErrorMessage("Grid creation failed: Invalid canvas object");
      toast.error("Grid creation failed: Canvas is not available");
      return gridLayerRef.current;
    }
    
    // Check if canvas has required methods - Extra Validation
    if (typeof canvas.getWidth !== "function" || typeof canvas.getHeight !== "function") {
      logger.error("🛑 createGrid: invalid canvas instance - missing methods");
      setHasError(true);
      setErrorMessage("Grid creation failed: Invalid Fabric canvas instance");
      toast.error("Grid creation failed: Invalid canvas methods");
      return gridLayerRef.current;
    }
    
    // Get actual dimensions from the canvas
    const canvasWidth = canvas.getWidth?.() || canvas.width;
    const canvasHeight = canvas.getHeight?.() || canvas.height;
    
    console.log("📏 Canvas dimensions for grid creation:", canvasWidth, "x", canvasHeight);
    
    // Check for valid dimensions with improved error reporting
    if (!canvasWidth || !canvasHeight || canvasWidth === 0 || canvasHeight === 0) {
      logger.warn("⚠️ createGrid: Canvas has zero width/height — skipping grid creation", {
        width: canvasWidth,
        height: canvasHeight,
        canvasDimensions
      });
      setHasError(true);
      setErrorMessage(`Grid creation failed: Canvas has zero dimensions (${canvasWidth}x${canvasHeight})`);
      toast.error("Grid creation failed: Canvas has zero dimensions");
      return gridLayerRef.current;
    }
    
    // Force reset any stuck grid creation before attempting
    resetGridProgress();
    
    try {
      // Create the grid by direct call to canvasGrid.ts
      const grid = createGrid(
        canvas, 
        gridLayerRef, 
        canvasDimensions, 
        setDebugInfo, 
        setHasError, 
        setErrorMessage
      );
      
      // IMPROVED: More detailed logging of grid creation results
      console.log("⚠️ createGrid returned:", {
        gridObjectCount: grid?.length || 0,
        firstObject: grid && grid.length > 0 ? {
          type: grid[0].type,
          selectable: grid[0].selectable,
          visible: grid[0].visible
        } : 'No objects created'
      });
      
      if (grid && grid.length > 0) {
        console.log(`✅ Grid created successfully with ${grid.length} objects`);
        
        // Force a render
        canvas.requestRenderAll();
        
        // Add debug info
        setDebugInfo(prev => ({
          ...prev,
          gridCreated: true,
          gridObjectCount: grid.length,
          lastGridCreationTime: Date.now() // Using number instead of string for timestamp
        }));
        
        // Show success toast in development
        if (process.env.NODE_ENV === 'development') {
          toast.success(`Grid created with ${grid.length} objects`);
        }
      } else {
        logger.warn("⚠️ Grid creation returned no objects", {
          canvasWidth, 
          canvasHeight
        });
        setHasError(true);
        setErrorMessage("Grid creation failed: No objects were created");
        toast.error("Grid creation failed: No grid objects were created");
      }
      
      return grid || gridLayerRef.current;
      
    } catch (error) {
      logger.error("❌ Critical error in createGridCallback:", error);
      console.error("Grid creation error:", error);
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Grid creation failed with an error");
      
      return gridLayerRef.current;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
