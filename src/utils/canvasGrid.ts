
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * Handles the creation, validation, and error handling for grid elements
 * @module canvasGrid
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
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
let createAttempt = 0;
const MAX_CREATE_ATTEMPTS = 5;

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
  // Only log detailed information in development mode, and only once per creation
  if (process.env.NODE_ENV === 'development' && !gridCreationInProgress) {
    logger.debug("createGrid called with canvas dimensions:", {
      width: canvas?.width,
      height: canvas?.height,
      getWidth: canvas?.getWidth?.(),
      getHeight: canvas?.getHeight?.(),
      provided: canvasDimensions
    });
  }
  
  // Check if another grid creation is in progress, if so return current grid
  if (gridCreationInProgress) {
    return gridLayerRef.current;
  }
  
  // Prevent excessive creation attempts with cooldown
  const now = Date.now();
  if (now - lastGridCreationTime < GRID_CREATION_COOLDOWN) {
    return gridLayerRef.current;
  }
  
  // Check if we've exceeded max attempts
  if (createAttempt >= MAX_CREATE_ATTEMPTS) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`Grid creation abandoned after ${MAX_CREATE_ATTEMPTS} attempts`);
    }
    toast.error("Grid creation abandoned. Please refresh the page.");
    return gridLayerRef.current;
  }
  
  // Increment attempt counter
  createAttempt++;
  
  // Set creation flags
  gridCreationInProgress = true;
  lastGridCreationTime = now;
  
  // Start time for performance tracking
  const startTime = performance.now();
  
  try {
    // Validate inputs first
    if (!validateCanvasForGrid(canvas, gridLayerRef, canvasDimensions)) {
      logger.error("Grid validation failed, cannot create grid");
      gridCreationInProgress = false;
      return gridLayerRef.current;
    }
    
    // Check if we should throttle
    if (shouldThrottleCreation()) {
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
    if (process.env.NODE_ENV === 'development') {
      logger.info("Creating grid - implementation starting");
    }
    
    // ACTUAL IMPLEMENTATION INSTEAD OF PLACEHOLDER
    const createGridLines = () => {
      const width = canvas.width || canvasDimensions.width;
      const height = canvas.height || canvasDimensions.height;
      const gridObjects: FabricObject[] = [];
      
      // Parameters for grid
      const smallGridSpacing = 10; // 10px for small grid (0.1m)
      const largeGridSpacing = 100; // 100px for large grid (1m)
      const smallGridColor = '#f0f0f0';
      const largeGridColor = '#d0d0d0';
      
      // Create horizontal small grid lines
      for (let y = 0; y <= height; y += smallGridSpacing) {
        const line = new Line([0, y, width, y], {
          stroke: smallGridColor,
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          hoverCursor: 'default'
        });
        
        gridObjects.push(line);
        canvas.add(line);
      }
      
      // Create vertical small grid lines
      for (let x = 0; x <= width; x += smallGridSpacing) {
        const line = new Line([x, 0, x, height], {
          stroke: smallGridColor,
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          hoverCursor: 'default'
        });
        
        gridObjects.push(line);
        canvas.add(line);
      }
      
      // Create horizontal large grid lines
      for (let y = 0; y <= height; y += largeGridSpacing) {
        const line = new Line([0, y, width, y], {
          stroke: largeGridColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          hoverCursor: 'default'
        });
        
        gridObjects.push(line);
        canvas.add(line);
      }
      
      // Create vertical large grid lines
      for (let x = 0; x <= width; x += largeGridSpacing) {
        const line = new Line([x, 0, x, height], {
          stroke: largeGridColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          hoverCursor: 'default'
        });
        
        gridObjects.push(line);
        canvas.add(line);
      }
      
      return gridObjects;
    };
    
    const gridObjects = createGridLines();
    
    if (!gridObjects || gridObjects.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        logger.error("Grid creation failed: createGridLayer returned no objects");
      }
      
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
      createAttempt = 0; // Reset attempt counter on success
      return fallbackGrid;
    }
    
    // Store the created grid objects
    gridLayerRef.current = gridObjects;
    
    // Check if creation took too long
    const creationTime = performance.now() - startTime;
    if (creationTime > GRID_CREATION_CONSTANTS.MAX_CREATION_TIME && process.env.NODE_ENV === 'development') {
      logger.warn(`Grid creation took ${creationTime.toFixed(0)}ms, which exceeds the recommended limit`);
    }
    
    // Force a render
    canvas.requestRenderAll();
    if (process.env.NODE_ENV === 'development') {
      logger.info("Grid creation completed successfully");
    }
    createAttempt = 0; // Reset attempt counter on success
    toast.success(TOAST_MESSAGES.GRID_CREATED);
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      gridCreated: true,
      gridObjectCount: gridObjects.length
    }));
    
    gridCreationInProgress = false;
    return gridObjects;
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      handleGridCreationError(error, setHasError, setErrorMessage);
      logger.error("Grid creation error:", error.message);
    } else {
      handleGridCreationError(new Error('Unknown error during grid creation'), setHasError, setErrorMessage);
      logger.error("Unknown grid creation error");
    }
    
    // Try fallback grid on error
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.info("Attempting fallback grid after error");
      }
      const fallbackResult = createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
      gridCreationInProgress = false;
      return fallbackResult;
    } catch (fallbackError) {
      if (process.env.NODE_ENV === 'development') {
        logger.error("Even fallback grid creation failed:", fallbackError);
      }
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
