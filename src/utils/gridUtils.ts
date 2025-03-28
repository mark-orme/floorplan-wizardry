
/**
 * Grid utilities
 * @module gridUtils
 */

import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING, SMALL_GRID, LARGE_GRID } from '@/constants/numerics';

// Grid line type enum
export enum GridLineType {
  SMALL = 'small',
  LARGE = 'large',
  AXIS = 'axis'
}

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
