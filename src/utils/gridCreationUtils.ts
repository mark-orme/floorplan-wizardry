
/**
 * Grid creation utility functions
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "./logger";
import { toast } from "sonner";

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
    // Log canvas dimensions for debugging
    const width = canvas.getWidth?.() || canvas.width;
    const height = canvas.getHeight?.() || canvas.height;
    
    console.log(`Creating emergency grid with dimensions: ${width}x${height}`);
    
    // Validate dimensions
    if (!width || !height || width <= 0 || height <= 0) {
      console.error("Cannot create emergency grid: Invalid canvas dimensions");
      
      // Set fallback dimensions
      const fallbackWidth = 800;
      const fallbackHeight = 600;
      
      console.log(`Using fallback dimensions: ${fallbackWidth}x${fallbackHeight}`);
      
      try {
        canvas.setWidth(fallbackWidth);
        canvas.setHeight(fallbackHeight);
        console.log("Set canvas to fallback dimensions");
      } catch (error) {
        console.error("Failed to set canvas dimensions:", error);
        toast.error("Failed to set canvas dimensions");
        return [];
      }
    }
    
    // Clear existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Get updated dimensions after possible changes
    const finalWidth = canvas.getWidth?.() || canvas.width || 800;
    const finalHeight = canvas.getHeight?.() || canvas.height || 600;
    
    // Create a simple grid with hardcoded settings
    const smallGridSpacing = 10;
    const largeGridSpacing = 100;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let x = 0; x <= finalWidth; x += smallGridSpacing) {
      const line = new Line([x, 0, x, finalHeight], {
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
    
    for (let y = 0; y <= finalHeight; y += smallGridSpacing) {
      const line = new Line([0, y, finalWidth, y], {
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
    for (let x = 0; x <= finalWidth; x += largeGridSpacing) {
      const line = new Line([x, 0, x, finalHeight], {
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
    
    for (let y = 0; y <= finalHeight; y += largeGridSpacing) {
      const line = new Line([0, y, finalWidth, y], {
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
    
    // Ensure grid lines are sent to back
    gridObjects.forEach(obj => {
      // Use type casting to avoid TypeScript error
      (canvas as any).sendToBack(obj);
    });
    
    // Update the gridLayerRef
    gridLayerRef.current = gridObjects;
    
    // Force a render
    canvas.requestRenderAll();
    
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    console.error("Error creating emergency grid:", error);
    toast.error("Failed to create emergency grid");
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
    try {
      fn();
    } catch (error) {
      console.error("Error in retry function:", error);
    }
  }, delay);
};
