
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * Handles the creation, validation, and error handling for grid elements
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

// Store last grid creation time to prevent excessive creation attempts
let lastGridCreationTime = 0;
const GRID_CREATION_COOLDOWN = 5000; // 5 seconds between attempts
let gridCreationInProgress = false;

/**
 * Grid creation timing constants
 * @constant {Object}
 */
const GRID_CREATION_CONSTANTS = {
  /**
   * Delay for logging in development mode (ms)
   * @constant {number}
   */
  DEV_LOG_DELAY: 100,
  
  /**
   * Maximum time allowed for grid creation in ms
   * @constant {number}
   */
  MAX_CREATION_TIME: 2000,
  
  /**
   * Delay between creation attempts in ms
   * @constant {number}
   */
  RETRY_DELAY: 500
};

/**
 * Toast message constants
 * @constant {Object}
 */
const TOAST_MESSAGES = {
  /**
   * Error message for grid creation failure
   * @constant {string}
   */
  GRID_CREATION_FAILED: "Grid creation failed - no objects could be created",
  
  /**
   * Error message for all methods failing
   * @constant {string}
   */
  ALL_METHODS_FAILED: "All grid creation methods failed",
  
  /**
   * Successful grid creation message
   * @constant {string}
   */
  GRID_CREATED: "Grid created successfully",
  
  /**
   * Fallback grid creation message
   * @constant {string}
   */
  USING_FALLBACK_GRID: "Using fallback grid"
};

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
  
  // Check if another grid creation is in progress, if so return current grid
  if (gridCreationInProgress) {
    logger.info("Grid creation already in progress, skipping");
    return gridLayerRef.current;
  }
  
  // Prevent excessive creation attempts with cooldown
  const now = Date.now();
  if (now - lastGridCreationTime < GRID_CREATION_COOLDOWN) {
    logger.info(`Grid creation throttled. Last creation: ${lastGridCreationTime}, cooldown: ${GRID_CREATION_COOLDOWN}ms`);
    return gridLayerRef.current;
  }
  
  // Set creation flags
  gridCreationInProgress = true;
  lastGridCreationTime = now;
  
  // Start time for performance tracking
  const startTime = performance.now();
  
  try {
    // Validate inputs first
    if (!validateCanvasForGrid(canvas, gridLayerRef, canvasDimensions)) {
      console.error("❌ Grid validation failed, cannot create grid");
      gridCreationInProgress = false;
      return gridLayerRef.current;
    }
    
    // Check if we should throttle
    if (shouldThrottleCreation()) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn("Throttling grid creation due to too many recent attempts");
      }
      
      gridCreationInProgress = false;
      return gridLayerRef.current;
    }
    
    // Remove previous grid objects first
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create the grid layer directly - immediate mode for better reliability
    logger.info("Creating grid - implementation starting");
    
    const gridObjects = createGridLayer(canvas, gridLayerRef, canvasDimensions, setDebugInfo);
    
    if (!gridObjects || gridObjects.length === 0) {
      logger.error("⚠️ createGridLayer returned empty array, trying fallback");
      console.error("⚠️ Grid creation failed: createGridLayer returned no objects");
      
      // Try fallback grid immediately
      const fallbackGrid = createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
      
      if (!fallbackGrid || fallbackGrid.length === 0) {
        toast.error(TOAST_MESSAGES.GRID_CREATION_FAILED);
        setHasError(true);
        setErrorMessage("Failed to create grid with both normal and fallback methods");
      } else {
        toast.info(TOAST_MESSAGES.USING_FALLBACK_GRID);
      }
      
      gridCreationInProgress = false;
      return fallbackGrid;
    }
    
    // Check if creation took too long
    const creationTime = performance.now() - startTime;
    if (creationTime > GRID_CREATION_CONSTANTS.MAX_CREATION_TIME) {
      logger.warn(`Grid creation took ${creationTime.toFixed(0)}ms, which exceeds the recommended limit`);
    }
    
    // Force a render
    canvas.requestRenderAll();
    logger.info("Grid creation completed successfully");
    
    gridCreationInProgress = false;
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
      const fallbackResult = createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
      gridCreationInProgress = false;
      return fallbackResult;
    } catch (fallbackError) {
      logger.error("Even fallback grid creation failed:", fallbackError);
      toast.error(TOAST_MESSAGES.ALL_METHODS_FAILED);
      gridCreationInProgress = false;
      return [];
    }
  }
};

// Re-export all grid utility functions for easier imports
export * from "./grid/gridCreator";
export * from "./grid/gridValidation";
export * from "./grid/gridErrorHandling";
export * from "./grid/gridSafety";
