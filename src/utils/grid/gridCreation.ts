
/**
 * Grid creation utilities
 * Functions for creating and managing grid lines
 * @module grid/gridCreation
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { GRID_COLORS, SMALL_GRID_LINE_OPTIONS, LARGE_GRID_LINE_OPTIONS } from "../gridConstants";
import { GridRenderResult, GridLineOptions } from "./typeUtils";
import { 
  GRID_EXTENSION_FACTOR, 
  GRID_OFFSET_FACTOR,
  GRID_POSITIONING 
} from "./gridPositioningConstants";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { GRID_PERFORMANCE_THRESHOLDS } from "@/utils/gridConstants";

/**
 * Constants for grid creation
 */
export const GRID_CREATION_CONSTANTS = {
  /**
   * Minimum canvas width for rendering full grid
   * Below this width, grid density is reduced
   * @constant {number}
   */
  MIN_FULL_GRID_WIDTH: 500,
  
  /**
   * Minimum canvas height for rendering full grid
   * Below this height, grid density is reduced
   * @constant {number}
   */
  MIN_FULL_GRID_HEIGHT: 400,
  
  /**
   * Default grid line opacity
   * @constant {number}
   */
  DEFAULT_OPACITY: 0.9,
  
  /**
   * Maximum number of grid lines to create on each axis
   * Prevents excessive grid line creation that could impact performance
   * @constant {number}
   */
  MAX_GRID_LINES_PER_AXIS: 200
};

/**
 * Creates grid lines for the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {GridRenderResult} The created grid objects
 */
export const createGrid = (canvas: FabricCanvas): GridRenderResult => {
  if (!canvas) {
    console.error("Cannot create grid: Canvas is null or undefined");
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }

  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  if (!width || !height) {
    console.error("Cannot create grid: Invalid canvas dimensions", { width, height });
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }

  // Calculate grid dimensions based on canvas size
  const extendedWidth = width * GRID_EXTENSION_FACTOR;
  const extendedHeight = height * GRID_EXTENSION_FACTOR;
  
  // Set offsets for grid positioning
  const offsetX = (extendedWidth - width) / 2;
  const offsetY = (extendedHeight - height) / 2;
  
  // Performance optimization based on canvas size
  const skipSmallGrid = width * height > GRID_PERFORMANCE_THRESHOLDS.SKIP_SMALL_GRID;
  const reduceGridDensity = width * height > GRID_PERFORMANCE_THRESHOLDS.REDUCE_DENSITY_LEVEL_1;
  
  // Calculate step sizes based on canvas dimensions
  let smallGridStep = GRID_CONSTANTS.SMALL_GRID;
  let largeGridStep = GRID_CONSTANTS.LARGE_GRID;
  
  // Adjust grid density based on performance considerations
  if (reduceGridDensity) {
    smallGridStep *= 2;
  }
  
  const smallGridLines: Line[] = [];
  const largeGridLines: Line[] = [];
  const markers: any[] = [];
  
  // Create small grid lines (if not skipped for performance)
  if (!skipSmallGrid) {
    // Customize small grid options with objectType
    const smallGridOptions: GridLineOptions = {
      ...SMALL_GRID_LINE_OPTIONS,
      objectType: 'smallGridLine' // Add required objectType
    };
    
    // Horizontal small grid lines
    const maxSmallHorizontalLines = Math.min(
      Math.ceil(extendedHeight / smallGridStep),
      GRID_CREATION_CONSTANTS.MAX_GRID_LINES_PER_AXIS
    );
    
    for (let i = 0; i <= maxSmallHorizontalLines; i++) {
      const y = i * smallGridStep - offsetY;
      if (y < -GRID_POSITIONING.EDGE_MARGIN || y > height + GRID_POSITIONING.EDGE_MARGIN) continue;
      
      const line = new Line([0, y, width, y], smallGridOptions);
      smallGridLines.push(line);
    }
    
    // Vertical small grid lines
    const maxSmallVerticalLines = Math.min(
      Math.ceil(extendedWidth / smallGridStep),
      GRID_CREATION_CONSTANTS.MAX_GRID_LINES_PER_AXIS
    );
    
    for (let i = 0; i <= maxSmallVerticalLines; i++) {
      const x = i * smallGridStep - offsetX;
      if (x < -GRID_POSITIONING.EDGE_MARGIN || x > width + GRID_POSITIONING.EDGE_MARGIN) continue;
      
      const line = new Line([x, 0, x, height], smallGridOptions);
      smallGridLines.push(line);
    }
  }
  
  // Customize large grid options with objectType
  const largeGridOptions: GridLineOptions = {
    ...LARGE_GRID_LINE_OPTIONS,
    objectType: 'largeGridLine' // Add required objectType
  };
  
  // Horizontal large grid lines
  const maxLargeHorizontalLines = Math.min(
    Math.ceil(extendedHeight / largeGridStep),
    GRID_CREATION_CONSTANTS.MAX_GRID_LINES_PER_AXIS / 5
  );
  
  for (let i = 0; i <= maxLargeHorizontalLines; i++) {
    const y = i * largeGridStep - offsetY;
    if (y < -GRID_POSITIONING.EDGE_MARGIN || y > height + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([0, y, width, y], largeGridOptions);
    largeGridLines.push(line);
  }
  
  // Vertical large grid lines
  const maxLargeVerticalLines = Math.min(
    Math.ceil(extendedWidth / largeGridStep),
    GRID_CREATION_CONSTANTS.MAX_GRID_LINES_PER_AXIS / 5
  );
  
  for (let i = 0; i <= maxLargeVerticalLines; i++) {
    const x = i * largeGridStep - offsetX;
    if (x < -GRID_POSITIONING.EDGE_MARGIN || x > width + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([x, 0, x, height], largeGridOptions);
    largeGridLines.push(line);
  }
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  return {
    smallGridLines,
    largeGridLines,
    markers,
    gridObjects
  };
};

/**
 * Exports for backward compatibility
 */
export const createSmallScaleGrid = (canvas: FabricCanvas): Line[] => {
  const { smallGridLines } = createGrid(canvas);
  return smallGridLines;
};

export const createLargeScaleGrid = (canvas: FabricCanvas): Line[] => {
  const { largeGridLines } = createGrid(canvas);
  return largeGridLines;
};
