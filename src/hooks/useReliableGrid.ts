
/**
 * Reliable Grid Hook
 * Provides a robust and self-healing grid creation mechanism
 * @module hooks/useReliableGrid
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGridElements } from "@/utils/grid/createGridElements";
import { 
  runGridDiagnostics, 
  applyGridFixes, 
  verifyGridVisibility,
  emergencyGridFix
} from "@/utils/grid/gridDiagnostics";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";

interface UseReliableGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasDimensions: { width: number; height: number };
}

/**
 * Hook for reliable grid creation and management
 * Features auto-recovery, diagnostics, and emergency fallbacks
 */
export const useReliableGrid = ({
  fabricCanvasRef,
  canvasDimensions
}: UseReliableGridProps) => {
  // Grid objects reference
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // State for tracking grid status
  const [gridInitialized, setGridInitialized] = useState(false);
  const [isCreatingGrid, setIsCreatingGrid] = useState(false);
  const [gridObjectCount, setGridObjectCount] = useState(0);
  const [gridErrorCount, setGridErrorCount] = useState(0);
  const [lastGridCreationTime, setLastGridCreationTime] = useState(0);
  
  // Track attempts to prevent infinite loops
  const attemptCountRef = useRef(0);
  const maxAttempts = 5;
  const cooldownPeriod = 1000; // 1 second between attempts
  
  /**
   * Create grid with enhanced reliability and error handling
   */
  const createGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    
    // Don't allow too many attempts in short succession
    if (Date.now() - lastGridCreationTime < cooldownPeriod) {
      console.log("Grid creation on cooldown, skipping");
      return;
    }
    
    // Track attempt
    attemptCountRef.current++;
    setLastGridCreationTime(Date.now());
    
    // Safety check to prevent infinite loops
    if (attemptCountRef.current > maxAttempts) {
      console.warn(`Exceeded max grid creation attempts (${maxAttempts})`);
      captureError(
        new Error(`Max grid creation attempts (${maxAttempts}) reached`),
        "grid-max-attempts",
        { level: "warning" }
      );
      return;
    }
    
    // Validate canvas
    if (!canvas) {
      console.error("Cannot create grid: Canvas is null");
      setGridErrorCount(prev => prev + 1);
      return;
    }
    
    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      console.error("Cannot create grid: Invalid canvas dimensions", {
        width: canvas.width,
        height: canvas.height
      });
      setGridErrorCount(prev => prev + 1);
      
      captureError(
        new Error(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}`),
        "grid-invalid-dimensions",
        {
          level: "error",
          extra: { dimensions: canvasDimensions }
        }
      );
      return;
    }
    
    try {
      setIsCreatingGrid(true);
      console.log("Creating grid on canvas", {
        width: canvas.width,
        height: canvas.height
      });
      
      // First, remove any existing grid objects
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          try {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          } catch (error) {
            console.error("Error removing grid object:", error);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create new grid
      const gridObjects = createGridElements(canvas);
      
      // Update references
      gridLayerRef.current = gridObjects;
      setGridObjectCount(gridObjects.length);
      
      // Mark grid as initialized
      setGridInitialized(true);
      
      // Force render
      canvas.requestRenderAll();
      
      // Reset attempt counter on success
      attemptCountRef.current = 0;
      
      console.log(`Grid created successfully with ${gridObjects.length} objects`);
      logger.info(`Grid created with ${gridObjects.length} objects`);
      
      return gridObjects;
    } catch (error) {
      console.error("Error creating grid:", error);
      setGridErrorCount(prev => prev + 1);
      
      // Report to Sentry
      captureError(error, "grid-creation-error", {
        level: "error",
        extra: { attemptCount: attemptCountRef.current }
      });
      
      // Try emergency fix as last resort
      if (attemptCountRef.current >= maxAttempts - 1) {
        console.warn("Trying emergency grid fix");
        emergencyGridFix(canvas, gridLayerRef);
      }
      
      return [];
    } finally {
      setIsCreatingGrid(false);
    }
  }, [fabricCanvasRef, canvasDimensions, lastGridCreationTime]);
  
  // Initial grid creation on component mount
  useEffect(() => {
    if (fabricCanvasRef.current && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0 && 
        !gridInitialized) {
      // Short delay to ensure canvas is fully initialized
      const timer = setTimeout(() => {
        createGrid();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [
    fabricCanvasRef, 
    canvasDimensions.width, 
    canvasDimensions.height, 
    gridInitialized, 
    createGrid
  ]);
  
  // Periodic check for grid health
  useEffect(() => {
    const checkGridHealth = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Only run diagnostics if we have grid objects
      if (gridLayerRef.current.length > 0) {
        const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, false);
        
        // If we have issues with grid visibility, apply fixes
        if (diagnostics.status !== 'ok') {
          console.log("Grid health check found issues:", diagnostics.issues);
          applyGridFixes(canvas, gridLayerRef.current);
        }
      }
      // If no grid objects but canvas exists, try to create grid
      else if (canvas && canvas.width && canvas.height) {
        console.log("No grid objects found during health check, creating grid");
        createGrid();
      }
    };
    
    // Check every 5 seconds
    const intervalId = setInterval(checkGridHealth, 5000);
    
    return () => clearInterval(intervalId);
  }, [fabricCanvasRef, createGrid]);
  
  // Create grid when dimensions change significantly
  useEffect(() => {
    if (fabricCanvasRef.current && 
        gridInitialized && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0) {
      // Check if canvas dimensions have changed significantly
      const canvas = fabricCanvasRef.current;
      if (Math.abs(canvas.width - canvasDimensions.width) > 50 || 
          Math.abs(canvas.height - canvasDimensions.height) > 50) {
        console.log("Canvas dimensions changed significantly, recreating grid");
        createGrid();
      }
    }
  }, [canvasDimensions, fabricCanvasRef, gridInitialized, createGrid]);
  
  // Verify grid visibility after creation
  useEffect(() => {
    if (gridInitialized && fabricCanvasRef.current && gridLayerRef.current.length > 0) {
      // Check if grid is visible 
      const timer = setTimeout(() => {
        const isVisible = verifyGridVisibility(fabricCanvasRef.current, gridLayerRef.current);
        
        if (!isVisible) {
          console.warn("Grid visibility check failed, attempting repair");
          applyGridFixes(fabricCanvasRef.current!, gridLayerRef.current);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [fabricCanvasRef, gridInitialized]);
  
  return {
    gridLayerRef,
    createGrid,
    gridInitialized,
    isCreatingGrid,
    gridObjectCount,
    gridErrorCount,
    runDiagnostics: () => runGridDiagnostics(fabricCanvasRef.current, gridLayerRef.current, true)
  };
};
