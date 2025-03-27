
/**
 * Grid creation utility functions
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "./logger";

/**
 * Create a basic emergency grid when normal grid creation fails
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    // Clear existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    console.log(`Creating emergency grid with dimensions: ${width}x${height}`);
    
    // Create a simple grid with hardcoded settings
    const smallGridSpacing = 10;
    const largeGridSpacing = 100;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#d0d0d0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#d0d0d0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the gridLayerRef
    gridLayerRef.current = gridObjects;
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Verify if grid exists on canvas
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if grid objects exist and are on canvas
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if at least 50% of grid objects are on canvas
  const totalGridObjects = gridLayerRef.current.length;
  let objectsOnCanvas = 0;
  
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      objectsOnCanvas++;
    }
  });
  
  return objectsOnCanvas >= totalGridObjects * 0.5;
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} attempt - Current attempt number
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {number} Timeout ID
 */
export const retryWithBackoff = (
  fn: () => any,
  attempt: number,
  maxAttempts: number = 3
): number => {
  if (attempt >= maxAttempts) {
    console.warn(`Maximum retry attempts (${maxAttempts}) reached`);
    return 0;
  }
  
  const delay = Math.min(1000 * Math.pow(1.5, attempt), 5000);
  
  return window.setTimeout(() => {
    fn();
  }, delay);
};
