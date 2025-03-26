
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas, Object as FabricObject } from "fabric";
import { shouldThrottleCreation } from "./gridManager";
import { validateCanvasForGrid } from "./grid/gridValidation";
import { createGridLayer, createFallbackGrid } from "./grid/gridCreator";
import { handleGridCreationError } from "./grid/gridErrorHandling";
import { acquireGridLockWithSafety, cleanupGridResources } from "./grid/gridSafety";
import logger from "./logger";
import { DebugInfoState } from "@/types/debugTypes";
import { toast } from "sonner";

/**
 * Create grid lines for the canvas
 * Creates both small (0.1m) and large (1m) grid lines with consistent performance
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {{ width: number, height: number }} canvasDimensions - Current canvas dimensions
 * @param {React.Dispatch<React.SetStateAction<DebugInfoState>>} setDebugInfo - Function to update debug info state
 * @param {(value: boolean) => void} setHasError - Function to set error state
 * @param {(value: string) => void} setErrorMessage - Function to set error message
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  canvasDimensions: { width: number, height: number },
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
): FabricObject[] => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug("createGrid called with dimensions:", canvasDimensions);
    console.log("🌐 createGrid called with canvas dimensions:", {
      width: canvas?.width,
      height: canvas?.height,
      getWidth: canvas?.getWidth?.(),
      getHeight: canvas?.getHeight?.(),
      provided: canvasDimensions
    });
  }
  
  // Validate inputs first
  if (!validateCanvasForGrid(canvas, gridLayerRef, canvasDimensions)) {
    console.error("❌ Grid validation failed, cannot create grid");
    return gridLayerRef.current;
  }
  
  // Check if we should throttle
  if (shouldThrottleCreation()) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn("Throttling grid creation due to too many recent attempts");
    }
    
    // Return current grid without creating a new one
    return gridLayerRef.current;
  }
  
  try {
    // Create the grid layer directly - immediate mode for better reliability
    const gridObjects = createGridLayer(canvas, gridLayerRef, canvasDimensions, setDebugInfo);
    
    if (!gridObjects || gridObjects.length === 0) {
      logger.error("⚠️ createGridLayer returned empty array, trying fallback");
      console.error("⚠️ Grid creation failed: createGridLayer returned no objects");
      
      // Try fallback grid immediately
      const fallbackGrid = createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
      
      if (!fallbackGrid || fallbackGrid.length === 0) {
        toast.error("Grid creation failed - no objects could be created");
        setHasError(true);
        setErrorMessage("Failed to create grid with both normal and fallback methods");
      }
      
      return fallbackGrid;
    }
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      handleGridCreationError(error, setHasError, setErrorMessage);
      console.error("❌ Grid creation error:", error.message);
    } else {
      handleGridCreationError(new Error('Unknown error during grid creation'), setHasError, setErrorMessage);
      console.error("❌ Unknown grid creation error");
    }
    
    // Try fallback grid on error
    try {
      logger.info("Attempting fallback grid after error");
      return createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
    } catch (fallbackError) {
      logger.error("Even fallback grid creation failed:", fallbackError);
      toast.error("All grid creation methods failed");
      return [];
    }
  }
};

// Re-export all grid utility functions for easier imports
export * from "./grid/gridCreator";
export * from "./grid/gridValidation";
export * from "./grid/gridErrorHandling";
export * from "./grid/gridSafety";
