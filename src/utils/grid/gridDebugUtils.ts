
/**
 * Grid debug utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from './gridRenderers';
import logger from '@/utils/logger';

/**
 * Dump grid state to console for debugging
 * @param canvas - Fabric canvas
 */
export function dumpGridState(canvas: FabricCanvas): void {
  if (!canvas) {
    logger.warn('Cannot dump grid state: Canvas is null');
    return;
  }
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );
    
    const gridState = {
      canvas: {
        width: canvas.width,
        height: canvas.height,
        totalObjects: canvas.getObjects().length
      },
      grid: {
        objectCount: gridObjects.length,
        visibleCount: gridObjects.filter(obj => obj.visible).length,
        topLevelCount: gridObjects.filter(obj => obj.visible && obj.opacity === 1).length
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info('Grid state:', gridState);
    console.log('Grid state dump:', gridState);
    
    // Additional detailed dump for grid objects
    if (gridObjects.length > 0) {
      const firstGridObj = gridObjects[0];
      logger.debug('Sample grid object:', {
        visible: firstGridObj.visible,
        selectable: firstGridObj.selectable,
        evented: firstGridObj.evented,
        position: {
          left: firstGridObj.left,
          top: firstGridObj.top
        }
      });
    }
  } catch (error) {
    logger.error('Error dumping grid state:', error);
  }
}

/**
 * Force create a grid, bypassing checks
 * @param canvas - Fabric canvas
 * @param skipChecks - Whether to skip validation checks
 * @returns Created grid objects
 */
export function forceCreateGrid(
  canvas: FabricCanvas,
  skipChecks: boolean = false
): FabricObject[] {
  if (!canvas) {
    logger.error('Cannot force create grid: Canvas is null');
    return [];
  }
  
  if (!skipChecks) {
    // Minimal check for canvas dimensions
    if (!canvas.width || !canvas.height) {
      logger.warn('Force creating grid on canvas with invalid dimensions');
    }
  }
  
  try {
    // Remove any existing grid
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );
    
    existingGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Create new grid
    const gridObjects = createGrid(canvas);
    
    logger.info(`Force created grid with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error('Error force creating grid:', error);
    return [];
  }
}
