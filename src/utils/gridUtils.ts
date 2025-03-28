
/**
 * Grid utility functions
 * @module utils/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/core/Point';
import { GridLineType } from '@/types/fabricTypes';

/**
 * Check if the canvas has an existing grid
 * @param canvas Fabric canvas
 * @returns Whether the canvas has a grid
 */
export const hasExistingGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  return canvas.getObjects().some(obj => 
    obj.get('objectType') === 'grid'
  );
};

/**
 * Remove grid from canvas
 * @param canvas Fabric canvas
 */
export const removeGrid = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    obj.get('objectType') === 'grid'
  );
  
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.requestRenderAll();
};

/**
 * Set grid visibility
 * @param canvas Fabric canvas
 * @param visible Whether grid should be visible
 */
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    obj.get('objectType') === 'grid'
  );
  
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  
  canvas.requestRenderAll();
};

/**
 * Create grid on canvas
 * @param canvas Fabric canvas
 * @param width Canvas width
 * @param height Canvas height
 * @returns Grid objects
 */
export const createGrid = (canvas: FabricCanvas, width?: number, height?: number): FabricObject[] => {
  if (!canvas) return [];
  
  const canvasWidth = width || canvas.getWidth();
  const canvasHeight = height || canvas.getHeight();
  
  // Calculate grid dimensions
  const dimensions = calculateGridDimensions(canvasWidth, canvasHeight);
  
  // Create grid lines
  const gridLines = createGridLines(dimensions);
  
  // Add grid lines to canvas
  gridLines.forEach(line => {
    canvas.add(line);
    canvas.sendToBack(line);
  });
  
  canvas.requestRenderAll();
  return gridLines;
};

/**
 * Calculate grid dimensions
 * @param width Canvas width
 * @param height Canvas height
 * @returns Grid dimensions
 */
export const calculateGridDimensions = (width: number, height: number) => {
  return {
    width,
    height,
    smallGridSize: GRID_SPACING.SMALL,
    largeGridSize: GRID_SPACING.LARGE
  };
};

/**
 * Create grid lines
 * @param dimensions Grid dimensions
 * @returns Array of grid line objects
 */
export const createGridLines = (dimensions: any): FabricObject[] => {
  const { width, height, smallGridSize, largeGridSize } = dimensions;
  
  // Create small grid lines
  const smallGridLines: FabricObject[] = [];
  
  // Vertical small grid lines
  for (let x = 0; x <= width; x += smallGridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#eeeeee',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default',
      originX: 'center',
      originY: 'center'
    });
    smallGridLines.push(line);
  }
  
  // Horizontal small grid lines
  for (let y = 0; y <= height; y += smallGridSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#eeeeee',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default',
      originX: 'center',
      originY: 'center'
    });
    smallGridLines.push(line);
  }
  
  // Create large grid lines
  const largeGridLines: FabricObject[] = [];
  
  // Vertical large grid lines
  for (let x = 0; x <= width; x += largeGridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#dddddd',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default',
      originX: 'center',
      originY: 'center'
    });
    largeGridLines.push(line);
  }
  
  // Horizontal large grid lines
  for (let y = 0; y <= height; y += largeGridSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#dddddd',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default',
      originX: 'center',
      originY: 'center'
    });
    largeGridLines.push(line);
  }
  
  return [...smallGridLines, ...largeGridLines];
};

/**
 * Create a complete grid with small and large lines
 * @param canvas Fabric canvas
 * @returns Grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  removeGrid(canvas);
  return createGrid(canvas);
};

/**
 * Filter grid objects from a list of objects
 * @param objects Array of Fabric objects
 * @returns Non-grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(obj => obj.get('objectType') !== 'grid');
};

/**
 * Check if an object is a grid object
 * @param obj Fabric object
 * @returns Whether the object is a grid object
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.get('objectType') === 'grid';
};

/**
 * Get the nearest grid point to a given point
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export const getNearestGridPoint = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  const x = Math.round(point.x / gridSize) * gridSize;
  const y = Math.round(point.y / gridSize) * gridSize;
  return { x, y } as Point;
};
