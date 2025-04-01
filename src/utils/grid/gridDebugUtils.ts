
/**
 * Grid debugging utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from './gridRenderers';
import logger from '@/utils/logger';

/**
 * Dumps the current grid state to the console for debugging
 * @param canvas - Fabric canvas
 * @returns Object containing grid state information
 */
export function dumpGridState(canvas: FabricCanvas): Record<string, any> {
  if (!canvas) {
    logger.warn('Cannot dump grid state: Canvas is null');
    return { error: 'Canvas is null' };
  }

  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => (obj as any).objectType === 'grid');
  
  const state = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    totalObjects: allObjects.length,
    gridObjectCount: gridObjects.length,
    gridTypes: {} as Record<string, number>
  };
  
  // Count different grid types
  gridObjects.forEach(obj => {
    const type = (obj as any).gridType || 'unknown';
    state.gridTypes[type] = (state.gridTypes[type] || 0) + 1;
  });
  
  logger.debug('Grid state:', state);
  return state;
}

/**
 * Force creates a grid regardless of existing grid state
 * This is mostly used for debugging and testing
 * @param canvas - Fabric canvas
 * @returns Array of created grid objects
 */
export function forceCreateGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    logger.warn('Cannot force create grid: Canvas is null');
    return [];
  }
  
  logger.info('Force creating grid');
  
  // Remove all existing grid objects
  const existingGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
  existingGridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Create new grid
  const gridObjects = createGrid(canvas);
  logger.info(`Created ${gridObjects.length} grid objects`);
  
  return gridObjects;
}
