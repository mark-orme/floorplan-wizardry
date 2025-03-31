
/**
 * Canvas grid utilities
 * @module utils/canvasGrid
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";

/**
 * Grid options interface
 */
export interface GridOptions {
  /** Grid size in pixels */
  size?: number;
  /** Grid stroke color */
  stroke?: string;
  /** Grid stroke width */
  strokeWidth?: number;
  /** Whether to show major lines */
  showMajorLines?: boolean;
  /** Major line stroke color */
  majorStroke?: string;
  /** Major line stroke width */
  majorStrokeWidth?: number;
  /** Major line interval */
  majorInterval?: number;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Default grid options
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  size: 20,
  stroke: "#e0e0e0",
  strokeWidth: 1,
  showMajorLines: true,
  majorStroke: "#c0c0c0",
  majorStrokeWidth: 1,
  majorInterval: 5
};

/**
 * Create a grid on the canvas
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @param {GridOptions} options - Grid options
 * @returns {FabricObject[]} Created grid objects
 */
export const createGrid = (
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] => {
  // Merge default options with provided options
  const gridOptions = { ...DEFAULT_GRID_OPTIONS, ...options };
  
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Invalid canvas for grid creation");
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const { 
    size, 
    stroke, 
    strokeWidth, 
    showMajorLines, 
    majorStroke, 
    majorStrokeWidth,
    majorInterval
  } = gridOptions;
  
  // Calculate grid dimensions
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal grid lines
  for (let i = 0; i <= height; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([0, i, width, i], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectCaching: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= width; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([i, 0, i, height], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectCaching: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Render the canvas to show grid
  if (gridOptions.debug) {
    console.log(`Created grid with ${gridObjects.length} objects`);
  }
  
  canvas.renderAll();
  return gridObjects;
};
