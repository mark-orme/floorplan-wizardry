
/**
 * Grid tester utilities
 * For testing grid functions and performance
 * @module utils/grid/gridTester
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Test grid performance
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {Function} gridFunction - The grid creation function to test
 * @returns {Object} Performance results
 */
export const testGridPerformance = (
  canvas: FabricCanvas,
  gridFunction: (canvas: FabricCanvas) => any[]
) => {
  if (!canvas) {
    return {
      success: false,
      error: "Canvas is null",
      time: 0
    };
  }
  
  try {
    // Start timer
    const startTime = performance.now();
    
    // Run the grid function
    const gridObjects = gridFunction(canvas);
    
    // End timer
    const endTime = performance.now();
    
    return {
      success: true,
      objectCount: gridObjects.length,
      time: endTime - startTime
    };
  } catch (error) {
    logger.error("Error testing grid performance:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      time: 0
    };
  }
};

/**
 * Test grid sizing accuracy
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {number} targetSize - The target grid size
 * @returns {Object} Test results
 */
export const testGridSizingAccuracy = (
  canvas: FabricCanvas,
  targetSize: number = 20
) => {
  try {
    if (!canvas) {
      return {
        success: false,
        error: "Canvas is null"
      };
    }
    
    // Get all grid lines
    const gridObjects = canvas.getObjects().filter(obj => 
      obj.objectType === 'grid'
    );
    
    if (gridObjects.length === 0) {
      return {
        success: false,
        error: "No grid objects found"
      };
    }
    
    // Check horizontal grid line spacing
    const horizontalLines = gridObjects.filter(obj => 
      obj.type === 'line' && 
      obj.x1 === obj.x2
    );
    
    // Calculate distances between adjacent lines
    let previousY = 0;
    const horizontalDistances: number[] = [];
    
    horizontalLines.sort((a, b) => a.y1 - b.y1).forEach(line => {
      if (previousY > 0) {
        horizontalDistances.push(line.y1 - previousY);
      }
      previousY = line.y1;
    });
    
    // Calculate average distance
    const averageHorizontalDistance = horizontalDistances.reduce((sum, dist) => sum + dist, 0) / 
                                     horizontalDistances.length;
    
    // Calculate deviation from target size
    const deviation = Math.abs(averageHorizontalDistance - targetSize) / targetSize;
    
    return {
      success: true,
      averageSize: averageHorizontalDistance,
      deviation: deviation,
      accuracy: 1 - deviation
    };
  } catch (error) {
    logger.error("Error testing grid sizing accuracy:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
