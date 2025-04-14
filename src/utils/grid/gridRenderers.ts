
/**
 * Grid renderers module
 * Provides functions for creating grid visualizations on the canvas
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Create a basic grid with small and large squares
 * Emergency grid creation when other methods fail
 * @param canvas - Fabric canvas
 * @returns Array of created grid objects
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Small grid lines (10px spacing)
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Large grid lines (100px spacing)
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error('Failed to create emergency grid:', error);
    return [];
  }
}

/**
 * Create a complete grid with all necessary components
 * @param canvas - Fabric canvas
 * @returns Array of created grid objects
 */
export function createCompleteGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn('Cannot create complete grid: Invalid canvas dimensions');
    return [];
  }
  
  try {
    // Clear any existing grid objects
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (existingGrid.length > 0) {
      logger.info('[DEBUG] Cleared ' + existingGrid.length + ' grid objects', existingGrid);
      existingGrid.forEach(obj => {
        canvas.remove(obj);
      });
    }
    
    logger.info('Creating grid with dimensions: ' + canvas.width + 'x' + canvas.height);
    
    // Create basic grid (includes both small and large lines)
    return createBasicEmergencyGrid(canvas);
    
  } catch (error) {
    logger.error('Error creating complete grid:', error);
    return [];
  }
}
