
/**
 * Hook for reliable grid creation and management
 * @module hooks/useReliableGrid
 */
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createReliableGrid, ensureGridVisibility } from "@/utils/grid/simpleGridCreator";
import { resetGridProgress, setGridProgress, isGridCreationInProgress } from "@/utils/gridManager";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface UseReliableGridProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Whether to create grid automatically */
  autoCreate?: boolean;
  /** Whether to show toast messages */
  showToasts?: boolean;
}

/**
 * Hook for reliable grid creation and management
 */
export const useReliableGrid = ({
  fabricCanvasRef,
  canvasDimensions,
  autoCreate = true,
  showToasts = true
}: UseReliableGridProps) => {
  const gridLayerRef = useRef<FabricObject[]>([]);
  const [gridInitialized, setGridInitialized] = useState(false);
  const [isCreatingGrid, setIsCreatingGrid] = useState(false);
  const [gridObjectCount, setGridObjectCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const attemptRef = useRef(0);
  
  /**
   * Create grid with proper handling
   */
  const createGrid = async () => {
    const canvas = fabricCanvasRef.current;
    
    // Skip if no canvas
    if (!canvas) {
      logger.warn("Cannot create grid: No canvas available");
      return false;
    }
    
    // Skip if already creating
    if (isGridCreationInProgress()) {
      logger.info("Grid creation already in progress, skipping");
      return false;
    }
    
    try {
      // Mark grid creation as in progress
      setGridProgress(true);
      setIsCreatingGrid(true);
      attemptRef.current += 1;
      setLastAttemptTime(Date.now());
      
      // Create grid
      logger.info(`Creating grid (attempt ${attemptRef.current})`);
      const newGridObjects = createReliableGrid(canvas, gridLayerRef);
      
      // Update state
      setGridObjectCount(newGridObjects.length);
      setGridInitialized(newGridObjects.length > 0);
      
      // Show toast if requested
      if (showToasts && newGridObjects.length > 0) {
        toast.success(`Grid created with ${newGridObjects.length} objects`);
      } else if (showToasts && newGridObjects.length === 0) {
        toast.error("Failed to create grid");
      }
      
      return newGridObjects.length > 0;
    } catch (error) {
      logger.error("Error creating grid:", error);
      if (showToasts) {
        toast.error("Error creating grid");
      }
      return false;
    } finally {
      setIsCreatingGrid(false);
      setGridProgress(false);
    }
  };
  
  /**
   * Ensure grid is visible
   */
  const ensureGridIsVisible = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || gridLayerRef.current.length === 0) return;
    
    const fixed = ensureGridVisibility(canvas, gridLayerRef);
    if (fixed) {
      logger.info("Fixed grid visibility issues");
    }
  };
  
  // Create grid on canvas available
  useEffect(() => {
    if (autoCreate && fabricCanvasRef.current && !gridInitialized) {
      // Reset any stuck state
      resetGridProgress();
      
      // Short delay to ensure canvas is properly initialized
      const timeoutId = setTimeout(() => {
        createGrid();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [fabricCanvasRef.current, autoCreate, gridInitialized]);
  
  // Ensure grid visibility periodically
  useEffect(() => {
    if (!gridInitialized) return;
    
    const intervalId = setInterval(() => {
      ensureGridIsVisible();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [gridInitialized]);
  
  // Clean up grid on unmount
  useEffect(() => {
    return () => {
      const canvas = fabricCanvasRef.current;
      if (canvas && gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          try {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          } catch (error) {
            // Ignore cleanup errors
          }
        });
      }
    };
  }, [fabricCanvasRef]);
  
  return {
    gridLayerRef,
    createGrid,
    ensureGridIsVisible,
    gridInitialized,
    isCreatingGrid,
    gridObjectCount
  };
};
