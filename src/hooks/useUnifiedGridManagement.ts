
/**
 * Unified grid management hook
 * Combines grid creation, debugging, and maintenance in one place
 * @module hooks/useUnifiedGridManagement
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import logger from "@/utils/logger";
import { resetGridProgress } from "@/utils/gridManager";
import { arrangeGridElementsWithRetry } from "@/utils/useCanvasLayerOrdering";

/**
 * Props for useUnifiedGridManagement hook
 */
interface UseUnifiedGridManagementProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current zoom level */
  zoomLevel?: number;
}

/**
 * Hook that unifies all grid management functions
 * @param props Hook properties
 * @returns Grid management utilities
 */
export const useUnifiedGridManagement = ({
  fabricCanvasRef,
  canvasDimensions,
  zoomLevel = 1
}: UseUnifiedGridManagementProps) => {
  const [debugMode, setDebugMode] = useState(false);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const gridInitializedRef = useRef(false);
  const lastGridCreationAttemptRef = useRef(0);
  const gridCreationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Creates a grid on the canvas
   */
  const createCanvasGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      console.warn("Cannot create grid: Canvas not available");
      return [];
    }
    
    try {
      // Clear any existing grid objects
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create new grid objects
      console.log("Creating grid with dimensions:", canvasDimensions);
      const gridObjects = createBasicEmergencyGrid(canvas);
      
      // Store the grid objects
      gridLayerRef.current = gridObjects;
      gridInitializedRef.current = true;
      lastGridCreationAttemptRef.current = Date.now();
      
      // Arrange grid elements in proper z-order
      arrangeGridElementsWithRetry(canvas, gridLayerRef);
      
      // Request a render to make grid changes visible
      canvas.requestRenderAll();
      console.log(`Created ${gridObjects.length} grid objects`);
      
      return gridObjects;
    } catch (error) {
      console.error("Error creating grid:", error);
      return [];
    }
  }, [fabricCanvasRef, canvasDimensions]);
  
  /**
   * Check grid health and fix issues if needed
   */
  const checkAndFixGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const gridObjects = gridLayerRef.current;
    const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
    
    // If some grid objects are missing from canvas, add them back
    if (gridObjectsOnCanvas.length < gridObjects.length) {
      console.log(`Fixing grid: ${gridObjectsOnCanvas.length}/${gridObjects.length} objects on canvas`);
      
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
      });
      
      // Arrange grid elements in proper z-order
      arrangeGridElementsWithRetry(canvas, gridLayerRef);
      canvas.requestRenderAll();
    }
    
    // If no grid objects exist, create a new grid
    if (gridObjects.length === 0) {
      console.log("No grid objects found, creating new grid");
      createCanvasGrid();
    }
  }, [fabricCanvasRef, createCanvasGrid]);
  
  /**
   * Toggle debug mode
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => {
      const newMode = !prev;
      if (newMode) {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          toast.info("Grid debug mode enabled");
          console.log("Grid objects:", gridLayerRef.current.length);
          console.log("Canvas objects:", canvas.getObjects().length);
        } else {
          toast.error("Canvas not available for debug");
        }
      } else {
        toast.info("Grid debug mode disabled");
      }
      return newMode;
    });
  }, [fabricCanvasRef]);
  
  /**
   * Force grid creation
   */
  const forceGridCreation = useCallback(() => {
    resetGridProgress();
    return createCanvasGrid();
  }, [createCanvasGrid]);
  
  // Create grid when canvas or dimensions change
  useEffect(() => {
    if (fabricCanvasRef.current && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0) {
      
      // Clear any existing timeout
      if (gridCreationTimeoutRef.current) {
        clearTimeout(gridCreationTimeoutRef.current);
      }
      
      // Small delay to ensure canvas is fully initialized
      gridCreationTimeoutRef.current = setTimeout(() => {
        createCanvasGrid();
      }, 200);
      
      return () => {
        if (gridCreationTimeoutRef.current) {
          clearTimeout(gridCreationTimeoutRef.current);
        }
      };
    }
  }, [
    fabricCanvasRef,
    canvasDimensions.width,
    canvasDimensions.height,
    createCanvasGrid
  ]);
  
  // Handle zoom changes
  useEffect(() => {
    if (fabricCanvasRef.current && gridInitializedRef.current) {
      checkAndFixGrid();
    }
  }, [zoomLevel, checkAndFixGrid]);
  
  return {
    gridLayerRef,
    createGrid: createCanvasGrid,
    checkAndFixGrid,
    forceGridCreation,
    isGridInitialized: () => gridInitializedRef.current,
    debugMode,
    toggleDebugMode
  };
};
