
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Creates a complete grid with both small and large grid lines
 * 
 * @param canvas - Fabric canvas to draw grid on
 * @returns Array of grid objects
 */
export function createCompleteGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    // logger.warn('Invalid canvas dimensions for grid creation');
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Create small grid lines
    for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create large grid lines
    for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Ensure all grid objects are properly rendered
    canvas.renderAll();
    
    return gridObjects;
  } catch (error) {
    // logger.error('Error creating complete grid:', error);
    return [];
  }
}

/**
 * Creates a basic emergency grid when the main grid creation fails
 * 
 * @param canvas - Fabric canvas
 * @returns Array of grid objects
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Create large grid lines only for emergency grid
    for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    canvas.renderAll();
    
    return gridObjects;
  } catch (error) {
    // logger.error('Error creating emergency grid:', error);
    return [];
  }
}

/**
 * Validates that a grid exists and is visible
 * 
 * @param canvas - Fabric canvas
 * @param gridObjects - Optional array of grid objects to validate
 * @returns Whether the grid is valid
 */
export function validateGrid(
  canvas: FabricCanvas,
  gridObjects?: FabricObject[]
): boolean {
  if (!canvas) return false;
  
  const objects = gridObjects || canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  return objects.length > 0;
}

/**
 * Creates a grid if one doesn't exist
 * 
 * @param canvas - Fabric canvas
 * @returns Created grid objects or empty array if failed
 */
export function createGrid(canvas: FabricCanvas): FabricObject[] {
  return createCompleteGrid(canvas);
}

/**
 * Ensures a grid exists, creating one if needed
 * 
 * @param canvas - Fabric canvas
 * @returns Whether a grid exists
 */
export function ensureGrid(canvas: FabricCanvas): boolean {
  if (!canvas) return false;
  
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (existingGrid.length > 0) {
    return true;
  }
  
  const newGrid = createCompleteGrid(canvas);
  return newGrid.length > 0;
}
