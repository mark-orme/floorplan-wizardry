
/**
 * Grid utilities
 * @module utils/gridUtils
 */
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Grid dimensions interface
 */
interface GridDimensions {
  width: number;
  height: number;
  cellSize: number;
}

/**
 * Helper to check if an object is a grid object
 * @param obj The object to check
 * @returns True if the object is a grid object
 */
export function isGridObject(obj: FabricObject): boolean {
  return obj && (obj as any).objectType === 'grid';
}

/**
 * Calculate grid dimensions based on canvas size
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Optional cell size
 * @returns Grid dimensions
 */
export function calculateGridDimensions(
  width: number,
  height: number,
  cellSize: number = 20
): GridDimensions {
  return {
    width,
    height,
    cellSize
  };
}

/**
 * Create grid lines on the canvas
 * @param canvas The canvas
 * @param dimensions Grid dimensions
 * @returns Array of created grid objects
 */
export function createGridLines(
  canvas: Canvas,
  dimensions: GridDimensions
): FabricObject[] {
  if (!canvas) return [];
  
  const { width, height, cellSize } = dimensions;
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += cellSize) {
    const line = new Line([0, i, width, i], {
      stroke: '#cccccc',
      strokeWidth: i % 100 === 0 ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let i = 0; i <= width; i += cellSize) {
    const line = new Line([i, 0, i, height], {
      stroke: '#cccccc',
      strokeWidth: i % 100 === 0 ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  return gridObjects;
}

/**
 * Create a complete grid with all components
 * @param canvas The canvas
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Grid cell size
 * @returns Grid render result
 */
export function createCompleteGrid(
  canvas: Canvas,
  width: number,
  height: number,
  cellSize: number = 20
): {
  gridObjects: FabricObject[];
  smallGridLines: FabricObject[];
  largeGridLines: FabricObject[];
  markers: FabricObject[];
} {
  // Calculate grid dimensions
  const dimensions = calculateGridDimensions(width, height, cellSize);
  
  // Create grid objects
  const gridObjects = createGridLines(canvas, dimensions);
  
  // Separating lines into small and large grid lines
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  
  gridObjects.forEach(obj => {
    // Cast to Line to check strokeWidth safely
    const line = obj as Line;
    if (line.strokeWidth && line.strokeWidth > 0.5) {
      largeGridLines.push(obj);
    } else {
      smallGridLines.push(obj);
    }
  });
  
  // Return the grid components
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers: [] // Empty for now
  };
}

/**
 * Render grid components
 * @param canvas The canvas
 * @param width Canvas width
 * @param height Canvas height
 * @returns The rendered grid components
 */
export function renderGridComponents(
  canvas: Canvas,
  width: number,
  height: number
) {
  // Use GRID_SPACING.DEFAULT as the cell size
  const cellSize = GRID_SPACING;
  
  return createCompleteGrid(canvas, width, height, cellSize);
}
