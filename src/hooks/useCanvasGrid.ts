
/**
 * Canvas grid hook
 * Manages grid creation, updates, and interaction
 * @module useCanvasGrid
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useGridThrottling } from "./grid/useGridThrottling";
import { useGridValidation } from "./grid/useGridValidation";
import { useGridSafety } from "./grid/useGridSafety";
import { useGridRetry } from "./grid/useGridRetry";
import { createGrid as createGridLines } from "@/utils/grid/gridCreation";
import logger from "@/utils/logger";

/**
 * Hook props interface
 * @interface UseCanvasGridProps
 */
interface UseCanvasGridProps {
  /** Reference to Fabric.js canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current zoom level */
  zoomLevel: number;
  /** Function to set error state */
  setHasError?: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage?: (value: string) => void;
}

/**
 * Main hook for canvas grid management
 * Integrates specialized grid hooks for a complete grid system
 * 
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns {Object} Grid management functions and state
 */
export const useCanvasGrid = ({
  fabricCanvasRef,
  canvasDimensions,
  zoomLevel,
  setHasError,
  setErrorMessage
}: UseCanvasGridProps) => {
  // Reference to grid layer objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Use specialized grid hooks
  const { shouldThrottleCreation, handleThrottledCreation, cleanup: cleanupThrottling } = useGridThrottling();
  const { validateGridComponents, ensureGridLayerInitialized } = useGridValidation();
  const { acquireSafetyLock, releaseSafetyLock } = useGridSafety();
  const { scheduleRetry, cancelRetry } = useGridRetry();
  
  // Track whether grid exists
  const gridExistsRef = useRef(false);
  
  /**
   * Clear existing grid from canvas
   * Removes all grid objects from the canvas
   */
  const clearGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Clear the reference array
      gridLayerRef.current = [];
      gridExistsRef.current = false;
      
      // Request canvas render
      canvas.requestRenderAll();
      logger.debug("Grid cleared from canvas");
    }
  }, [fabricCanvasRef]);
  
  /**
   * Create grid on the canvas
   * Creates a new grid or updates existing grid
   * 
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @returns {FabricObject[]} Created grid objects
   */
  const createGrid = useCallback((canvas: FabricCanvas): FabricObject[] => {
    if (!canvas) {
      logger.error("Cannot create grid: Canvas is null");
      return [];
    }
    
    try {
      // Check if we should throttle grid creation
      if (shouldThrottleCreation()) {
        handleThrottledCreation();
        return gridLayerRef.current;
      }
      
      // Acquire safety lock
      const lockInfo = acquireSafetyLock();
      if (!lockInfo) {
        logger.debug("Could not acquire grid creation lock, skipping");
        return gridLayerRef.current;
      }
      
      // Clear existing grid
      clearGrid();
      
      // Validate components
      if (!validateGridComponents()) {
        logger.error("Grid component validation failed");
        releaseSafetyLock(lockInfo.lockId);
        return [];
      }
      
      // Ensure grid layer is initialized
      ensureGridLayerInitialized();
      
      // Create the grid lines
      const gridObjects = createGridLines(canvas);
      
      // Store grid objects in reference
      gridLayerRef.current = gridObjects;
      gridExistsRef.current = gridObjects.length > 0;
      
      // Release the safety lock
      releaseSafetyLock(lockInfo.lockId);
      
      logger.debug(`Grid created with ${gridObjects.length} objects`);
      return gridObjects;
    } catch (error) {
      logger.error("Error creating grid:", error);
      
      if (setHasError && setErrorMessage) {
        setHasError(true);
        setErrorMessage(`Grid creation error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Schedule a retry
      scheduleRetry(() => createGrid(canvas));
      
      return [];
    }
  }, [
    shouldThrottleCreation,
    handleThrottledCreation,
    acquireSafetyLock,
    clearGrid,
    validateGridComponents,
    ensureGridLayerInitialized,
    releaseSafetyLock,
    scheduleRetry,
    setHasError,
    setErrorMessage
  ]);
  
  /**
   * Get current grid objects
   * @returns {FabricObject[]} Current grid objects
   */
  const getGridObjects = useCallback((): FabricObject[] => {
    return gridLayerRef.current;
  }, []);
  
  /**
   * Check if grid exists
   * @returns {boolean} Whether grid exists
   */
  const doesGridExist = useCallback((): boolean => {
    return gridExistsRef.current;
  }, []);
  
  // Create or update grid when canvas dimensions change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Create grid when canvas is available and dimensions are valid
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      createGrid(canvas);
    }
    
    // Cleanup function
    return () => {
      cancelRetry();
      cleanupThrottling();
    };
  }, [
    fabricCanvasRef,
    canvasDimensions.width,
    canvasDimensions.height,
    createGrid,
    cancelRetry,
    cleanupThrottling
  ]);
  
  return {
    gridLayerRef,
    createGrid,
    clearGrid,
    getGridObjects,
    doesGridExist
  };
};
