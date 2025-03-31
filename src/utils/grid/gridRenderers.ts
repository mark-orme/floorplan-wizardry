
/**
 * Grid rendering utilities
 * Create and manage grid lines and objects
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

/**
 * Grid options type
 */
export interface GridOptions {
  color?: string;
  width?: number;
  selectable?: boolean;
  type?: string;
}

/**
 * Create a basic grid
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create grid: Invalid canvas");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        strokeDashArray: [1, 3],
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        strokeDashArray: [1, 3],
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Create a basic emergency grid with minimal features
 * Used as fallback when normal grid creation fails
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create emergency grid: Invalid canvas");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE; // Larger grid for better performance
    
    // Create minimal number of lines (emergency mode)
    const maxLines = 20;
    const hStep = Math.max(gridSize, height / maxLines);
    const vStep = Math.max(gridSize, width / maxLines);
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += hStep) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isEmergencyGrid = true;
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += vStep) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isEmergencyGrid = true;
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a complete grid with major and minor lines
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create complete grid: Invalid canvas");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const minorGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const majorGridSize = minorGridSize * 5;
    
    // Create horizontal minor lines
    for (let i = 0; i <= height; i += minorGridSize) {
      const isMajor = i % majorGridSize === 0;
      
      const line = new Line([0, i, width, i], {
        stroke: isMajor ? GRID_CONSTANTS.MAJOR_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: isMajor ? 1 : 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        strokeDashArray: isMajor ? undefined : [1, 3],
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isMajorLine = isMajor;
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical minor lines
    for (let i = 0; i <= width; i += minorGridSize) {
      const isMajor = i % majorGridSize === 0;
      
      const line = new Line([i, 0, i, height], {
        stroke: isMajor ? GRID_CONSTANTS.MAJOR_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: isMajor ? 1 : 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        strokeDashArray: isMajor ? undefined : [1, 3],
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isMajorLine = isMajor;
      
      gridObjects.push(line);
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create a simple grid with only major lines
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create simple grid: Invalid canvas");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE; // Only major lines
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isSimpleGrid = true;
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      (line as any).isSimpleGrid = true;
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating simple grid:", error);
    return [];
  }
};

/**
 * Ensure a grid exists on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    return [];
  }
  
  // Check for existing grid
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (existingGrid.length > 0) {
    return existingGrid;
  }
  
  // Create new grid if none exists
  return createGrid(canvas);
};

/**
 * Validate grid objects
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (gridObjects: FabricObject[]): boolean => {
  if (!gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if all objects are valid grid objects
  return gridObjects.every(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
};
