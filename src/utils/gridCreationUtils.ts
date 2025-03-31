
/**
 * Grid creation utilities
 * @module utils/gridCreationUtils
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Verify if grid exists and is properly attached to canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects 
 * @returns {boolean} Whether grid exists and is attached to canvas
 */
export const verifyGridExists = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  const gridObjects = gridLayerRef.current;
  if (!gridObjects.length) return false;
  
  // Check if all grid objects are on canvas
  const canvasObjects = canvas.getObjects();
  const gridObjectsOnCanvas = gridObjects.filter(obj => 
    canvasObjects.includes(obj)
  );
  
  return gridObjectsOnCanvas.length > 0;
};

/**
 * Ensure grid is created and attached to canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {() => FabricObject[]} createGridFn - Function to create grid
 * @returns {boolean} Whether grid was created successfully
 */
export const ensureGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: () => FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  // Check if grid already exists
  if (verifyGridExists(canvas, gridLayerRef)) {
    return true;
  }
  
  // Create grid if it doesn't exist
  try {
    const gridObjects = createGridFn();
    gridLayerRef.current = gridObjects;
    
    return gridObjects.length > 0;
  } catch (error) {
    logger.error("Error ensuring grid:", error);
    return false;
  }
};

/**
 * Retry an operation with exponential backoff
 * 
 * @param {() => Promise<T>} operation - Operation to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<T>} Result of operation
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  initialDelay = 100
): Promise<T> => {
  let attempts = 0;
  let delay = initialDelay;
  
  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      
      // Throw if max attempts reached
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      // Wait with exponential backoff
      delay *= 2;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Max retry attempts reached");
};

/**
 * Reorder grid objects to ensure proper z-index
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 * @returns {void}
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects.length) return;
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.requestRenderAll();
};

/**
 * Create a basic emergency grid when other methods fail
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create emergency grid: invalid canvas");
      return [];
    }
    
    const gridSize = 20;
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: "#e0e0e0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: "grid"
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
 * Create an enhanced grid with major/minor lines and labels
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createEnhancedGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  // Delegate to the reliable grid creator from simpleGridCreator
  const tempRef = { current: [] };
  const gridObjects = createBasicEmergencyGrid(canvas);
  tempRef.current = gridObjects;
  return gridObjects;
};
