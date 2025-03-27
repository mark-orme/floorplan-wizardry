
import { Canvas, Line, Text, Object as FabricObject } from "fabric";
import { 
  SMALL_GRID_SPACING, 
  LARGE_GRID_SPACING, 
  GRID_EXTENSION_FACTOR,
  MAX_SMALL_GRID_LINES,
  MAX_LARGE_GRID_LINES
} from "@/constants/numerics";
import { 
  SMALL_GRID_LINE_OPTIONS,
  LARGE_GRID_LINE_OPTIONS,
  MARKER_TEXT_OPTIONS
} from "@/utils/gridConstants";

/**
 * Grid dimensions type
 */
export interface GridDimensions {
  width: number;
  height: number;
  cellSize: number;
}

/**
 * Grid render result type
 */
export interface GridRenderResult {
  gridObjects: FabricObject[];
  smallGridLines: Line[];
  largeGridLines: Line[];
  markers: Text[];
}

/**
 * Calculate grid dimensions based on canvas size
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Cell size (optional, defaults to 20)
 * @returns Grid dimensions
 */
export const calculateGridDimensions = (
  width: number, 
  height: number, 
  cellSize: number = 20
): GridDimensions => {
  return { width, height, cellSize };
};

/**
 * Creates grid lines based on dimensions
 * @param canvas Fabric canvas instance
 * @param dimensions Grid dimensions
 * @returns Array of grid lines
 */
export const createGridLines = (
  canvas: Canvas,
  dimensions: GridDimensions
): Line[] => {
  const gridObjects: Line[] = [];
  const { width, height, cellSize } = dimensions;
  
  // Create horizontal grid lines
  for (let y = 0; y <= height; y += cellSize) {
    const gridLine = new Line([0, y, width, y], {
      stroke: "#DDDDDD",
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectType: 'grid'
    });
    gridObjects.push(gridLine);
    canvas.add(gridLine);
  }
  
  // Create vertical grid lines
  for (let x = 0; x <= width; x += cellSize) {
    const gridLine = new Line([x, 0, x, height], {
      stroke: "#DDDDDD",
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectType: 'grid'
    });
    gridObjects.push(gridLine);
    canvas.add(gridLine);
  }
  
  return gridObjects;
};

/**
 * Creates small grid lines
 * @param canvas Fabric canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @returns Array of small grid lines
 */
export const createSmallGridLines = (
  canvas: Canvas,
  width: number,
  height: number
): Line[] => {
  const smallGridLines: Line[] = [];
  let gridCount = 0;
  
  // Create vertical small grid lines
  for (let x = 0; x <= width && gridCount < MAX_SMALL_GRID_LINES; x += SMALL_GRID_SPACING) {
    // Skip positions that would be created by large grid lines
    if (x % LARGE_GRID_SPACING === 0) continue;
    
    const smallGridLine = new Line([x, 0, x, height], SMALL_GRID_LINE_OPTIONS);
    smallGridLines.push(smallGridLine);
    canvas.add(smallGridLine);
    gridCount++;
  }
  
  // Create horizontal small grid lines
  for (let y = 0; y <= height && gridCount < MAX_SMALL_GRID_LINES * 2; y += SMALL_GRID_SPACING) {
    // Skip positions that would be created by large grid lines
    if (y % LARGE_GRID_SPACING === 0) continue;
    
    const smallGridLine = new Line([0, y, width, y], SMALL_GRID_LINE_OPTIONS);
    smallGridLines.push(smallGridLine);
    canvas.add(smallGridLine);
    gridCount++;
  }
  
  return smallGridLines;
};

/**
 * Creates large grid lines
 * @param canvas Fabric canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @returns Array of large grid lines
 */
export const createLargeGridLines = (
  canvas: Canvas,
  width: number,
  height: number
): Line[] => {
  const largeGridLines: Line[] = [];
  let gridCount = 0;
  
  // Create vertical large grid lines
  for (let x = 0; x <= width && gridCount < MAX_LARGE_GRID_LINES; x += LARGE_GRID_SPACING) {
    const largeGridLine = new Line([x, 0, x, height], LARGE_GRID_LINE_OPTIONS);
    largeGridLines.push(largeGridLine);
    canvas.add(largeGridLine);
    gridCount++;
  }
  
  // Create horizontal large grid lines
  for (let y = 0; y <= height && gridCount < MAX_LARGE_GRID_LINES * 2; y += LARGE_GRID_SPACING) {
    const largeGridLine = new Line([0, y, width, y], LARGE_GRID_LINE_OPTIONS);
    largeGridLines.push(largeGridLine);
    canvas.add(largeGridLine);
    gridCount++;
  }
  
  return largeGridLines;
};

/**
 * Creates text markers for the grid
 * @param canvas Fabric canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @returns Array of marker text objects
 */
export const createGridMarkers = (
  canvas: Canvas,
  width: number,
  height: number
): Text[] => {
  const markers: Text[] = [];
  
  // Create X-axis markers
  for (let x = LARGE_GRID_SPACING; x <= width; x += LARGE_GRID_SPACING) {
    const text = new Text(`${x / LARGE_GRID_SPACING}m`, {
      ...MARKER_TEXT_OPTIONS,
      left: x,
      top: 5
    });
    markers.push(text);
    canvas.add(text);
  }
  
  // Create Y-axis markers
  for (let y = LARGE_GRID_SPACING; y <= height; y += LARGE_GRID_SPACING) {
    const text = new Text(`${y / LARGE_GRID_SPACING}m`, {
      ...MARKER_TEXT_OPTIONS,
      left: 5,
      top: y
    });
    markers.push(text);
    canvas.add(text);
  }
  
  return markers;
};

/**
 * Create a complete grid with small lines, large lines, and markers
 * @param canvas Fabric canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Cell size
 * @returns Grid render result
 */
export const createCompleteGrid = (
  canvas: Canvas,
  width: number,
  height: number,
  cellSize: number = SMALL_GRID_SPACING
): GridRenderResult => {
  // Create small grid lines
  const smallGridLines = createSmallGridLines(canvas, width, height);
  
  // Create large grid lines
  const largeGridLines = createLargeGridLines(canvas, width, height);
  
  // Create grid markers
  const markers = createGridMarkers(canvas, width, height);
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers
  };
};

/**
 * Render grid components on canvas
 * @param canvas Fabric canvas instance
 * @param width Canvas width
 * @param height Canvas height
 * @returns Grid render result
 */
export const renderGridComponents = (
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult => {
  return createCompleteGrid(canvas, width, height);
};

/**
 * Check if an object is a grid object
 * @param obj Fabric object
 * @returns True if the object is a grid object
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};
