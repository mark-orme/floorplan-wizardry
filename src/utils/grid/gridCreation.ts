
/**
 * Grid creation utilities
 * @module grid/gridCreation
 */
import { Canvas, Line } from 'fabric';
import { 
  GRID_SPACING, 
  SMALL_GRID, 
  LARGE_GRID 
} from '@/constants/numerics';
import { EXTENSION_FACTOR, EDGE_MARGIN } from './gridPositioningConstants';
import { GridLineOptions } from './typeUtils';

/**
 * Constants for grid creation
 */
const GRID_CREATION_CONSTANTS = {
  /** Default canvas width */
  DEFAULT_CANVAS_WIDTH: 800,
  /** Default canvas height */
  DEFAULT_CANVAS_HEIGHT: 600,
  /** Default small grid opacity */
  SMALL_GRID_OPACITY: 0.3,
  /** Default large grid opacity */
  LARGE_GRID_OPACITY: 0.5,
  /** Default small grid stroke width */
  SMALL_GRID_STROKE_WIDTH: 0.5,
  /** Default large grid stroke width */
  LARGE_GRID_STROKE_WIDTH: 1,
  /** Default small grid color */
  SMALL_GRID_COLOR: '#DDDDDD',
  /** Default large grid color */
  LARGE_GRID_COLOR: '#AAAAAA'
};

/**
 * Creates a grid of lines on the canvas
 * 
 * @param {Canvas} canvas - The Fabric.js canvas
 * @param {object} options - Grid creation options
 * @returns {Array} All created grid objects
 */
export const createGrid = (
  canvas: Canvas, 
  options: {
    width?: number;
    height?: number;
    smallGridSize?: number;
    largeGridSize?: number;
  } = {}
): FabricObject[] => {
  if (!canvas) {
    console.error('Invalid canvas for grid creation');
    return [];
  }
  
  // Use provided dimensions or default to canvas size
  const width = options.width || GRID_CREATION_CONSTANTS.DEFAULT_CANVAS_WIDTH;
  const height = options.height || GRID_CREATION_CONSTANTS.DEFAULT_CANVAS_HEIGHT;
  
  // Expanded dimensions to ensure grid extends beyond edges
  const expandedWidth = width * EXTENSION_FACTOR;
  const expandedHeight = height * EXTENSION_FACTOR;
  
  // Grid sizes
  const smallGridSize = options.smallGridSize || SMALL_GRID;
  const largeGridSize = options.largeGridSize || LARGE_GRID;
  
  const gridObjects: FabricObject[] = [];
  
  // Create small grid lines
  const createSmallGridLines = (
    gridSize: number, 
    width: number, 
    height: number
  ): Line[] => {
    const lines: Line[] = [];
    const options: GridLineOptions = {
      stroke: GRID_CREATION_CONSTANTS.SMALL_GRID_COLOR,
      selectable: false,
      evented: false,
      strokeWidth: GRID_CREATION_CONSTANTS.SMALL_GRID_STROKE_WIDTH,
      objectCaching: false,
      hoverCursor: 'default',
      opacity: GRID_CREATION_CONSTANTS.SMALL_GRID_OPACITY,
      objectType: 'grid-small'
    };
    
    // Vertical lines
    for (let i = 0; i <= expandedWidth; i += gridSize) {
      const line = new Line([i, -EDGE_MARGIN, i, expandedHeight + EDGE_MARGIN], options);
      lines.push(line);
      canvas.add(line);
      line.moveTo(-1); // Move to bottom layer
    }
    
    // Horizontal lines
    for (let i = 0; i <= expandedHeight; i += gridSize) {
      const line = new Line([-EDGE_MARGIN, i, expandedWidth + EDGE_MARGIN, i], options);
      lines.push(line);
      canvas.add(line);
      line.moveTo(-1); // Move to bottom layer
    }
    
    return lines;
  };
  
  // Create large grid lines
  const createLargeGridLines = (
    gridSize: number, 
    width: number, 
    height: number
  ): Line[] => {
    const lines: Line[] = [];
    const options: GridLineOptions = {
      stroke: GRID_CREATION_CONSTANTS.LARGE_GRID_COLOR,
      selectable: false,
      evented: false,
      strokeWidth: GRID_CREATION_CONSTANTS.LARGE_GRID_STROKE_WIDTH,
      objectCaching: false,
      hoverCursor: 'default',
      opacity: GRID_CREATION_CONSTANTS.LARGE_GRID_OPACITY,
      objectType: 'grid-large'
    };
    
    // Vertical lines
    for (let i = 0; i <= expandedWidth; i += gridSize) {
      const line = new Line([i, -EDGE_MARGIN, i, expandedHeight + EDGE_MARGIN], options);
      lines.push(line);
      canvas.add(line);
      line.moveTo(0); // Above small grid lines
    }
    
    // Horizontal lines
    for (let i = 0; i <= expandedHeight; i += gridSize) {
      const line = new Line([-EDGE_MARGIN, i, expandedWidth + EDGE_MARGIN, i], options);
      lines.push(line);
      canvas.add(line);
      line.moveTo(0); // Above small grid lines
    }
    
    return lines;
  };
  
  // Create the grid
  const smallGridLines = createSmallGridLines(smallGridSize, width, height);
  const largeGridLines = createLargeGridLines(largeGridSize, width, height);
  
  // Add all lines to the gridObjects array
  gridObjects.push(...smallGridLines, ...largeGridLines);
  
  // Render the canvas
  canvas.renderAll();
  
  return gridObjects;
};

// Type for fabric objects returned by createGrid
type FabricObject = Line;
