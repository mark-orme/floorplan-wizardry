
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

/**
 * Create a simple grid on the canvas
 * @param canvas - The Fabric.js canvas
 * @param options - Grid options
 * @returns Array of grid objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas,
  options: {
    gridSize?: number;
    majorGridSize?: number;
    gridColor?: string;
    majorGridColor?: string;
    addToCanvas?: boolean;
  } = {}
): FabricObject[] => {
  const {
    gridSize = 20,
    majorGridSize = 100,
    gridColor = 'rgba(200, 200, 200, 0.4)',
    majorGridColor = 'rgba(150, 150, 150, 0.6)',
    addToCanvas = true
  } = options;
  
  if (!canvas || !canvas.width || !canvas.height) {
    logger.warn('Invalid canvas for grid creation');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  
  try {
    // Create vertical grid lines
    for (let i = 0; i <= canvas.width; i += gridSize) {
      const isMajor = i % majorGridSize === 0;
      const line = new Line([i, 0, i, canvas.height], {
        stroke: isMajor ? majorGridColor : gridColor,
        selectable: false,
        evented: false,
        strokeWidth: isMajor ? 1 : 0.5,
        objectCaching: false,
        excludeFromExport: true,
        metadata: { type: 'grid', gridType: isMajor ? 'major' : 'minor' }
      });
      
      if (addToCanvas) {
        canvas.add(line);
      }
      
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= canvas.height; i += gridSize) {
      const isMajor = i % majorGridSize === 0;
      const line = new Line([0, i, canvas.width, i], {
        stroke: isMajor ? majorGridColor : gridColor,
        selectable: false,
        evented: false,
        strokeWidth: isMajor ? 1 : 0.5,
        objectCaching: false,
        excludeFromExport: true,
        metadata: { type: 'grid', gridType: isMajor ? 'major' : 'minor' }
      });
      
      if (addToCanvas) {
        canvas.add(line);
      }
      
      gridObjects.push(line);
    }
    
    // Send grid to back
    if (addToCanvas) {
      gridObjects.forEach(obj => {
        canvas.sendObjectToBack(obj);
      });
      
      canvas.requestRenderAll();
    }
    
    logger.info(`Created grid with ${gridObjects.length} lines`);
    
    return gridObjects;
  } catch (error) {
    logger.error('Error creating grid:', error);
    return [];
  }
};

/**
 * Emergency grid creation function for recovery
 * @param canvas - The Fabric.js canvas
 * @returns Array of grid objects
 */
export const createEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  logger.warn('Using emergency grid creation');
  
  try {
    // Create a simpler grid with fewer lines for emergency recovery
    return createSimpleGrid(canvas, {
      gridSize: 40,    // Use larger grid size for fewer lines
      majorGridSize: 200,
      gridColor: 'rgba(200, 200, 200, 0.7)', // More visible
      majorGridColor: 'rgba(100, 100, 100, 0.8)', // More visible
      addToCanvas: true
    });
  } catch (error) {
    logger.error('Emergency grid creation failed:', error);
    return [];
  }
};

/**
 * Ensure grid is visible and correctly ordered in the canvas
 * @param canvas - The Fabric.js canvas
 * @param gridObjects - Array of grid objects
 * @returns Whether the operation was successful
 */
export const ensureGridVisible = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects.length) {
    return false;
  }
  
  try {
    // Add any missing grid objects
    let addedCount = 0;
    gridObjects.forEach(obj => {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      logger.info(`Added ${addedCount} missing grid objects`);
    }
    
    // Send all grid objects to back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error ensuring grid visibility:', error);
    return false;
  }
};

/**
 * Create a mobile-optimized grid
 * @param canvas - The Fabric.js canvas
 * @returns Array of grid objects
 */
export const createMobileGrid = (canvas: FabricCanvas): FabricObject[] => {
  // For mobile, create a grid with more contrast and fewer lines
  return createSimpleGrid(canvas, {
    gridSize: 40,
    majorGridSize: 200,
    gridColor: 'rgba(200, 200, 200, 0.6)',
    majorGridColor: 'rgba(120, 120, 120, 0.8)',
    addToCanvas: true
  });
};
