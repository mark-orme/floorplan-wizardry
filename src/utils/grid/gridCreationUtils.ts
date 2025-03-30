
/**
 * Grid creation utilities
 * Provides functions for creating grid objects on the canvas
 * @module grid/gridCreationUtils
 */

import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import { GridDimensions } from "@/types/fabric";
import logger from "../logger";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Create a basic emergency grid as a fallback
 * Used when normal grid creation fails
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} [gridLayerRef] - Optional reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  logger.warn("Creating emergency grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create minimal grid with larger spacing (for performance)
    const emergencySpacing = 50;
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += emergencySpacing) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS?.LARGE_GRID_COLOR || "#cccccc",
        strokeWidth: GRID_CONSTANTS?.LARGE_GRID_WIDTH || 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += emergencySpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS?.LARGE_GRID_COLOR || "#cccccc",
        strokeWidth: GRID_CONSTANTS?.LARGE_GRID_WIDTH || 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the grid layer reference if provided
    if (gridLayerRef) {
      gridLayerRef.current = gridObjects;
    }
    
    // Request a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a fallback grid (intermediate complexity)
 * Used when complete grid creation fails but before emergency grid
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  logger.info("Creating fallback grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create intermediate grid with standard spacing
    const smallGridSpacing = GRID_CONSTANTS.SMALL_GRID;
    const largeGridSpacing = GRID_CONSTANTS.LARGE_GRID;
    
    // Create large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Request a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating fallback grid:", error);
    return [];
  }
};

/**
 * Create a specific grid layer for advanced rendering
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {string} layerType - Type of grid layer to create
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (
  canvas: FabricCanvas,
  layerType: 'small' | 'large' | 'markers'
): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  try {
    switch (layerType) {
      case 'small':
        // Create small grid lines
        for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID) {
          const line = new Line([x, 0, x, height], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        
        for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID) {
          const line = new Line([0, y, width, y], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        break;
        
      case 'large':
        // Create large grid lines
        for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID) {
          const line = new Line([x, 0, x, height], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        
        for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID) {
          const line = new Line([0, y, width, y], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        break;
        
      case 'markers':
        // Create grid markers (labels)
        for (let x = GRID_CONSTANTS.LARGE_GRID; x < width; x += GRID_CONSTANTS.LARGE_GRID) {
          const text = new Text(String(x), {
            left: x + 2,
            top: 2,
            fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
            fill: GRID_CONSTANTS.MARKER_COLOR,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(text);
          canvas.add(text);
        }
        
        for (let y = GRID_CONSTANTS.LARGE_GRID; y < height; y += GRID_CONSTANTS.LARGE_GRID) {
          const text = new Text(String(y), {
            left: 2,
            top: y + 2,
            fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
            fill: GRID_CONSTANTS.MARKER_COLOR,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(text);
          canvas.add(text);
        }
        break;
    }
    
    return gridObjects;
  } catch (error) {
    logger.error(`Error creating grid layer ${layerType}:`, error);
    return [];
  }
};

/**
 * Validate that grid exists and is properly attached to canvas
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check that at least 50% of grid objects are still on canvas
  let validObjects = 0;
  
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      validObjects++;
    }
  });
  
  return validObjects > gridLayerRef.current.length / 2;
};

/**
 * Verify if grid exists and is valid
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {boolean} Whether grid exists and is valid
 */
export const verifyGridExists = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return validateGrid(canvas, gridLayerRef);
};

/**
 * Retry grid creation with exponential backoff
 * 
 * @param {Function} creationFn - Function to create grid
 * @param {number} attempt - Current attempt number
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise<FabricObject[]>} Created grid objects
 */
export const retryWithBackoff = async (
  creationFn: () => FabricObject[],
  attempt: number = 1,
  maxAttempts: number = 3
): Promise<FabricObject[]> => {
  try {
    return creationFn();
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw error;
    }
    
    // Wait with exponential backoff
    const delay = Math.pow(2, attempt) * 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Try again
    return retryWithBackoff(creationFn, attempt + 1, maxAttempts);
  }
};

/**
 * Create a complete grid
 * Main entry point for grid creation
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  try {
    // Clear any existing grid objects from the canvas
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create each layer of the grid
    const smallGridObjects = createGridLayer(canvas, 'small');
    const largeGridObjects = createGridLayer(canvas, 'large');
    const markerObjects = createGridLayer(canvas, 'markers');
    
    // Combine all grid objects
    const allGridObjects = [
      ...smallGridObjects,
      ...largeGridObjects,
      ...markerObjects
    ];
    
    // Update the reference
    gridLayerRef.current = allGridObjects;
    
    // Force a render
    canvas.requestRenderAll();
    
    logger.info(`Complete grid created with ${allGridObjects.length} objects`);
    
    return allGridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    
    // Try fallback grid on error
    try {
      return createFallbackGrid(canvas, gridLayerRef);
    } catch (fallbackError) {
      logger.error("Fallback grid failed:", fallbackError);
      
      // Last resort: emergency grid
      return createBasicEmergencyGrid(canvas, gridLayerRef);
    }
  }
};

/**
 * Ensure grid exists, creating it if necessary
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return gridLayerRef.current;
  }
  
  return createCompleteGrid(canvas, gridLayerRef);
};

/**
 * Reorder grid objects for proper rendering
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendObjectToBack(obj);
    }
  });
};
