
/**
 * Grid renderers module
 * Provides functions for rendering grids on canvas
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Options for grid creation
 */
export interface GridOptions {
  /** Grid line size in pixels */
  size?: number;
  /** Grid line color */
  stroke?: string;
  /** Grid line width */
  strokeWidth?: number;
  /** Show larger major grid lines */
  showMajorLines?: boolean;
  /** Interval for major grid lines (every N lines) */
  majorInterval?: number;
  /** Major grid line color */
  majorStroke?: string;
  /** Major grid line width */
  majorStrokeWidth?: number;
  /** Show grid markers (labels) */
  showMarkers?: boolean;
}

/**
 * Create a basic emergency grid when normal grid creation fails
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn('Cannot create emergency grid: Invalid canvas');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  try {
    // Create minimal horizontal grid lines (every 50px)
    for (let i = 0; i <= height; i += 50) {
      const line = new Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back of canvas (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Create minimal vertical grid lines (every 50px)
    for (let i = 0; i <= width; i += 50) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back of canvas (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Force render
    canvas.requestRenderAll();
    logger.info('Emergency grid created with minimal lines');
    
  } catch (error) {
    logger.error('Failed to create emergency grid:', error);
  }
  
  return gridObjects;
};

/**
 * Create a simple grid with basic lines
 * @param canvas Fabric canvas instance
 * @param options Grid creation options
 * @returns Array of created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn('Cannot create grid: Invalid canvas');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Grid parameters
  const size = options.size || GRID_CONSTANTS.SMALL_GRID_SIZE;
  const stroke = options.stroke || GRID_CONSTANTS.SMALL_GRID_COLOR;
  const strokeWidth = options.strokeWidth || GRID_CONSTANTS.SMALL_GRID_WIDTH;
  
  try {
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += size) {
      const line = new Line([0, i, width, i], {
        stroke,
        strokeWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back of canvas (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += size) {
      const line = new Line([i, 0, i, height], {
        stroke,
        strokeWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back of canvas (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Force render
    canvas.requestRenderAll();
    
  } catch (error) {
    logger.error('Error creating simple grid:', error);
  }
  
  return gridObjects;
};

/**
 * Create a complete grid with small/large lines and markers
 * @param canvas Fabric canvas instance
 * @param options Grid creation options
 * @returns Array of created grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn('Cannot create complete grid: Invalid canvas');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  try {
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create large grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        hoverCursor: 'default'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Force render
    canvas.requestRenderAll();
    
  } catch (error) {
    logger.error('Error creating complete grid:', error);
  }
  
  return gridObjects;
};

/**
 * Create a grid on the canvas
 * Main entry point for grid creation
 * @param canvas Fabric canvas instance
 * @param options Grid creation options
 * @returns Array of created grid objects
 */
export const createGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  // Use createCompleteGrid as default implementation
  return createCompleteGrid(canvas, options);
};

/**
 * Ensure grid is created on canvas
 * @param canvas Fabric canvas instance
 * @returns Array of grid objects
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid already exists
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );
  
  if (existingGrid.length > 0) {
    return existingGrid;
  }
  
  // Create new grid if none exists
  return createGrid(canvas);
};

/**
 * Validate that a grid is correctly created
 * @param canvas Fabric canvas instance
 * @returns True if grid is valid
 */
export const validateGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );
  
  return gridObjects.length > 0;
};
