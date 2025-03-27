
/**
 * Grid utility functions
 * Handles creation, management and removal of grid elements on canvas
 * @module gridUtils
 */
import { Canvas, Object as FabricObject, Line } from 'fabric';
import type { GridDimensions, GridRenderResult } from '@/types/fabric';
import logger from '@/utils/logger';

/**
 * Calculate grid dimensions based on canvas size
 * Creates a configuration object with width, height and cell size
 * 
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @param {number} cellSize - Base cell size in pixels (default: 20)
 * @returns {GridDimensions} Grid dimensions object
 */
export const calculateGridDimensions = (
  width: number,
  height: number,
  cellSize: number = 20
): GridDimensions => {
  return {
    width,
    height,
    cellSize
  };
};

/**
 * Create grid lines on canvas
 * Generates horizontal and vertical lines at regular intervals
 * 
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {GridDimensions} dimensions - Grid dimensions configuration
 * @returns {FabricObject[]} Array of created grid line objects
 */
export const createGridLines = (
  canvas: Canvas,
  dimensions: GridDimensions
): FabricObject[] => {
  const { width, height, cellSize } = dimensions;
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal lines
  // These run left-to-right across the canvas at regular intervals
  for (let i = 0; i <= height; i += cellSize) {
    // Create a line from (0,i) to (width,i)
    const line = new Line([0, i, width, i], {
      stroke: '#ccc',          // Light gray color
      selectable: false,       // Grid lines cannot be selected
      evented: false,          // Grid lines don't receive events
      objectType: 'grid'       // Mark as grid object for filtering
    });
    gridObjects.push(line);
    canvas.add(line);          // Add to canvas immediately
  }
  
  // Create vertical lines
  // These run top-to-bottom down the canvas at regular intervals
  for (let i = 0; i <= width; i += cellSize) {
    // Create a line from (i,0) to (i,height)
    const line = new Line([i, 0, i, height], {
      stroke: '#ccc',          // Light gray color
      selectable: false,       // Grid lines cannot be selected
      evented: false,          // Grid lines don't receive events
      objectType: 'grid'       // Mark as grid object for filtering
    });
    gridObjects.push(line);
    canvas.add(line);          // Add to canvas immediately
  }
  
  // Return all created grid objects for later reference
  return gridObjects;
};

/**
 * Create a complete grid with all components
 * Handles dimensions calculation and creates all grid elements
 * 
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @param {number} cellSize - Grid cell size in pixels (default: 20)
 * @returns {GridRenderResult} Grid render result with categorized objects
 */
export const createCompleteGrid = (
  canvas: Canvas,
  width: number,
  height: number,
  cellSize: number = 20
): GridRenderResult => {
  // Check if grid already exists to prevent duplication
  if (canvas && hasExistingGrid(canvas)) {
    logger.info("Grid already exists - not recreating");
    return {
      gridObjects: filterGridObjects(canvas.getObjects()),
      smallGridLines: [],
      largeGridLines: [],
      markers: []
    };
  }
  
  logger.info(`Creating grid with dimensions: ${width}x${height}, cell size: ${cellSize}`);
  
  // Calculate appropriate dimensions based on inputs
  const dimensions = calculateGridDimensions(width, height, cellSize);
  
  // Create all grid lines using the dimensions
  const gridObjects = createGridLines(canvas, dimensions);
  
  // Split grid objects into categories required by GridRenderResult interface
  // This allows consumers to manipulate different grid elements separately
  const smallGridLines: FabricObject[] = [];  // Finer grid lines (not yet implemented)
  const largeGridLines: FabricObject[] = [];  // Major grid lines (not yet implemented)
  const markers: FabricObject[] = [];         // Grid markers/labels (not yet implemented)
  
  // Force a render to ensure grid is displayed
  canvas.requestRenderAll();
  
  // Return categorized grid objects
  return {
    gridObjects,     // All grid objects
    smallGridLines,  // Small/fine grid lines subset
    largeGridLines,  // Large/major grid lines subset
    markers          // Text markers/labels
  };
};

/**
 * Check if grid already exists on canvas
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @returns {boolean} Whether grid already exists
 */
export const hasExistingGrid = (canvas: Canvas): boolean => {
  if (!canvas) return false;
  const objects = canvas.getObjects();
  return objects.some(obj => obj.objectType === 'grid');
};

/**
 * Remove grid objects from canvas
 * Safely removes all grid-related objects
 * 
 * @param {Canvas} canvas - Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to remove
 */
export const removeGrid = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): void => {
  // Remove each grid object if it exists on the canvas
  gridObjects.forEach(obj => {
    // Check if object still exists on canvas before removing
    // This prevents errors when trying to remove already removed objects
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  // Force canvas to render changes
  canvas.requestRenderAll();
};

/**
 * Update grid visibility
 * Shows or hides all grid objects without removing them
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {boolean} visible - Whether grid should be visible
 */
export const setGridVisibility = (
  canvas: Canvas,
  visible: boolean
): void => {
  if (!canvas) return;
  
  // Get all grid objects from canvas
  const gridObjects = filterGridObjects(canvas.getObjects());
  
  // Set visibility property on each grid object
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  // Force canvas to render changes
  canvas.requestRenderAll();
};

/**
 * Check if an object is a grid object
 * Uses the objectType property to identify grid elements
 * 
 * @param {FabricObject} obj - Fabric object to check
 * @returns {boolean} Whether the object is a grid object
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};

/**
 * Filter grid objects from an array of objects
 * Creates a new array containing only grid objects
 * 
 * @param {FabricObject[]} objects - Array of fabric objects
 * @returns {FabricObject[]} Only grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(isGridObject);
};

/**
 * Get the nearest grid point to a given point
 * Used for snap-to-grid functionality
 * 
 * @param {Object} point - Point with x, y coordinates
 * @param {number} cellSize - Grid cell size in pixels
 * @returns {Object} Nearest grid point with snapped x, y coordinates
 */
export const getNearestGridPoint = (
  point: { x: number; y: number },
  cellSize: number = 20
): { x: number; y: number } => {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: Math.round(point.x / cellSize) * cellSize,
    y: Math.round(point.y / cellSize) * cellSize
  };
};

