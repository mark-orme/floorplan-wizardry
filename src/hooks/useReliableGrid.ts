
/**
 * Reliable Grid Hook
 * Provides robust grid creation and management for the canvas
 * @module hooks/useReliableGrid
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import { 
  createReliableGrid, 
  ensureGridVisibility, 
  isGridCreationOnCooldown,
  resetGridCreationState,
  testGridCreation
} from '@/utils/grid/reliableGridCreation';
import logger from '@/utils/logger';
import { validateCanvasForGrid } from '@/utils/grid/gridUtils';

interface UseReliableGridProps {
  /** Reference to the Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Whether to test the grid on initialization */
  testMode?: boolean;
}

interface UseReliableGridResult {
  /** Reference to grid objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Create or refresh the grid */
  createGrid: () => void;
  /** Clean up grid resources */
  cleanupGrid: () => void;
  /** Whether grid initialization has been attempted */
  gridInitialized: boolean;
  /** Whether grid creation is currently in progress */
  isCreatingGrid: boolean;
  /** Number of grid objects */
  gridObjectCount: number;
}

/**
 * Hook for reliable grid creation and management
 */
export const useReliableGrid = ({
  fabricCanvasRef,
  canvasDimensions,
  testMode = false
}: UseReliableGridProps): UseReliableGridResult => {
  // Track grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track initialization state
  const [gridInitialized, setGridInitialized] = useState(false);
  const [isCreatingGrid, setIsCreatingGrid] = useState(false);
  const [gridObjectCount, setGridObjectCount] = useState(0);
  
  // Retry tracking
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  
  /**
   * Create grid on canvas with better error handling and diagnostics
   */
  const createGrid = useCallback(() => {
    // Skip if already creating grid
    if (isCreatingGrid) {
      console.log("Grid creation already in progress, skipping");
      return;
    }
    
    // Skip if canvas is null
    if (!fabricCanvasRef.current) {
      console.warn("Cannot create grid: Canvas is null");
      return;
    }
    
    // Validate canvas dimensions
    if (!validateCanvasForGrid(fabricCanvasRef.current)) {
      console.error("Cannot create grid: Canvas validation failed");
      
      // Show diagnostic toast in development
      if (process.env.NODE_ENV === 'development') {
        toast.error("Grid creation blocked: Canvas validation failed", {
          description: `Canvas dimensions: ${fabricCanvasRef.current.width}x${fabricCanvasRef.current.height}`
        });
      }
      return;
    }
    
    // Skip if still on cooldown and we already have a grid
    if (isGridCreationOnCooldown() && gridLayerRef.current.length > 0) {
      console.log("Grid creation on cooldown - reusing existing grid");
      return;
    }
    
    // Set creating state
    setIsCreatingGrid(true);
    attemptCountRef.current++;
    
    try {
      console.log("Creating grid...", {
        canvasDimensions,
        attempt: attemptCountRef.current,
        existingGridObjects: gridLayerRef.current.length
      });
      
      const canvas = fabricCanvasRef.current;
      
      // Create the grid using our new reliable grid creation
      const gridObjects = createReliableGrid(canvas, gridLayerRef);
      
      // Check result
      if (gridObjects && gridObjects.length > 0) {
        console.log(`Grid created with ${gridObjects.length} objects`);
        setGridInitialized(true);
        setGridObjectCount(gridObjects.length);
        
        // Run test if in test mode
        if (testMode) {
          testGridCreation(canvas);
        }
      } else {
        console.warn("Grid creation returned no objects");
        setGridInitialized(false);
        setGridObjectCount(0);
        
        // Schedule retry with exponential backoff
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        // Determine retry delay based on attempt count (exponential backoff)
        const retryDelay = Math.min(1000 * Math.pow(1.5, attemptCountRef.current - 1), 10000);
        
        retryTimeoutRef.current = setTimeout(() => {
          console.log(`Retrying grid creation (attempt ${attemptCountRef.current + 1})...`);
          createGrid();
        }, retryDelay);
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      logger.error("Error creating grid:", error);
      
      // Show error toast
      toast.error("Error creating grid. Retrying...");
      
      // Schedule retry with exponential backoff
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      const retryDelay = Math.min(2000 * Math.pow(1.5, attemptCountRef.current - 1), 10000);
      
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`Retrying grid creation after error (attempt ${attemptCountRef.current + 1})...`);
        createGrid();
      }, retryDelay);
    } finally {
      setIsCreatingGrid(false);
    }
  }, [fabricCanvasRef, canvasDimensions, testMode, isCreatingGrid]);
  
  /**
   * Clean up grid resources
   */
  const cleanupGrid = useCallback(() => {
    if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
      // Remove all grid objects
      gridLayerRef.current.forEach(obj => {
        if (fabricCanvasRef.current?.contains(obj)) {
          fabricCanvasRef.current.remove(obj);
        }
      });
      
      // Clear references
      gridLayerRef.current = [];
      setGridInitialized(false);
      setGridObjectCount(0);
      
      // Reset state
      resetGridCreationState();
      
      logger.info("Grid cleaned up");
    }
    
    // Clear any pending retries
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, [fabricCanvasRef]);
  
  // Create grid when canvas changes
  useEffect(() => {
    if (fabricCanvasRef.current && !gridInitialized && !isCreatingGrid) {
      console.log("Canvas changed, creating grid...");
      
      // Short delay to ensure canvas is ready
      const timeoutId = setTimeout(() => {
        createGrid();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [fabricCanvasRef.current, gridInitialized, isCreatingGrid, createGrid]);
  
  // Create or update grid when dimensions change significantly
  useEffect(() => {
    if (fabricCanvasRef.current && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0) {
      console.log("Canvas dimensions changed, updating grid...");
      createGrid();
    }
  }, [canvasDimensions.width, canvasDimensions.height, createGrid]);
  
  // Periodically check grid visibility
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const checkGridInterval = setInterval(() => {
      if (fabricCanvasRef.current && gridLayerRef.current.length > 0) {
        const fixed = ensureGridVisibility(fabricCanvasRef.current, gridLayerRef);
        if (fixed) {
          console.log("Grid visibility fixed");
          setGridObjectCount(gridLayerRef.current.length);
        }
      }
    }, 5000);
    
    return () => clearInterval(checkGridInterval);
  }, [fabricCanvasRef]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupGrid();
    };
  }, [cleanupGrid]);
  
  return {
    gridLayerRef,
    createGrid,
    cleanupGrid,
    gridInitialized,
    isCreatingGrid,
    gridObjectCount
  };
};
