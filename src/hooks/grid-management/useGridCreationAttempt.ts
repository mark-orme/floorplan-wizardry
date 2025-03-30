
/**
 * Hook for managing grid creation attempts
 * @module hooks/grid-management/useGridCreationAttempt
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { GridAttemptTracker, incrementTotalAttempts, incrementSuccessfulAttempts, setLastError } from "./gridAttemptTracker";

/**
 * Result of the useGridCreationAttempt hook
 */
interface UseGridCreationAttemptResult {
  attemptGridCreation: (
    status: GridAttemptTracker,
    updateStatus: (updater: (status: GridAttemptTracker) => GridAttemptTracker) => void,
    lastAttemptTime: number,
    updateLastAttemptTime: (time: number) => void
  ) => void;
  createEmergencyGridOnFailure: (canvas: FabricCanvas) => FabricObject[];
  shouldRateLimit: (lastAttemptTime: number) => boolean;
}

/**
 * Hook for managing grid creation attempts
 * @param fabricCanvasRef - Reference to Fabric canvas
 * @param gridLayerRef - Reference to grid layer objects
 * @param createGrid - Function to create grid
 * @returns Grid creation attempt utilities
 */
export const useGridCreationAttempt = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
): UseGridCreationAttemptResult => {
  /**
   * Check if grid creation should be rate limited
   */
  const shouldRateLimit = useCallback((lastAttemptTime: number): boolean => {
    return Date.now() - lastAttemptTime < 500; // Rate limit to max once per 500ms
  }, []);
  
  /**
   * Create emergency grid when normal grid creation fails
   */
  const createEmergencyGridOnFailure = useCallback((canvas: FabricCanvas): FabricObject[] => {
    try {
      logger.warn("Creating emergency grid after failure");
      
      // Create simple grid lines
      const gridObjects: FabricObject[] = [];
      const gridSize = 50;
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      
      // Simple horizontal lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new Line([0, i, width, i], {
          stroke: '#e5e5e5',
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Simple vertical lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new Line([i, 0, i, height], {
          stroke: '#e5e5e5',
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      canvas.renderAll();
      gridLayerRef.current = gridObjects;
      
      return gridObjects;
    } catch (error) {
      logger.error("Emergency grid creation failed:", error);
      return [];
    }
  }, [gridLayerRef]);
  
  /**
   * Attempt to create grid with proper error handling
   */
  const attemptGridCreation = useCallback((
    status: GridAttemptTracker,
    updateStatus: (updater: (status: GridAttemptTracker) => GridAttemptTracker) => void,
    lastAttemptTime: number, 
    updateLastAttemptTime: (time: number) => void
  ): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.error("Cannot create grid: Canvas is null");
      return;
    }
    
    // Update total attempts
    updateStatus(incrementTotalAttempts);
    
    try {
      // Create grid
      logger.info("Attempting grid creation");
      const gridObjects = createGrid(canvas);
      
      // Store created objects
      gridLayerRef.current = gridObjects;
      
      // Handle success
      if (gridObjects.length > 0) {
        updateStatus(incrementSuccessfulAttempts);
        console.log(`Created ${gridObjects.length} grid objects successfully`);
      } else {
        // Try emergency grid if no objects created
        const emergencyGrid = createEmergencyGridOnFailure(canvas);
        if (emergencyGrid.length > 0) {
          updateStatus(incrementSuccessfulAttempts);
          console.log(`Created ${emergencyGrid.length} emergency grid objects`);
        }
      }
      
      // Update last attempt time
      updateLastAttemptTime(Date.now());
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(status => setLastError(status, errorMessage));
      
      logger.error("Grid creation failed:", error);
      console.error("Grid creation failed:", error);
      
      // Try emergency grid on error
      createEmergencyGridOnFailure(canvas);
      
      // Update last attempt time
      updateLastAttemptTime(Date.now());
    }
  }, [fabricCanvasRef, gridLayerRef, createGrid, createEmergencyGridOnFailure]);
  
  return {
    attemptGridCreation,
    createEmergencyGridOnFailure,
    shouldRateLimit
  };
};
