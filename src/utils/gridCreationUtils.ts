
/**
 * Simple grid creation utilities for direct grid creation
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "./logger";

/**
 * Create a very basic emergency grid without complex dependencies
 * This is a last resort when all other grid creation methods fail
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.log("Creating basic emergency grid as last resort");
    
    if (!canvas) {
      console.error("Cannot create emergency grid: canvas is null");
      return [];
    }
    
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Create horizontal lines every 100px
    for (let i = 0; i <= height; i += 100) {
      const line = new Line([0, i, width, i], {
        stroke: "#666666",
        opacity: 0.5,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
      
      // Add label for y-position
      if (i > 0) {
        const text = new Text(`${i}px`, {
          left: 5,
          top: i - 15,
          fontSize: 10,
          fill: "#666666"
        });
        canvas.add(text);
        gridObjects.push(text);
      }
    }
    
    // Create vertical lines every 100px
    for (let i = 0; i <= width; i += 100) {
      const line = new Line([i, 0, i, height], {
        stroke: "#666666",
        opacity: 0.5,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
      
      // Add label for x-position
      if (i > 0) {
        const text = new Text(`${i}px`, {
          left: i,
          top: 5,
          fontSize: 10,
          fill: "#666666"
        });
        canvas.add(text);
        gridObjects.push(text);
      }
    }
    
    // Add a debugging marker in the center
    const marker = new Text("EMERGENCY GRID", {
      left: width / 2 - 50,
      top: height / 2,
      fontSize: 14,
      fill: "red",
      fontWeight: "bold"
    });
    canvas.add(marker);
    gridObjects.push(marker);
    
    console.log(`Created basic emergency grid with ${gridObjects.length} objects`);
    
    // Force render to ensure grid is visible
    canvas.requestRenderAll();
    
    // Update gridLayerRef if provided
    if (gridLayerRef) {
      gridLayerRef.current = gridObjects;
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Failed to create basic emergency grid:", error);
    return [];
  }
};

/**
 * Check if the fabric canvas is in a usable state
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance to check
 * @returns {boolean} Whether the canvas is usable
 */
export const isCanvasUsable = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Check that canvas has basic properties
    if (!canvas.width || !canvas.height) return false;
    
    // Check that canvas element exists
    const element = canvas.getElement();
    if (!element || !(element instanceof HTMLCanvasElement)) return false;
    
    // Try to call a method to see if the canvas is functional
    canvas.getZoom();
    return true;
  } catch (error) {
    logger.error("Canvas failed usability check:", error);
    return false;
  }
};

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} fn - The function to retry
 * @param {number} attempt - Current attempt number (starting at 0)
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} baseDelay - Base delay in ms (will be multiplied by backoff factor)
 * @param {number} backoffFactor - Factor to increase delay by for each attempt
 * @returns {number} Timeout ID for potential cancellation
 */
export const retryWithBackoff = (
  fn: () => boolean | void,
  attempt: number = 0,
  maxAttempts: number = 3,
  baseDelay: number = 200,
  backoffFactor: number = 1.5
): number => {
  // Calculate delay with exponential backoff
  const delay = Math.min(
    baseDelay * Math.pow(backoffFactor, attempt),
    5000 // Maximum 5 second delay
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling retry attempt #${attempt + 1} in ${delay}ms`);
  }
  
  // Return the timeout ID
  return window.setTimeout(() => {
    if (attempt >= maxAttempts) {
      console.warn(`Maximum retry attempts (${maxAttempts}) reached`);
      return;
    }
    
    try {
      fn();
    } catch (error) {
      console.error(`Error during retry attempt #${attempt + 1}:`, error);
    }
  }, delay);
};
