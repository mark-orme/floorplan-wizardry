
/**
 * Reliable grid creation utility
 * Provides robust grid creation with retries and error handling
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGridElements } from "./createGridElements";
import { captureError } from "../sentryUtils";
import logger from "../logger";

interface GridCreationState {
  lastAttemptTime: number;
  cooldownPeriod: number;
  attemptsCount: number;
  maxConsecutiveAttempts: number;
}

// Singleton state for grid creation
const gridCreationState: GridCreationState = {
  lastAttemptTime: 0,
  cooldownPeriod: 2000, // 2 seconds
  attemptsCount: 0,
  maxConsecutiveAttempts: 5
};

/**
 * Check if grid creation is on cooldown
 * @returns {boolean} Whether grid creation is on cooldown
 */
export const isGridCreationOnCooldown = (): boolean => {
  return (Date.now() - gridCreationState.lastAttemptTime) < gridCreationState.cooldownPeriod;
};

/**
 * Reset grid creation state
 */
export const resetGridCreationState = (): void => {
  gridCreationState.attemptsCount = 0;
  gridCreationState.lastAttemptTime = 0;
  
  logger.info("Grid creation state reset");
  console.log("Grid creation state reset");
};

/**
 * Create a grid with error handling and retries
 * @param {FabricCanvas} canvas - The canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    // Check cooldown
    if (isGridCreationOnCooldown()) {
      console.log("Grid creation on cooldown, skipping");
      return gridLayerRef.current;
    }
    
    // Update state
    gridCreationState.lastAttemptTime = Date.now();
    gridCreationState.attemptsCount++;
    
    // Check max attempts
    if (gridCreationState.attemptsCount > gridCreationState.maxConsecutiveAttempts) {
      const error = new Error(`Too many consecutive grid creation attempts (${gridCreationState.attemptsCount})`);
      captureError(error, "grid-creation-max-attempts", {
        level: "warning"
      });
      console.warn(`Too many consecutive grid creation attempts (${gridCreationState.attemptsCount})`);
      return gridLayerRef.current;
    }
    
    // Clear existing grid if any
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create new grid
    const gridObjects = createGridElements(canvas);
    
    // Store in ref
    gridLayerRef.current = gridObjects;
    
    // Reset attempt count on success if we got objects
    if (gridObjects.length > 0) {
      gridCreationState.attemptsCount = 0;
    }
    
    // Return the grid objects
    return gridObjects;
  } catch (error) {
    // Log error
    logger.error("Error in createReliableGrid:", error);
    console.error("Error in createReliableGrid:", error);
    
    // Report to Sentry
    captureError(error, "reliable-grid-creation-error", {
      level: "error",
      tags: {
        component: "reliableGridCreation"
      },
      extra: {
        attemptsCount: gridCreationState.attemptsCount,
        canvasDimensions: canvas ? `${canvas.width}x${canvas.height}` : "unknown"
      }
    });
    
    // Return existing grid objects
    return gridLayerRef.current;
  }
};

/**
 * Ensure grid objects are visible on canvas
 * @param {FabricCanvas} canvas - The canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether any fixes were applied
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  try {
    if (!canvas || gridLayerRef.current.length === 0) {
      return false;
    }
    
    // Check how many grid objects are on canvas
    const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
    
    // If none are on canvas, recreate grid
    if (objectsOnCanvas === 0) {
      console.log("No grid objects on canvas, recreating");
      createReliableGrid(canvas, gridLayerRef);
      return true;
    }
    
    // If some are missing, add them
    if (objectsOnCanvas < gridLayerRef.current.length) {
      console.log(`Some grid objects missing (${objectsOnCanvas}/${gridLayerRef.current.length}), fixing`);
      
      gridLayerRef.current.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
      });
      
      canvas.requestRenderAll();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error ensuring grid visibility:", error);
    return false;
  }
};

/**
 * Test grid creation and log results
 * @param {FabricCanvas} canvas - The canvas to test on
 */
export const testGridCreation = (canvas: FabricCanvas): void => {
  try {
    console.log("Testing grid creation...");
    
    // Create a temporary grid
    const testGridObjects = createGridElements(canvas);
    
    // Log results
    console.log(`Test grid creation results: ${testGridObjects.length} objects created`);
    
    // Clean up test grid
    testGridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Report success
    captureError(
      new Error("Grid creation test results"),
      "grid-creation-test",
      {
        level: "info",
        extra: {
          objectsCreated: testGridObjects.length,
          canvasDimensions: `${canvas.width}x${canvas.height}`
        }
      }
    );
  } catch (error) {
    console.error("Error testing grid creation:", error);
    
    // Report failure
    captureError(error, "grid-creation-test-error", {
      level: "error",
      extra: {
        canvasDimensions: canvas ? `${canvas.width}x${canvas.height}` : "unknown"
      }
    });
  }
};
