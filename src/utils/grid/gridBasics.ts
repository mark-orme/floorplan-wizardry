
/**
 * Grid basics module
 * Core grid utility functions
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

/**
 * Clear all grid objects from canvas
 * @param canvas - Fabric canvas
 */
export function clearGrid(canvas: FabricCanvas): void {
  if (!canvas) {
    logger.warn('Cannot clear grid: Canvas is null');
    return;
  }

  // Find all grid objects
  const gridObjects = canvas.getObjects().filter(obj => (obj as FabricObject & { objectType?: string }).objectType === 'grid');
  
  // Remove each grid object
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Render canvas to update display
  canvas.renderAll();
  logger.debug(`Cleared ${gridObjects.length} grid objects`);
}

/**
 * Check if canvas is valid for grid creation
 * @param canvas - Fabric canvas
 * @returns Whether canvas is valid
 */
export function isCanvasValidForGrid(canvas: FabricCanvas): boolean {
  if (!canvas) {
    logger.warn('Canvas is null or undefined');
    return false;
  }

  // Check if canvas has width and height
  const width = canvas.getWidth?.() ?? canvas.width;
  const height = canvas.getHeight?.() ?? canvas.height;

  const minWidth = 100;
  const minHeight = 100;

  if (!width || !height || width < minWidth || height < minHeight) {
    logger.warn(`Canvas has invalid dimensions: ${width}x${height}`);
    return false;
  }

  // Check if canvas has required methods
  if (
    typeof canvas.add !== 'function' ||
    typeof canvas.remove !== 'function' ||
    typeof canvas.renderAll !== 'function'
  ) {
    logger.warn('Canvas is missing required methods');
    return false;
  }

  return true;
}

/**
 * Create a simple grid with basic options
 * @param canvas - Fabric canvas
 * @returns Array of created grid objects
 */
export function createSimpleGrid(canvas: FabricCanvas): FabricObject[] {
  // This is a placeholder that redirects to the main createGrid function
  // It exists for backward compatibility
  logger.info('createSimpleGrid is deprecated, using createGrid instead');
  
  // Import dynamically to avoid circular dependencies
  const { createGrid } = require('./gridRenderers');
  return createGrid(canvas);
}

/**
 * Reorder grid objects to ensure they appear behind other objects
 * @param canvas - Fabric canvas
 * @param gridObjects - Grid objects to reorder
 */
export function reorderGridObjects(
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void {
  if (!canvas) {
    logger.warn('Cannot reorder grid objects: Canvas is null');
    return;
  }

  // Send each grid object to the back
  gridObjects.forEach(obj => {
    canvas.sendObjectToBack(obj);
  });
  
  canvas.renderAll();
}
