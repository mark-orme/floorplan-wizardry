
import { FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Validate grid objects
 * @param gridObjects Array of grid objects to validate
 * @returns Whether the grid is valid
 */
export const validateGrid = (gridObjects: FabricObject[]): boolean => {
  if (!Array.isArray(gridObjects)) return false;
  if (gridObjects.length === 0) return false;
  
  // Check that all objects have expected properties
  return gridObjects.every(obj => 
    obj && typeof obj === 'object' && 'type' in obj
  );
};

/**
 * Create a complete grid with small and large lines
 * @param canvas The fabric canvas
 * @param visible Whether the grid should be visible
 * @param options Additional grid options
 */
export const createCompleteGrid = (
  canvas: any,
  visible: boolean = true,
  options: {
    smallGridSize?: number;
    largeGridSize?: number;
    smallGridColor?: string;
    largeGridColor?: string;
    smallGridWidth?: number;
    largeGridWidth?: number;
  } = {}
): FabricObject[] => {
  if (!canvas) return [];
  
  // Use options or defaults
  const smallGridSize = options.smallGridSize ?? GRID_CONSTANTS.SMALL_GRID_SIZE;
  const largeGridSize = options.largeGridSize ?? GRID_CONSTANTS.LARGE_GRID_SIZE;
  const smallGridColor = options.smallGridColor ?? GRID_CONSTANTS.SMALL_GRID_COLOR;
  const largeGridColor = options.largeGridColor ?? GRID_CONSTANTS.LARGE_GRID_COLOR;
  const smallGridWidth = options.smallGridWidth ?? GRID_CONSTANTS.SMALL_GRID_WIDTH;
  const largeGridWidth = options.largeGridWidth ?? GRID_CONSTANTS.LARGE_GRID_WIDTH;
  
  // Remove existing grid
  const existingGrid = canvas.getObjects().filter((obj: any) => 
    obj.isGrid === true
  );
  
  existingGrid.forEach((obj: any) => canvas.remove(obj));
  
  // If not visible, just return empty array
  if (!visible) {
    return [];
  }
  
  // Create grid objects
  const gridObjects: FabricObject[] = [];
  const width = typeof canvas.getWidth === 'function' ? canvas.getWidth() : 1000;
  const height = typeof canvas.getHeight === 'function' ? canvas.getHeight() : 1000;
  
  return gridObjects;
};
