
/**
 * Grid creation hook
 * Manages the creation and updates of the grid system
 * @module hooks/grid/useGridCreation
 */
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createCompleteGrid, createBasicEmergencyGrid, validateGrid } from "@/utils/grid/gridRenderers";
import logger from "@/utils/logger";

/**
 * Props for useGridCreation hook
 */
export interface UseGridCreationProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the last grid creation attempt timestamp */
  lastGridCreationAttemptRef: React.MutableRefObject<number>;
  /** Reference to grid initialization state */
  gridInitializedRef: React.MutableRefObject<boolean>;
}

/**
 * Hook for creating and managing canvas grid
 * 
 * @param {UseGridCreationProps} props - Hook properties
 * @returns Grid creation and management functions
 */
export const useGridCreation = ({
  fabricCanvasRef,
  lastGridCreationAttemptRef,
  gridInitializedRef
}: UseGridCreationProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  
  // Create grid function
  const createGrid = useCallback((): FabricObject[] => {
    const canvas = fabricCanvasRef.current;
    setError("");
    
    if (!canvas) {
      setError("No canvas available");
      return [];
    }
    
    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      setError("Invalid canvas dimensions");
      logger.warn("Grid creation attempted with invalid canvas dimensions:", {
        width: canvas.width,
        height: canvas.height
      });
      return [];
    }
    
    // Prevent too frequent grid creation attempts
    const now = Date.now();
    if (now - lastGridCreationAttemptRef.current < 500) {
      return [];
    }
    
    lastGridCreationAttemptRef.current = now;
    setIsCreating(true);
    
    try {
      // Remove any existing grid objects
      const existingGridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      if (existingGridObjects.length > 0) {
        existingGridObjects.forEach(obj => {
          canvas.remove(obj);
        });
      }
      
      // Create grid
      const gridObjects = createCompleteGrid(canvas);
      
      // If complete grid creation failed, try emergency grid
      if (!gridObjects || gridObjects.length === 0) {
        logger.warn("Complete grid creation failed, attempting emergency grid");
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        
        if (emergencyGrid.length > 0) {
          gridInitializedRef.current = true;
          setIsCreating(false);
          return emergencyGrid;
        }
      } else {
        gridInitializedRef.current = true;
        setIsCreating(false);
        return gridObjects;
      }
      
      setError("Failed to create grid");
      return [];
    } catch (error) {
      logger.error("Error creating grid:", error);
      setError("Error creating grid");
      setIsCreating(false);
      
      // Try emergency grid on error
      try {
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        if (emergencyGrid.length > 0) {
          gridInitializedRef.current = true;
          return emergencyGrid;
        }
      } catch (emergencyError) {
        logger.error("Emergency grid creation also failed:", emergencyError);
      }
      
      return [];
    }
  }, [fabricCanvasRef, lastGridCreationAttemptRef, gridInitializedRef]);
  
  // Ensure grid visibility
  const ensureVisibility = useCallback((): boolean => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) {
      return false;
    }
    
    // Get grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Set visibility to true for all grid objects
    let visibilityChanged = false;
    gridObjects.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityChanged = true;
      }
    });
    
    if (visibilityChanged) {
      canvas.requestRenderAll();
    }
    
    return true;
  }, [fabricCanvasRef]);
  
  return {
    createGrid,
    ensureVisibility,
    isCreating,
    error
  };
};
