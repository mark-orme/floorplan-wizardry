
/**
 * Grid utilities
 * @module gridUtils
 */

import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, SMALL_GRID, LARGE_GRID } from '@/constants/numerics';
import { GridLineType } from '@/types/fabricTypes';

// Grid line type enum
export { GridLineType } from '@/types/fabricTypes';

/**
 * Create a grid on the canvas
 * @param canvas Fabric canvas
 * @param width Canvas width
 * @param height Canvas height
 * @returns Array of created grid objects
 */
export const createGrid = (
  canvas: FabricCanvas,
  width: number,
  height: number
): FabricObject[] => {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  
  // Create small grid lines
  for (let x = 0; x <= width; x += SMALL_GRID) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    (line as any).isGrid = true;
    (line as any).gridType = GridLineType.SMALL;
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let y = 0; y <= height; y += SMALL_GRID) {
    const line = new Line([0, y, width, y], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    (line as any).isGrid = true;
    (line as any).gridType = GridLineType.SMALL;
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create large grid lines
  for (let x = 0; x <= width; x += LARGE_GRID) {
    const line = new Line([x, 0, x, height], {
      stroke: '#cccccc',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    (line as any).isGrid = true;
    (line as any).gridType = GridLineType.LARGE;
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let y = 0; y <= height; y += LARGE_GRID) {
    const line = new Line([0, y, width, y], {
      stroke: '#cccccc',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    (line as any).isGrid = true;
    (line as any).gridType = GridLineType.LARGE;
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create axis lines
  const xAxisLine = new Line([0, height/2, width, height/2], {
    stroke: '#999999',
    strokeWidth: 1.5,
    selectable: false,
    evented: false,
    objectCaching: false
  });
  (xAxisLine as any).isGrid = true;
  (xAxisLine as any).gridType = GridLineType.AXIS;
  canvas.add(xAxisLine);
  gridObjects.push(xAxisLine);
  
  const yAxisLine = new Line([width/2, 0, width/2, height], {
    stroke: '#999999',
    strokeWidth: 1.5,
    selectable: false,
    evented: false,
    objectCaching: false
  });
  (yAxisLine as any).isGrid = true;
  (yAxisLine as any).gridType = GridLineType.AXIS;
  canvas.add(yAxisLine);
  gridObjects.push(yAxisLine);
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Create complete grid with all elements
 * @param canvas Fabric canvas
 * @returns Grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  width?: number,
  height?: number
): FabricObject[] => {
  if (!canvas) return [];
  
  const canvasWidth = width || canvas.getWidth();
  const canvasHeight = height || canvas.getHeight();
  
  return createGrid(canvas, canvasWidth, canvasHeight);
};

/**
 * Calculate grid dimensions based on canvas
 * @param canvas Fabric canvas
 * @returns Grid dimensions object
 */
export const calculateGridDimensions = (canvas: FabricCanvas) => {
  if (!canvas) {
    return {
      width: 0,
      height: 0,
      smallGridSize: SMALL_GRID,
      largeGridSize: LARGE_GRID,
      cellSize: GRID_SPACING
    };
  }
  
  return {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    smallGridSize: SMALL_GRID,
    largeGridSize: LARGE_GRID,
    cellSize: GRID_SPACING
  };
};

/**
 * Get grid cell size from grid type
 * @param gridType Grid type (small, large)
 * @returns Grid cell size in pixels
 */
export const getGridCellSize = (gridType: 'small' | 'large'): number => {
  return gridType === 'small' ? SMALL_GRID : LARGE_GRID;
};

/**
 * Get grid dimensions
 * @param canvas Fabric canvas
 * @returns Grid dimensions object
 */
export const getGridDimensions = (canvas: FabricCanvas) => {
  if (!canvas) {
    return {
      width: 0,
      height: 0,
      smallGridSize: SMALL_GRID,
      largeGridSize: LARGE_GRID
    };
  }
  
  return {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    smallGridSize: SMALL_GRID,
    largeGridSize: LARGE_GRID
  };
};

/**
 * Create grid lines only
 * @param canvas Fabric canvas
 * @param width Canvas width
 * @param height Canvas height
 * @returns Grid objects
 */
export const createGridLines = (
  canvas: FabricCanvas,
  width: number,
  height: number
): FabricObject[] => {
  return createGrid(canvas, width, height);
};

/**
 * Check if grid already exists on canvas
 * @param canvas Fabric canvas
 * @returns Whether grid exists
 */
export const hasExistingGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const objects = canvas.getObjects();
  return objects.some(obj => (obj as any).isGrid === true);
};

/**
 * Remove grid from canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to remove
 */
export const removeGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  canvas.renderAll();
};

/**
 * Set grid visibility
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects
 * @param visible Visibility flag
 */
export const setGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  visible: boolean
): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  canvas.renderAll();
};

/**
 * Check if an object is a grid object
 * @param obj Fabric object
 * @returns Whether object is a grid element
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return (obj as any).isGrid === true;
};

/**
 * Filter grid objects from array
 * @param objects Array of fabric objects
 * @returns Filtered grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(isGridObject);
};

/**
 * Get nearest grid point to given point
 * @param point Input point
 * @param gridSize Grid size
 * @returns Snapped point
 */
export const getNearestGridPoint = (point: Point, gridSize: number = GRID_SPACING): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Clear grid from canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to clear
 */
export const clearGrid = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.renderAll();
};
