/**
 * Grid creator module
 * Core functionality for creating grid on canvas
 * @module gridCreator
 */
import { Canvas, Object as FabricObject } from "fabric";
import { gridManager, acquireGridCreationLock, releaseGridCreationLock } from "../gridManager";
import { validateCanvasForGrid } from "./gridValidation";
import { arrangeGridObjects } from "../gridRenderer";
import { handleGridCreationError, scheduleGridRetry } from "./gridErrorHandling";
import logger from "../logger";
import { DebugInfoState } from "@/types/drawingTypes";

// Define the GridRenderResult interface that was missing
interface GridRenderResult {
  gridObjects: FabricObject[];
  smallGridLines: FabricObject[];
  largeGridLines: FabricObject[];
  markers: FabricObject[];
}

// Import the renderGridComponents function
import { renderGridComponents } from "../gridRenderer";

/**
 * Create grid layer on the canvas with safety mechanisms
 * Creates the actual grid after validation passes
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {Object} canvasDimensions - Current canvas dimensions
 * @param {Function} setDebugInfo - Function to update debug info state
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  canvasDimensions: { width: number, height: number },
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>
): FabricObject[] => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug("Creating grid layer with dimensions:", canvasDimensions);
  }
  
  // Store the dimensions for future reference
  gridManager.lastDimensions = { ...canvasDimensions };
  
  // Remove existing grid objects if any
  if (gridLayerRef.current.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Removing ${gridLayerRef.current.length} existing grid objects`);
    }
    
    const existingObjects = [...gridLayerRef.current];
    existingObjects.forEach(object => {
      if (canvas.contains(object)) {
        try {
          canvas.remove(object);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            logger.warn("Error removing existing grid object:", error);
          }
        }
      }
    });
    gridLayerRef.current = [];
  }
  
  // Apply minimum dimensions to avoid zero-size grid issues
  const canvasWidth = Math.max(canvas.width || canvasDimensions.width, 200);
  const canvasHeight = Math.max(canvas.height || canvasDimensions.height, 200);
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Canvas dimensions for grid creation: ${canvasWidth}x${canvasHeight}`);
  }
  
  // Create all grid components at once
  const result = renderGridComponents(canvas, canvasWidth, canvasHeight);
  
  // Proper error handling and fallback logic
  if (!result.gridObjects.length) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn("No grid objects were created - trying hardcoded dimensions");
    }
    
    // Try with hardcoded dimensions as fallback
    return createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
  } 
  
  // Arrange grid objects in correct z-order
  arrangeGridObjects(
    canvas,
    result.smallGridLines,
    result.largeGridLines,
    result.markers
  );
  
  // Store grid objects in the reference for later use
  gridLayerRef.current = result.gridObjects;
  
  // Set the grid exists flag
  gridManager.exists = true;
  
  // Reset consecutive resets counter on success
  gridManager.consecutiveResets = 0;
  
  if (process.env.NODE_ENV === 'development') {
    // Detailed grid creation log
    logger.debug(`Grid created with ${result.gridObjects.length} objects (${result.smallGridLines.length} small, ${result.largeGridLines.length} large, ${result.markers.length} markers)`);
  }
  
  // Force a complete render
  canvas.requestRenderAll();
  
  // Update debug info
  setDebugInfo(prev => ({...prev, gridCreated: true}));
  
  return result.gridObjects;
};

/**
 * Create a fallback grid when normal grid creation fails
 * Uses hardcoded dimensions as a last resort
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {Function} setDebugInfo - Function to update debug info state
 * @returns {FabricObject[]} Created fallback grid objects
 */
export const createFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>
): FabricObject[] => {
  const fallbackResult = renderGridComponents(canvas, 800, 600);
  
  if (fallbackResult.gridObjects.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug("Fallback grid creation succeeded");
    }
    
    // Arrange grid objects properly
    arrangeGridObjects(
      canvas,
      fallbackResult.smallGridLines,
      fallbackResult.largeGridLines,
      fallbackResult.markers
    );
    
    gridLayerRef.current = fallbackResult.gridObjects;
    gridManager.exists = true;
    setDebugInfo(prev => ({...prev, gridCreated: true}));
    
    // Force a render
    canvas.requestRenderAll();
    
    // Reset consecutive resets counter on success
    gridManager.consecutiveResets = 0;
    
    return fallbackResult.gridObjects;
  }
  
  return [];
}
