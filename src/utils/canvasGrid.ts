/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * Handles the creation, validation, and error handling for grid elements
 * @module canvasGrid
 */
import { Canvas, Object as FabricObject } from "fabric";
import { shouldThrottleCreation, logGridStatus } from "./grid/gridManager";
import { toast } from "sonner";
import logger from "./logger";
import { DebugInfoState } from "@/types";
import { throttledLog, throttledError } from "./grid/consoleThrottling";

// Import directly from gridCreationUtils to ensure we have all needed functions
import {
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects,
  createBasicEmergencyGrid,
  createCompleteGrid,
  createGridLayer,
  createFallbackGrid
} from "./gridCreationUtils";

// Import from constants
import {
  GRID_CREATION_COOLDOWN,
  MAX_CREATE_ATTEMPTS,
  GRID_CREATION_CONSTANTS,
  TOAST_MESSAGES
} from "./grid/constants";

// Import validation functions
import { validateCanvas } from "./grid/gridValidation";

// Import error handling
import { handleGridCreationError } from "./grid/errorHandling";

// Utility function placeholders - implement these as needed
const acquireGridLockWithSafety = (id: number): boolean => true;
const cleanupGridResources = (): void => {
  console.log("Grid resources cleaned up");
};

// Grid creation state tracking
let lastGridCreationTime = 0;
let gridCreationInProgress = false;
let createAttempt = 0;
let lastConsoleLogTime = 0;

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
  // Throttle console logging to reduce spam
  const now = Date.now();
  const shouldLog = now - lastConsoleLogTime > 2000;
  
  if (shouldLog && process.env.NODE_ENV === 'development' && !gridCreationInProgress) {
    lastConsoleLogTime = now;
    throttledLog("createGrid called with canvas dimensions:", {
      width: canvas?.width,
      height: canvas?.height,
      provided: canvasDimensions
    });
  }
  
  // If grid already exists with sufficient objects, return current grid
  if (gridLayerRef.current.length > 10) {
    return gridLayerRef.current;
  }
  
  // Check if another grid creation is in progress, if so return current grid
  if (gridCreationInProgress) {
    return gridLayerRef.current;
  }
  
  // Prevent excessive creation attempts with cooldown
  if (now - lastGridCreationTime < GRID_CREATION_COOLDOWN) {
    return gridLayerRef.current;
  }
  
  // Check if we've exceeded max attempts
  if (createAttempt >= MAX_CREATE_ATTEMPTS) {
    if (shouldLog && process.env.NODE_ENV === 'development') {
      throttledLog(`Grid creation abandoned after ${MAX_CREATE_ATTEMPTS} attempts`);
    }
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
    if (!validateCanvas(canvas)) {
      throttledError("Grid validation failed, cannot create grid");
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
    if (shouldLog && process.env.NODE_ENV === 'development') {
      throttledLog("Creating grid - implementation starting");
    }
    
    // Create grid (update to use correct signature)
    const gridObjects = createGridLayer(canvas);
    
    if (!gridObjects || gridObjects.length === 0) {
      if (shouldLog && process.env.NODE_ENV === 'development') {
        throttledError("Grid creation failed: createGridLayer returned no objects");
      }
      
      // Try fallback grid immediately
      const fallbackGrid = createFallbackGrid(canvas);
      
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
    if (shouldLog && creationTime > GRID_CREATION_CONSTANTS.MAX_CREATION_TIME && process.env.NODE_ENV === 'development') {
      throttledLog(`Grid creation took ${creationTime.toFixed(0)}ms, which exceeds the recommended limit`);
    }
    
    // Force a render
    canvas.requestRenderAll();
    
    if (shouldLog && process.env.NODE_ENV === 'development') {
      throttledLog("Grid creation completed successfully");
    }
    
    createAttempt = 0; // Reset attempt counter on success
    
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
      throttledError("Grid creation error:", error.message);
    } else {
      handleGridCreationError(new Error('Unknown error during grid creation'), setHasError, setErrorMessage);
      throttledError("Unknown grid creation error");
    }
    
    // Try fallback grid on error (update to use correct signature)
    try {
      if (shouldLog && process.env.NODE_ENV === 'development') {
        throttledLog("Attempting fallback grid after error");
      }
      const fallbackResult = createFallbackGrid(canvas);
      gridCreationInProgress = false;
      return fallbackResult;
    } catch (fallbackError) {
      if (shouldLog && process.env.NODE_ENV === 'development') {
        throttledError("Even fallback grid creation failed:", fallbackError);
      }
      gridCreationInProgress = false;
      return [];
    }
  }
};

// Re-export all grid utility functions for easier imports
export * from "./grid";
