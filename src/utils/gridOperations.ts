/**
 * Grid operations utility functions
 * @module gridOperations
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { CanvasDimensions, GridCreationState } from '@/types/drawingTypes';
import { 
  scheduleGridProgressReset,
  acquireGridCreationLock,
  releaseGridCreationLock
} from './gridManager';
import { logger } from './logger';

// Constants for grid operation performance
const GRID_CREATION_THROTTLE = 1000; // Min time between grid creations in ms

/**
 * Check if grid recreation should be throttled
 * @param {GridCreationState} gridState - Current grid state
 * @returns {boolean} Whether creation should be throttled
 */
export const shouldThrottleGridCreation = (gridState: GridCreationState): boolean => {
  const now = Date.now();
  
  // Check if recently created
  if (gridState.exists && 
      now - gridState.lastCreationTime < gridState.throttleInterval) {
    return true;
  }
  
  // Check total recreations limit
  if (gridState.totalCreations >= gridState.maxRecreations &&
      now - gridState.lastCreationTime < gridState.minRecreationInterval) {
    return true;
  }
  
  return false;
};

/**
 * Calculate hash for canvas dimensions to detect changes
 * @param {CanvasDimensions} dimensions - Canvas dimensions
 * @returns {string} Hash string for the dimensions
 */
export const calculateDimensionsHash = (dimensions: CanvasDimensions): string => {
  return `${dimensions.width}x${dimensions.height}`;
};

/**
 * Check if dimensions have changed significantly
 * @param {CanvasDimensions | null} prevDimensions - Previous dimensions
 * @param {CanvasDimensions} currDimensions - Current dimensions
 * @param {number} threshold - Change threshold in pixels
 * @returns {boolean} Whether dimensions changed significantly
 */
export const hasDimensionsChangedSignificantly = (
  prevDimensions: CanvasDimensions | null,
  currDimensions: CanvasDimensions,
  threshold: number = 20
): boolean => {
  if (!prevDimensions) return true;
  
  const widthDiff = Math.abs(prevDimensions.width - currDimensions.width);
  const heightDiff = Math.abs(prevDimensions.height - currDimensions.height);
  
  return widthDiff > threshold || heightDiff > threshold;
};

/**
 * Clear all grid objects from the canvas
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {string} objectTypePrefix - Grid object type prefix
 * @returns {number} Number of removed objects
 */
export const clearGridObjects = (
  canvas: Canvas,
  objectTypePrefix: string = 'grid'
): number => {
  if (!canvas) {
    logger.warn('Cannot clear grid: canvas is null');
    return 0;
  }
  
  // Get all grid objects
  const gridObjects = canvas.getObjects().filter((obj) => {
    const fabricObj = obj as FabricObject;
    return fabricObj.objectType && fabricObj.objectType.startsWith(objectTypePrefix);
  });
  
  // Remove each grid object
  let count = 0;
  gridObjects.forEach(obj => {
    canvas.remove(obj);
    count++;
  });
  
  if (count > 0) {
    canvas.requestRenderAll();
    logger.info(`Removed ${count} grid objects`);
  }
  
  return count;
};

/**
 * Send grid objects to the back of the canvas
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to send to back
 * @returns {boolean} Whether operation was successful
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects.length) return false;
  
  try {
    // First, send all grid objects to the back
    gridObjects.forEach(obj => {
      if (typeof canvas.sendObjectToBack === 'function') {
        canvas.sendObjectToBack(obj);
      }
    });
    
    // Ensure proper stacking order
    const smallGridObjects = gridObjects.filter(obj => 
      obj.objectType && obj.objectType === 'grid-small'
    );
    
    const largeGridObjects = gridObjects.filter(obj => 
      obj.objectType && obj.objectType === 'grid-large'
    );
    
    const markerObjects = gridObjects.filter(obj => 
      obj.objectType && obj.objectType === 'grid-marker'
    );
    
    // Stack in proper order: small grid at back, then large grid, then markers
    smallGridObjects.forEach(obj => canvas.sendObjectToBack(obj));
    
    largeGridObjects.forEach(obj => {
      // Move up from the bottom but still below non-grid objects
      if (smallGridObjects.length) {
        canvas.bringObjectForward(obj);
      }
    });
    
    markerObjects.forEach(obj => {
      // Move up from the bottom but still below non-grid objects
      if (smallGridObjects.length || largeGridObjects.length) {
        canvas.bringObjectForward(obj);
      }
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error arranging grid objects', error);
    return false;
  }
};
