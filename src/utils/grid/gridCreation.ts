
/**
 * Grid creation utilities
 * @module utils/grid/gridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Options for creating grid
 */
export interface GridCreationOptions {
  /** Enable grid markers */
  showMarkers?: boolean;
  /** Enable debug mode */
  debug?: boolean;
  /** Custom color for small grid lines */
  smallGridColor?: string;
  /** Custom color for large grid lines */
  largeGridColor?: string;
}

/**
 * Create a complete grid with labels and markers
 * @param canvas Fabric canvas
 * @param options Grid creation options
 * @returns Created grid objects
 */
export const createEnhancedGrid = (
  canvas: FabricCanvas,
  options: GridCreationOptions = {}
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error('Invalid canvas for grid creation');
    return [];
  }
  
  const width = canvas.width;
  const height = canvas.height;
  const gridObjects: FabricObject[] = [];
  
  // Remove existing grid objects
  canvas.getObjects().forEach(obj => {
    if ((obj as any).objectType === 'grid' || (obj as any).isGrid === true) {
      canvas.remove(obj);
    }
  });
  
  // Create small grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create large grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Add grid markers (optional)
  if (options.showMarkers) {
    // Add horizontal markers (every 1m)
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const meters = i / 100; // Simple conversion for display
      
      const text = new Text(`${meters}m`, {
        left: i + 5,
        top: 5,
        fontSize: 12,
        fill: '#666666',
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(text);
      gridObjects.push(text);
    }
    
    // Add vertical markers (every 1m)
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const meters = i / 100; // Simple conversion for display
      
      const text = new Text(`${meters}m`, {
        left: 5,
        top: i + 5,
        fontSize: 12,
        fill: '#666666',
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
      
      canvas.add(text);
      gridObjects.push(text);
    }
  }
  
  // Log debug info if needed
  if (options.debug) {
    logger.debug(`Created grid with ${gridObjects.length} objects`);
    console.log(`Created grid with ${gridObjects.length} objects`);
  }
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  // Force render
  canvas.renderAll();
  
  return gridObjects;
};
