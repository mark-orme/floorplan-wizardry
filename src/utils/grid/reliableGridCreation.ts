
/**
 * Reliable grid creation utilities
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from './gridRenderers';
import { retryWithBackoff } from './gridRetryUtils';
import logger from '@/utils/logger';

/**
 * Create a grid with retry mechanism for reliability
 * @param canvas - Fabric canvas
 * @param maxRetries - Maximum number of retries
 * @returns Promise that resolves with created grid objects
 */
export async function createReliableGrid(
  canvas: FabricCanvas,
  maxRetries: number = 3
): Promise<FabricObject[]> {
  return retryWithBackoff(
    async () => {
      if (!canvas) {
        throw new Error('Canvas is null or undefined');
      }
      
      const gridObjects = createGrid(canvas);
      
      if (gridObjects.length === 0) {
        throw new Error('Failed to create grid objects');
      }
      
      return gridObjects;
    },
    maxRetries
  );
}

/**
 * Ensure grid is visible on canvas
 * @param canvas - Fabric canvas
 * @param gridObjects - Grid objects to ensure visibility
 * @param visible - Whether grid should be visible
 * @returns Whether operation was successful
 */
export function ensureGridVisibility(
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  visible: boolean = true
): boolean {
  if (!canvas) {
    logger.warn('Cannot ensure grid visibility: Canvas is null');
    return false;
  }
  
  if (gridObjects.length === 0) {
    logger.warn('Cannot ensure grid visibility: No grid objects');
    return false;
  }
  
  try {
    // Update visibility of all grid objects
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    // Render canvas to update display
    canvas.renderAll();
    
    logger.debug(`Set grid visibility to ${visible ? 'visible' : 'hidden'}`);
    return true;
  } catch (error) {
    logger.error('Error ensuring grid visibility:', error);
    return false;
  }
}
