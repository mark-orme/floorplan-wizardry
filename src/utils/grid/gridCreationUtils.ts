
/**
 * Grid creation utilities
 * @module grid/gridCreationUtils
 */
import { Canvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

/**
 * Creates a simple grid on the canvas
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create emergency grid: Invalid canvas");
    return [];
  }
  
  try {
    const width = canvas.getWidth?.() || canvas.width;
    const height = canvas.getHeight?.() || canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Creates a complete grid with small and large grid lines
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create complete grid: Invalid canvas");
    return [];
  }
  
  try {
    const width = canvas.getWidth?.() || canvas.width;
    const height = canvas.getHeight?.() || canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines (light lines)
    for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines (darker lines)
    for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Creates an enhanced grid with additional features
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createEnhancedGrid = (
  canvas: Canvas
): FabricObject[] => {
  // For now, simply call createCompleteGrid
  // This can be enhanced later with additional features
  return createCompleteGrid(canvas);
};

/**
 * Validates if grid is properly created
 * @param {Canvas} canvas - The fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects) return false;
  
  const onCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return onCanvas.length === gridObjects.length && onCanvas.length > 0;
};

/**
 * Verifies if grid exists and is properly attached to canvas
 * @param {Canvas} canvas - The fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {boolean} Whether grid exists
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects || gridObjects.length === 0) return false;
  
  // Check if at least 50% of grid objects are on canvas
  const onCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return onCanvas.length >= gridObjects.length / 2;
};

/**
 * Reorders grid objects to ensure they're behind other objects
 * @param {Canvas} canvas - The fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) return;
  
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendToBack(obj);
    }
  });
  
  canvas.requestRenderAll();
};

/**
 * Ensures grid exists, creating it if necessary
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid exists and is valid
  if (validateGrid(canvas, gridLayerRef.current)) {
    return gridLayerRef.current;
  }
  
  // Create new grid
  const gridObjects = createCompleteGrid(canvas);
  
  // Update reference
  if (gridObjects.length > 0) {
    gridLayerRef.current = gridObjects;
  }
  
  return gridObjects;
};

/**
 * Retries a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>} Result of function
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = Math.pow(2, attempt) * 100; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Creates a small grid (only small grid lines)
 * @param {Canvas} canvas - The fabric canvas 
 * @returns {FabricObject[]} Grid objects
 */
export const createSmallGrid = (
  canvas: Canvas
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create small grid: Invalid canvas");
    return [];
  }
  
  try {
    const width = canvas.getWidth?.() || canvas.width;
    const height = canvas.getHeight?.() || canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines (light lines)
    for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error creating small grid:", error);
    return [];
  }
};
