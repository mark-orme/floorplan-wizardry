import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Updates grid appearance based on current zoom level
 * @param canvas The fabric canvas instance
 */
export const updateGridWithZoom = (canvas: FabricCanvas): void => {
  if (!canvas) return;

  try {
    const zoom = canvas.getZoom() || 1;
    
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      return; // No grid to update
    }
    
    // Adjust grid appearance based on zoom
    gridObjects.forEach(obj => {
      // For small grid lines
      if ((obj as any).isSmallGrid) {
        // Hide small grid lines when zoomed out too far
        if (zoom < 0.4) {
          obj.set('visible', false);
        } else {
          obj.set('visible', true);
          // Adjust stroke width inversely to zoom
          obj.set('strokeWidth', GRID_CONSTANTS.SMALL_GRID_WIDTH / Math.max(0.5, Math.min(2, zoom)));
        }
      } 
      // For large grid lines
      else if ((obj as any).isLargeGrid) {
        obj.set('visible', true);
        // Adjust stroke width inversely to zoom
        obj.set('strokeWidth', GRID_CONSTANTS.LARGE_GRID_WIDTH / Math.max(0.5, Math.min(2, zoom)));
      }
    });
    
    // Request render to update the grid
    canvas.requestRenderAll();
    
  } catch (error) {
    logger.error('Error updating grid with zoom:', error);
  }
};

/**
 * Ensures grid is visible and properly created on the canvas
 * @param canvas The fabric canvas instance
 * @returns An object with the result of the operation
 */
export const forceGridCreationAndVisibility = (canvas: FabricCanvas): {
  success: boolean;
  gridObjects: FabricObject[];
  action: 'created' | 'fixed' | 'none';
} => {
  if (!canvas) return { success: false, gridObjects: [], action: 'none' };
  
  try {
    // Check if grid exists
    const existingGridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If grid already exists, ensure visibility
    if (existingGridObjects.length > 0) {
      existingGridObjects.forEach(obj => {
        obj.set('visible', true);
        canvas.sendToBack(obj);
      });
      
      canvas.requestRenderAll();
      return { 
        success: true, 
        gridObjects: existingGridObjects,
        action: 'fixed'
      };
    }
    
    // Otherwise create grid from scratch
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isSmallGrid: true
      } as any);
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isSmallGrid: true
      } as any);
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: true
      } as any);
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: true
      } as any);
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Put grid at the back
    gridObjects.forEach(obj => canvas.sendToBack(obj));
    
    // Apply zoom adjustment
    updateGridWithZoom(canvas);
    
    canvas.requestRenderAll();
    return { 
      success: true, 
      gridObjects,
      action: 'created'
    };
    
  } catch (error) {
    logger.error('Error creating grid:', error);
    return { 
      success: false, 
      gridObjects: [],
      action: 'none'
    };
  }
};

/**
 * Sets up monitoring to ensure grid stays visible
 * @param canvas The fabric canvas instance
 * @param interval Check interval in milliseconds
 * @returns Cleanup function to stop monitoring
 */
export const setupGridMonitoring = (canvas: FabricCanvas, interval = 5000): (() => void) => {
  const intervalId = setInterval(() => {
    if (!canvas) return;
    
    const gridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If grid is missing or count is too low, recreate it
    if (gridObjects.length < GRID_CONSTANTS.MIN_GRID_OBJECTS && GRID_CONSTANTS.AUTO_RECREATE_ON_EMPTY) {
      logger.info('Grid missing or incomplete, recreating...');
      forceGridCreationAndVisibility(canvas);
    }
    
    // Update grid with current zoom
    updateGridWithZoom(canvas);
    
  }, interval);
  
  return () => clearInterval(intervalId);
};

/**
 * Ensures grid is present on the canvas
 * @param canvas The fabric canvas instance
 * @returns Result of the grid check/creation operation
 */
export const ensureGridIsPresent = (canvas: FabricCanvas): {
  success: boolean;
  gridObjects: FabricObject[];
  action: 'created' | 'fixed' | 'none';
} => {
  if (!canvas) return { success: false, gridObjects: [], action: 'none' };
  
  // Check if grid exists
  const existingGridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  // If we have enough grid objects and they're all visible, we're good
  if (existingGridObjects.length >= GRID_CONSTANTS.MIN_GRID_OBJECTS) {
    const allVisible = existingGridObjects.every(obj => obj.visible);
    
    if (allVisible) {
      return { 
        success: true, 
        gridObjects: existingGridObjects,
        action: 'none'
      };
    }
    
    // Fix visibility
    existingGridObjects.forEach(obj => {
      obj.set('visible', true);
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
    return { 
      success: true, 
      gridObjects: existingGridObjects,
      action: 'fixed'
    };
  }
  
  // Need to create the grid
  return forceGridCreationAndVisibility(canvas);
};

export const ensureGridVisibility = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  gridObjects.forEach(obj => {
    obj.set('visible', true);
  });
  
  canvas.requestRenderAll();
};

export const setGridVisibility = (canvas: FabricCanvas, isVisible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  gridObjects.forEach(obj => {
    obj.set('visible', isVisible);
  });
  
  canvas.requestRenderAll();
};
