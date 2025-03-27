
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Result of grid rendering operation
 */
export interface GridRenderResult {
  /** All grid objects created */
  gridObjects: fabric.Object[];
  /** Major grid lines only */
  majorLines: fabric.Line[];
  /** Minor grid lines only */
  minorLines: fabric.Line[];
}

/**
 * Create a grid of lines on the canvas
 * @param {FabricCanvas} canvas - The fabric canvas to draw on
 * @param {Object} options - Grid rendering options
 * @returns {GridRenderResult} The created grid objects
 */
export function renderGridComponents(
  canvas: FabricCanvas,
  options?: {
    cellSize?: number;
    majorLineFrequency?: number;
    majorLineColor?: string;
    minorLineColor?: string;
    majorLineWidth?: number;
    minorLineWidth?: number;
    opacity?: number;
  }
): GridRenderResult {
  const gridObjects: fabric.Object[] = [];
  const majorLines: fabric.Line[] = [];
  const minorLines: fabric.Line[] = [];

  const cellSize = options?.cellSize || GRID_CONSTANTS.CELL_SIZE;
  const majorLineFrequency = options?.majorLineFrequency || GRID_CONSTANTS.MAJOR_LINE_FREQUENCY;
  const majorLineColor = options?.majorLineColor || GRID_CONSTANTS.MAJOR_LINE_COLOR;
  const minorLineColor = options?.minorLineColor || GRID_CONSTANTS.MINOR_LINE_COLOR;
  const majorLineWidth = options?.majorLineWidth || GRID_CONSTANTS.MAJOR_LINE_WIDTH;
  const minorLineWidth = options?.minorLineWidth || GRID_CONSTANTS.MINOR_LINE_WIDTH;
  const opacity = options?.opacity || GRID_CONSTANTS.GRID_OPACITY;

  // Canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;

  // Create horizontal lines
  for (let i = 0; i <= height; i += cellSize) {
    const isMajor = i % (cellSize * majorLineFrequency) === 0;
    
    const line = new Line([0, i, width, i], {
      stroke: isMajor ? majorLineColor : minorLineColor,
      strokeWidth: isMajor ? majorLineWidth : minorLineWidth,
      selectable: false,
      evented: false,
      opacity: opacity,
      excludeFromExport: true,
      name: `grid-h-${i}`,
      data: { gridLine: true, isMajor }
    });

    if (isMajor) {
      majorLines.push(line);
    } else {
      minorLines.push(line);
    }
    
    gridObjects.push(line);
    canvas.add(line);
  }

  // Create vertical lines
  for (let i = 0; i <= width; i += cellSize) {
    const isMajor = i % (cellSize * majorLineFrequency) === 0;
    
    const line = new Line([i, 0, i, height], {
      stroke: isMajor ? majorLineColor : minorLineColor,
      strokeWidth: isMajor ? majorLineWidth : minorLineWidth,
      selectable: false,
      evented: false,
      opacity: opacity,
      excludeFromExport: true,
      name: `grid-v-${i}`,
      data: { gridLine: true, isMajor }
    });

    if (isMajor) {
      majorLines.push(line);
    } else {
      minorLines.push(line);
    }
    
    gridObjects.push(line);
    canvas.add(line);
  }

  // Send all grid lines to back
  gridObjects.forEach(obj => obj.sendToBack());

  return { 
    gridObjects, 
    majorLines, 
    minorLines 
  };
}

/**
 * Arrange grid objects in the correct z-order
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {fabric.Object[]} gridObjects - The grid objects to arrange
 */
export function arrangeGridObjects(canvas: FabricCanvas, gridObjects: fabric.Object[]): void {
  // Send all grid lines to back
  gridObjects.forEach(obj => obj.sendToBack());
  canvas.requestRenderAll();
}

/**
 * Remove grid objects from canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {fabric.Object[]} gridObjects - The grid objects to remove
 */
export function removeGridObjects(canvas: FabricCanvas, gridObjects: fabric.Object[]): void {
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.requestRenderAll();
}
