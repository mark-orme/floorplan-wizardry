/**
 * Grid utility functions
 * @module gridUtils
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { GridDimensions, GridRenderResult } from '@/types/fabric';

/**
 * Calculate grid dimensions based on canvas size
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Base cell size
 * @returns Grid dimensions object
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
 * @param canvas Fabric.js canvas instance
 * @param dimensions Grid dimensions
 * @returns Created grid objects
 */
export const createGridLines = (
  canvas: Canvas,
  dimensions: GridDimensions
): FabricObject[] => {
  const { width, height, cellSize } = dimensions;
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += cellSize) {
    const line = new fabric.Line([0, i, width, i], {
      stroke: '#ccc',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create vertical lines
  for (let i = 0; i <= width; i += cellSize) {
    const line = new fabric.Line([i, 0, i, height], {
      stroke: '#ccc',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    gridObjects.push(line);
    canvas.add(line);
  }
  
  return gridObjects;
};

/**
 * Create a complete grid with all components
 * @param canvas Fabric.js canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Grid cell size
 * @returns Grid render result
 */
export const createCompleteGrid = (
  canvas: Canvas,
  width: number,
  height: number,
  cellSize: number = 20
): GridRenderResult => {
  const dimensions = calculateGridDimensions(width, height, cellSize);
  const objects = createGridLines(canvas, dimensions);
  
  return {
    objects,
    dimensions
  };
};

/**
 * Remove grid objects from canvas
 * @param canvas Fabric.js canvas instance
 * @param gridObjects Grid objects to remove
 */
export const removeGrid = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): void => {
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  canvas.requestRenderAll();
};

/**
 * Update grid visibility
 * @param gridObjects Grid objects to update
 * @param visible Whether grid should be visible
 */
export const setGridVisibility = (
  gridObjects: FabricObject[],
  visible: boolean
): void => {
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
};

/**
 * Check if an object is a grid object
 * @param obj Fabric object to check
 * @returns Whether the object is a grid object
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};

/**
 * Filter grid objects from an array of objects
 * @param objects Array of fabric objects
 * @returns Only grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(isGridObject);
};
