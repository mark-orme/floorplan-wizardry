
/**
 * Reliable grid creation utilities
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Default minimum dimensions for a valid canvas
 */
const DEFAULT_MIN_CANVAS_WIDTH = 100;
const DEFAULT_MIN_CANVAS_HEIGHT = 100;

/**
 * Options for reliable grid creation
 */
export interface ReliableGridOptions {
  /** Enable grid markers */
  showMarkers?: boolean;
  /** Enable debug mode */
  debug?: boolean;
  /** Custom color for small grid lines */
  smallGridColor?: string;
  /** Custom color for large grid lines */
  largeGridColor?: string;
  /** Maximum retry attempts for grid creation */
  maxRetries?: number;
}

/**
 * Create a reliable grid with fallback mechanisms
 * @param canvas Fabric canvas
 * @param options Grid creation options
 * @returns Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  options: ReliableGridOptions = {}
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
  
  try {
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
    
    // Send all grid objects to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    // Force render
    canvas.renderAll();
    
  } catch (error) {
    logger.error('Error creating grid:', error);
    
    // Create a simpler emergency grid on error
    try {
      return createEmergencyFallbackGrid(canvas);
    } catch (emergencyError) {
      logger.error('Emergency grid creation also failed:', emergencyError);
      return [];
    }
  }
  
  return gridObjects;
};

/**
 * Create a very basic grid as a fallback
 * @param canvas Fabric canvas
 * @returns Created grid objects
 */
const createEmergencyFallbackGrid = (canvas: FabricCanvas): FabricObject[] => {
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  // Use larger spacing for emergency grid to reduce object count
  const spacing = 50;
  
  for (let i = 0; i <= width; i += spacing) {
    const line = new Line([i, 0, i, height], {
      stroke: '#dddddd',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += spacing) {
    const line = new Line([0, i, width, i], {
      stroke: '#dddddd',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.renderAll();
  return gridObjects;
};
