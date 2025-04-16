
/**
 * Canvas Grid Utilities
 * Functions for creating and managing canvas grid
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Grid options interface
 */
export interface GridOptions {
  showMajorLines?: boolean;
  majorInterval?: number;
  gridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
}

// Create a namespace object for grid functions
export const canvasGrid = {
  /**
   * Create a grid on the canvas
   * @param canvas Fabric canvas instance
   * @param options Grid creation options
   * @returns Array of created grid objects
   */
  createGrid: (
    canvas: FabricCanvas,
    options: GridOptions = {}
  ): FabricObject[] => {
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
          isGrid: true,
          isLargeGrid: isMajor && showMajorLines
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
          isGrid: true,
          isLargeGrid: isMajor && showMajorLines
        } as any);
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      canvas.requestRenderAll();
      return gridObjects;
    } catch (error) {
      logger.error('Error creating grid:', error);
      return [];
    }
  }
};

// Export namespace functions directly
export const createGrid = canvasGrid.createGrid;

// Export additional utility functions
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    logger.error('Error setting grid visibility:', error);
  }
};

export const forceGridVisibility = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      return false;
    }
    
    gridObjects.forEach(obj => {
      obj.set('visible', true);
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error forcing grid visibility:', error);
    return false;
  }
};

