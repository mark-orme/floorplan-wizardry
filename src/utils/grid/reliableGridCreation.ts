
/**
 * Reliable grid creation utility
 * Provides robust grid creation with retries and error handling
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
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
 * Create grid elements
 * @param {FabricCanvas} canvas - The canvas to create grid on
 * @returns {FabricObject[]} The created grid objects
 */
export const createGridElements = (canvas: FabricCanvas): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Cannot create grid: Invalid canvas dimensions", {
      width: canvas?.width,
      height: canvas?.height
    });
    return [];
  }
  
  const width = canvas.width;
  const height = canvas.height;
  
  console.log(`Creating grid for canvas: ${width}x${height}`);
  
  // Create small grid lines
  const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
  const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
  
  // Create vertical lines
  for (let i = 0; i <= width; i += smallGridSize) {
    const isLargeLine = i % largeGridSize === 0;
    const line = new Line([i, 0, i, height], {
      stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      type: isLargeLine ? 'grid-large' : 'grid-small'
    });
    
    gridObjects.push(line);
    canvas.add(line);
    
    // Add labels for large grid lines
    if (isLargeLine && i > 0) {
      const text = new Text(`${Math.round(i / GRID_CONSTANTS.PIXELS_PER_METER)}m`, {
        left: i + 5,
        top: 5,
        fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        type: 'grid-text'
      });
      
      gridObjects.push(text);
      canvas.add(text);
    }
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += smallGridSize) {
    const isLargeLine = i % largeGridSize === 0;
    const line = new Line([0, i, width, i], {
      stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      type: isLargeLine ? 'grid-large' : 'grid-small'
    });
    
    gridObjects.push(line);
    canvas.add(line);
    
    // Add labels for large grid lines
    if (isLargeLine && i > 0) {
      const text = new Text(`${Math.round(i / GRID_CONSTANTS.PIXELS_PER_METER)}m`, {
        left: 5,
        top: i + 5,
        fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        type: 'grid-text'
      });
      
      gridObjects.push(text);
      canvas.add(text);
    }
  }
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  return gridObjects;
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
