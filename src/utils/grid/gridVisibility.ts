/**
 * Grid visibility management utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { canvasGrid, createGrid } from '@/utils/canvasGrid';
import logger from '@/utils/logger';

/**
 * Ensure grid is visible on canvas
 * @param canvas - Fabric canvas
 * @returns Whether any changes were made
 */
export const ensureGridVisibility = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Check for grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If no grid objects, create them
    if (gridObjects.length === 0) {
      canvasGrid.createGrid(canvas);
      return true;
    }
    
    // Check for invisible grid objects
    const invisibleGridObjects = gridObjects.filter(obj => !obj.visible);
    if (invisibleGridObjects.length > 0) {
      invisibleGridObjects.forEach(obj => {
        obj.set('visible', true);
      });
      canvas.requestRenderAll();
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Error ensuring grid visibility:', error);
    return false;
  }
};

/**
 * Set grid visibility
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 */
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
    logger.info(`Grid visibility set to ${visible} for ${gridObjects.length} objects`);
  } catch (error) {
    logger.error('Error setting grid visibility:', error);
  }
};

/**
 * Force grid creation and visibility
 * @param canvas - Fabric canvas
 * @returns Whether operation was successful
 */
export const forceGridCreationAndVisibility = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Remove existing grid objects
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    existingGridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Create new grid
    const gridObjects = canvasGrid.createGrid(canvas);
    
    // Ensure grid is visible
    gridObjects.forEach(obj => {
      obj.set('visible', true);
    });
    
    canvas.requestRenderAll();
    logger.info(`Grid recreated: ${gridObjects.length} objects`);
    
    return gridObjects.length > 0;
  } catch (error) {
    logger.error('Error forcing grid creation and visibility:', error);
    return false;
  }
};

/**
 * Update grid when canvas zoom changes
 * @param canvas - Fabric canvas
 * @returns Whether grid was updated
 */
export const updateGridWithZoom = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Get existing grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If no grid objects, nothing to update
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Adjust grid objects based on zoom if needed
    const zoom = canvas.getZoom();
    gridObjects.forEach(obj => {
      // Adjust stroke width based on zoom
      const isLargeGrid = (obj as any).isLargeGrid;
      const baseWidth = isLargeGrid ? 
        GRID_CONSTANTS.LARGE_GRID_WIDTH : 
        GRID_CONSTANTS.SMALL_GRID_WIDTH;
      
      // Inverse relationship with zoom to maintain visual consistency
      obj.set('strokeWidth', baseWidth / Math.max(0.5, zoom));
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error updating grid with zoom:', error);
    return false;
  }
};
