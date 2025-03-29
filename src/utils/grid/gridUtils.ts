
/**
 * Grid Utilities
 * Helper functions for grid operations
 * @module grid/gridUtils
 */

import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { ExtendedFabricObject } from "@/types/fabricTypes";

/**
 * Validate canvas for grid creation
 * 
 * @param {FabricCanvas} canvas - Canvas to validate
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvasForGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    console.error("Invalid canvas: null or undefined");
    return false;
  }
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    console.error(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}`);
    return false;
  }
  
  return true;
};

/**
 * Get snap point based on grid
 * 
 * @param {number} value - Original coordinate value
 * @param {number} gridSize - Grid size to snap to
 * @returns {number} Snapped value
 */
export const snapToGrid = (value: number, gridSize: number = GRID_CONSTANTS.SMALL_GRID_SIZE): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Find nearest grid intersection
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} gridSize - Grid size for snapping
 * @returns {[number, number]} Snapped coordinates
 */
export const snapPointToGrid = (
  x: number, 
  y: number, 
  gridSize: number = GRID_CONSTANTS.SMALL_GRID_SIZE
): [number, number] => {
  return [snapToGrid(x, gridSize), snapToGrid(y, gridSize)];
};

/**
 * Count grid objects of a specific type
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {string} gridType - Grid type to count ('small' or 'large')
 * @returns {number} Count of objects
 */
export const countGridObjects = (
  canvas: FabricCanvas,
  gridType?: 'small' | 'large'
): number => {
  if (!canvas) return 0;
  
  const allObjects = canvas.getObjects();
  
  if (gridType) {
    return allObjects.filter(obj => {
      const extObj = obj as ExtendedFabricObject;
      return extObj.objectType === 'grid' && extObj.gridType === gridType;
    }).length;
  }
  
  return allObjects.filter(obj => (obj as ExtendedFabricObject).objectType === 'grid').length;
};

/**
 * Get grid size based on zoom level
 * Adjusts grid size for better visibility at different zoom levels
 * 
 * @param {number} zoomLevel - Current zoom level
 * @returns {{ small: number, large: number }} Adjusted grid sizes
 */
export const getGridSizeForZoom = (zoomLevel: number) => {
  if (zoomLevel <= 0.5) {
    // At low zoom, use larger grid spacing
    return {
      small: GRID_CONSTANTS.LARGE_GRID_SIZE,
      large: GRID_CONSTANTS.LARGE_GRID_SIZE * 5
    };
  } else if (zoomLevel >= 2) {
    // At high zoom, use smaller grid spacing
    return {
      small: GRID_CONSTANTS.SMALL_GRID_SIZE / 2,
      large: GRID_CONSTANTS.SMALL_GRID_SIZE * 2
    };
  }
  
  // Default grid spacing
  return {
    small: GRID_CONSTANTS.SMALL_GRID_SIZE,
    large: GRID_CONSTANTS.LARGE_GRID_SIZE
  };
};

/**
 * Check if object is part of grid
 * 
 * @param {FabricObject} obj - Object to check
 * @returns {boolean} Whether object is part of grid
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return (obj as ExtendedFabricObject).objectType === 'grid';
};

/**
 * Send grid objects to back
 * 
 * @param {FabricCanvas} canvas - Canvas with grid objects
 * @param {FabricObject[]} gridObjects - Grid objects to send to back
 */
export const arrangeGridElements = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) return;
  
  // Process small lines first, then large lines for proper layering
  const smallGridObjects = gridObjects.filter(obj => {
    const extObj = obj as ExtendedFabricObject;
    return extObj.gridType === 'small';
  });
  
  const largeGridObjects = gridObjects.filter(obj => {
    const extObj = obj as ExtendedFabricObject;
    return extObj.gridType === 'large';
  });
  
  // Send all grid objects to back in proper order
  [...largeGridObjects, ...smallGridObjects].forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendObjectToBack(obj);
    }
  });
  
  // Force render
  canvas.requestRenderAll();
};
