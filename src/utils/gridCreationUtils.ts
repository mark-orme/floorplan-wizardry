
/**
 * Grid creation utilities
 * Functions for creating and managing grid
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject } from "fabric";

/**
 * Create a basic emergency grid
 * Simple grid for fallback when normal grid creation fails
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.log("Creating basic emergency grid");
    
    // Clear any existing grid objects from the ref
    gridLayerRef.current = [];
    
    // Get canvas dimensions
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    const gridObjects: FabricObject[] = [];
    
    // Create horizontal lines
    for (let y = 0; y < height; y += 50) {
      const line = new fabric.Line([0, y, width, y], {
        stroke: '#cccccc',
        strokeWidth: y % 100 === 0 ? 1 : 0.5,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x < width; x += 50) {
      const line = new fabric.Line([x, 0, x, height], {
        stroke: '#cccccc',
        strokeWidth: x % 100 === 0 ? 1 : 0.5,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Store the created objects in the ref
    gridLayerRef.current = gridObjects;
    
    // Make sure grid lines are behind other objects
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Retry with backoff
 * Retry a function with exponential backoff
 * 
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<any>} Promise resolving to function result
 */
export const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxAttempts: number = 3,
  baseDelay: number = 300
): Promise<any> => {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempts++;
      
      if (attempts >= maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(1.5, attempts - 1);
      console.log(`Retrying (${attempts}/${maxAttempts}) after ${delay}ms`);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error("Function failed after retries");
};
