
/**
 * Canvas Grid Utilities
 * Functions for creating and managing canvas grid
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

export interface GridOptions {
  showMajorLines?: boolean;
  majorInterval?: number;
  gridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
}

/**
 * Create a grid on the canvas
 * @param canvas Fabric canvas instance
 * @param options Grid creation options
 * @returns Array of created grid objects
 */
export function createGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] {
  try {
    if (!canvas || !canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
      console.warn('Cannot create grid: Invalid canvas dimensions', {
        width: canvas?.width,
        height: canvas?.height
      });
      return [];
    }
    
    // Clean up existing grid
    const existingGridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    existingGridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = options.gridSize || GRID_CONSTANTS.SMALL_GRID_SIZE;
    const smallGridColor = options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR;
    const largeGridColor = options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR;
    const showMajorLines = options.showMajorLines !== false;
    const majorInterval = options.majorInterval || 5; // Major lines every X minor lines
    
    // Calculate major grid size
    const majorGridSize = gridSize * majorInterval;
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSize) {
      const isMajor = i % majorGridSize === 0;
      const line = new Line([0, i, width, i], {
        stroke: isMajor && showMajorLines ? largeGridColor : smallGridColor,
        strokeWidth: isMajor && showMajorLines ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSize) {
      const isMajor = i % majorGridSize === 0;
      const line = new Line([i, 0, i, height], {
        stroke: isMajor && showMajorLines ? largeGridColor : smallGridColor,
        strokeWidth: isMajor && showMajorLines ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Make sure grid is at the back
    gridObjects.forEach(obj => canvas.sendToBack(obj));
    
    // Ensure visibility with a render
    canvas.requestRenderAll();
    
    logger.info(`Created grid with ${gridObjects.length} lines`);
    console.log(`Created grid with ${gridObjects.length} lines`);
    
    return gridObjects;
  } catch (error) {
    logger.error('Failed to create grid:', error);
    console.error('Failed to create grid:', error);
    return [];
  }
}

/**
 * Toggle grid visibility
 * @param canvas Fabric canvas instance
 * @param visible Whether grid should be visible
 */
export function setGridVisibility(
  canvas: FabricCanvas,
  visible: boolean
): void {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  
  canvas.requestRenderAll();
  logger.info(`Grid visibility set to ${visible}`);
}

/**
 * Force grid visibility and creation
 * @param canvas Fabric canvas instance
 * @returns Array of grid objects
 */
export function forceGridVisibility(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) return [];
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (gridObjects.length > 0) {
    // Grid exists, just make it visible
    gridObjects.forEach(obj => {
      obj.set('visible', true);
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
    return gridObjects;
  } else {
    // Create new grid
    return createGrid(canvas);
  }
}
