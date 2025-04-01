
/**
 * Grid validation utilities
 */
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
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
 * Validate grid dimensions
 * @param width - Grid width
 * @param height - Grid height
 * @returns Whether dimensions are valid
 */
export function validateGridDimensions(width: number, height: number): boolean {
  const minWidth = 100;
  const minHeight = 100;

  return width >= minWidth && height >= minHeight;
}

/**
 * Check if grid exists on canvas
 * @param canvas - Fabric canvas
 * @returns Whether grid exists
 */
export function doesGridExist(canvas: FabricCanvas): boolean {
  if (!canvas) return false;

  const objects = canvas.getObjects?.() || [];
  return objects.some(obj => (obj as any).objectType === 'grid');
}

/**
 * Count grid objects on canvas
 * @param canvas - Fabric canvas
 * @returns Number of grid objects
 */
export function countGridObjects(canvas: FabricCanvas): number {
  if (!canvas) return 0;

  const objects = canvas.getObjects?.() || [];
  return objects.filter(obj => (obj as any).objectType === 'grid').length;
}

/**
 * Check if grid is valid
 * @param canvas - Fabric canvas
 * @returns Whether grid is valid
 */
export function isGridValid(canvas: FabricCanvas): boolean {
  if (!isCanvasValidForGrid(canvas)) return false;
  if (!doesGridExist(canvas)) return false;

  // Check if there are enough grid objects
  const gridObjectCount = countGridObjects(canvas);
  // A minimal grid should have at least a few lines
  return gridObjectCount >= 4;
}
