
/**
 * Grid creation utilities
 * @module gridCreation
 */
import { Canvas, Object as FabricObject, Line as FabricLine, Text as FabricText } from "fabric";
import { Point } from "@/types/core/Point";

/**
 * Options for grid creation
 */
export interface GridLineOptions {
  /** Grid line color */
  color: string;
  /** Grid line width */
  width: number;
  /** Whether grid lines are selectable */
  selectable: boolean;
  /** Grid line type (small, large, axis) */
  type: 'small' | 'large' | 'axis' | 'marker';
}

/**
 * Grid render result type
 */
export interface GridRenderResult {
  /** All grid objects */
  gridObjects: FabricObject[];
  /** Small grid lines */
  smallGridLines: FabricObject[];
  /** Large grid lines */
  largeGridLines: FabricObject[];
  /** Grid markers */
  markers: FabricObject[];
}

/**
 * Create small scale grid
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {GridLineOptions} options - Grid line options
 * @returns {FabricObject[]} Created grid lines
 */
export function createSmallScaleGrid(
  canvas: Canvas,
  options: GridLineOptions
): FabricObject[] {
  const gridLines: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const spacing = 10;
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const line = new FabricLine([0, y, width, y], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const line = new FabricLine([x, 0, x, height], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    gridLines.push(line);
    canvas.add(line);
  }
  
  return gridLines;
}

/**
 * Create large scale grid
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {GridLineOptions} options - Grid line options
 * @returns {FabricObject[]} Created grid lines
 */
export function createLargeScaleGrid(
  canvas: Canvas,
  options: GridLineOptions
): FabricObject[] {
  const gridLines: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const spacing = 50;
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const line = new FabricLine([0, y, width, y], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const line = new FabricLine([x, 0, x, height], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    gridLines.push(line);
    canvas.add(line);
  }
  
  return gridLines;
}

/**
 * Create grid markers
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {GridLineOptions} options - Grid marker options
 * @returns {FabricObject[]} Created grid markers
 */
export function createGridMarkers(
  canvas: Canvas,
  options: GridLineOptions
): FabricObject[] {
  const markers: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const spacing = 50;
  
  // Create X-axis markers
  for (let x = spacing; x < width; x += spacing) {
    const text = new FabricText(String(x), {
      left: x,
      top: 5,
      fontSize: 8,
      fill: options.color,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    markers.push(text);
    canvas.add(text);
  }
  
  // Create Y-axis markers
  for (let y = spacing; y < height; y += spacing) {
    const text = new FabricText(String(y), {
      left: 5,
      top: y,
      fontSize: 8,
      fill: options.color,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    markers.push(text);
    canvas.add(text);
  }
  
  return markers;
}
