
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Options for grid creation
 */
export interface GridOptions {
  color?: string;
  opacity?: number;
  smallColor?: string;
  largeColor?: string;
  smallOpacity?: number;
  largeOpacity?: number;
  smallWidth?: number;
  largeWidth?: number;
}

/**
 * Create a complete grid on the canvas
 * @param canvas The fabric canvas
 * @param gridSize The size of the grid cells
 * @param options Additional options for the grid
 * @returns The grid objects created
 */
export function createCompleteGrid(
  canvas: Canvas,
  gridSize: number = 20,
  options: GridOptions = {}
): FabricObject[] {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width || 1000;
  const height = canvas.height || 800;
  
  const lineColor = options.color || '#eeeeee';
  const lineOpacity = options.opacity !== undefined ? options.opacity : 0.5;
  
  // Create horizontal grid lines
  for (let y = 0; y <= height; y += gridSize) {
    if (typeof window !== 'undefined' && window.fabric) {
      const line = new window.fabric.Line([0, y, width, y], {
        stroke: lineColor,
        strokeWidth: 1,
        opacity: lineOpacity,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        excludeFromExport: true
      });
      
      canvas.add(line as FabricObject);
      gridObjects.push(line as FabricObject);
    }
  }
  
  // Create vertical grid lines
  for (let x = 0; x <= width; x += gridSize) {
    if (typeof window !== 'undefined' && window.fabric) {
      const line = new window.fabric.Line([x, 0, x, height], {
        stroke: lineColor,
        strokeWidth: 1,
        opacity: lineOpacity,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        excludeFromExport: true
      });
      
      canvas.add(line as FabricObject);
      gridObjects.push(line as FabricObject);
    }
  }
  
  return gridObjects;
}

/**
 * Validate grid parameters and settings
 * @param canvas Canvas to add grid to
 * @param gridSize Size of grid cells
 * @returns Whether grid parameters are valid
 */
export function validateGrid(canvas: Canvas | null, gridSize: number): boolean {
  if (!canvas) return false;
  if (!gridSize || gridSize <= 0) return false;
  
  const width = canvas.width || 0;
  const height = canvas.height || 0;
  
  return width > 0 && height > 0;
}

/**
 * Remove all grid objects from the canvas
 * @param canvas Canvas to remove grid from
 */
export function removeGrid(canvas: Canvas): void {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid
  );
  
  if (gridObjects.length > 0) {
    canvas.remove(...gridObjects);
  }
}
