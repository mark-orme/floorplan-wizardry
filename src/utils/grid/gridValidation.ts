
/**
 * Grid validation utilities
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

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
 * Check if grid state is valid
 * @param grid - Grid state or objects
 * @returns Whether grid is valid
 */
export function isGridValid(grid: FabricObject[] | null | undefined): boolean {
  if (!grid) {
    logger.warn('Grid is null or undefined');
    return false;
  }

  if (!Array.isArray(grid)) {
    logger.warn('Grid is not an array');
    return false;
  }

  if (grid.length === 0) {
    logger.warn('Grid is empty');
    return false;
  }

  // Check if all objects have expected properties
  const invalidObjects = grid.filter(obj => 
    !obj || 
    typeof obj !== 'object' || 
    !(obj as any).objectType
  );

  if (invalidObjects.length > 0) {
    logger.warn(`Grid contains ${invalidObjects.length} invalid objects`);
    return false;
  }

  return true;
}
