
/**
 * Grid renderer utilities
 * Functions for rendering different types of grids
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid } from './gridCreationUtils';

/**
 * Create a standard grid on the canvas
 * @param canvas The fabric canvas
 * @param gridSize The size of the grid cells
 * @param options Additional options for the grid
 * @returns The grid objects created
 */
export function createGrid(
  canvas: Canvas,
  gridSize: number = 20,
  options: any = {}
): FabricObject[] {
  return createCompleteGrid(canvas, gridSize, options);
}

/**
 * Render a grid with main and secondary lines
 * @param canvas The fabric canvas
 * @param smallGridSize The size of the small grid cells
 * @param largeGridInterval The interval for larger grid lines
 * @param options Additional options for the grid
 * @returns The grid objects created
 */
export function createDualScaleGrid(
  canvas: Canvas | null,
  smallGridSize: number = 20,
  largeGridInterval: number = 5,
  options: any = {}
): FabricObject[] {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  const { width, height } = canvas;
  
  const smallColor = options.smallColor || '#eeeeee';
  const largeColor = options.largeColor || '#cccccc';
  const smallOpacity = options.smallOpacity || 0.4;
  const largeOpacity = options.largeOpacity || 0.7;
  
  // Small grid lines
  for (let x = 0; x <= width; x += smallGridSize) {
    const isLargeLine = x % (smallGridSize * largeGridInterval) === 0;
    const line = new fabric.Line([x, 0, x, height], {
      stroke: isLargeLine ? largeColor : smallColor,
      strokeWidth: isLargeLine ? 1.5 : 1,
      opacity: isLargeLine ? largeOpacity : smallOpacity,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true
    });
    
    canvas.add(line as FabricObject);
    gridObjects.push(line as FabricObject);
  }
  
  for (let y = 0; y <= height; y += smallGridSize) {
    const isLargeLine = y % (smallGridSize * largeGridInterval) === 0;
    const line = new fabric.Line([0, y, width, y], {
      stroke: isLargeLine ? largeColor : smallColor,
      strokeWidth: isLargeLine ? 1.5 : 1,
      opacity: isLargeLine ? largeOpacity : smallOpacity,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true
    });
    
    canvas.add(line as FabricObject);
    gridObjects.push(line as FabricObject);
  }
  
  return gridObjects;
}
