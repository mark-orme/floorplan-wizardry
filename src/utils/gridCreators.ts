
/**
 * Grid creator utility functions
 * @module utils/gridCreators
 */
import { Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';

// Constants for grid appearance
const MAX_SMALL_GRID_LINES = 1000;
const MAX_LARGE_GRID_LINES = 200;
const GRID_EXTENSION_FACTOR = 1.2;
const SMALL_GRID = GRID_SPACING.SMALL;
const LARGE_GRID = GRID_SPACING.LARGE;

// Line styles
const SMALL_GRID_STYLE = {
  COLOR: '#eeeeee',
  WIDTH: 0.5
};

const LARGE_GRID_STYLE = {
  COLOR: '#dddddd',
  WIDTH: 1.0
};

/**
 * Create small grid lines
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of small grid lines
 */
export const createSmallGridLines = (width: number, height: number) => {
  const lines = [];
  const gridSize = SMALL_GRID;
  
  // Extended dimensions for better panning
  const extendedWidth = width * GRID_EXTENSION_FACTOR;
  const extendedHeight = height * GRID_EXTENSION_FACTOR;
  
  // Offset for centering extended grid
  const offsetX = (extendedWidth - width) / 2;
  const offsetY = (extendedHeight - height) / 2;
  
  // Calculate grid range
  const startX = -offsetX;
  const startY = -offsetY;
  const endX = width + offsetX;
  const endY = height + offsetY;
  
  // Create vertical lines
  let count = 0;
  for (let x = startX; x <= endX && count < MAX_SMALL_GRID_LINES; x += gridSize) {
    count++;
    const roundedX = Math.round(x * 100) / 100; // Fix floating point issues
    
    const line = new Line([roundedX, startY, roundedX, endY], {
      stroke: SMALL_GRID_STYLE.COLOR,
      strokeWidth: SMALL_GRID_STYLE.WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    lines.push(line);
  }
  
  // Create horizontal lines
  for (let y = startY; y <= endY && count < MAX_SMALL_GRID_LINES; y += gridSize) {
    count++;
    const roundedY = Math.round(y * 100) / 100; // Fix floating point issues
    
    const line = new Line([startX, roundedY, endX, roundedY], {
      stroke: SMALL_GRID_STYLE.COLOR,
      strokeWidth: SMALL_GRID_STYLE.WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    lines.push(line);
  }
  
  return lines;
};

/**
 * Create large grid lines
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of large grid lines
 */
export const createLargeGridLines = (width: number, height: number) => {
  const lines = [];
  const gridSize = LARGE_GRID;
  
  // Extended dimensions for better panning
  const extendedWidth = width * GRID_EXTENSION_FACTOR;
  const extendedHeight = height * GRID_EXTENSION_FACTOR;
  
  // Offset for centering extended grid
  const offsetX = (extendedWidth - width) / 2;
  const offsetY = (extendedHeight - height) / 2;
  
  // Calculate grid range
  const startX = -offsetX;
  const startY = -offsetY;
  const endX = width + offsetX;
  const endY = height + offsetY;
  
  // Create vertical lines
  let count = 0;
  for (let x = startX; x <= endX && count < MAX_LARGE_GRID_LINES; x += gridSize) {
    count++;
    const roundedX = Math.round(x * 100) / 100; // Fix floating point issues
    
    const line = new Line([roundedX, startY, roundedX, endY], {
      stroke: LARGE_GRID_STYLE.COLOR,
      strokeWidth: LARGE_GRID_STYLE.WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    lines.push(line);
  }
  
  // Create horizontal lines
  for (let y = startY; y <= endY && count < MAX_LARGE_GRID_LINES; y += gridSize) {
    count++;
    const roundedY = Math.round(y * 100) / 100; // Fix floating point issues
    
    const line = new Line([startX, roundedY, endX, roundedY], {
      stroke: LARGE_GRID_STYLE.COLOR,
      strokeWidth: LARGE_GRID_STYLE.WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    lines.push(line);
  }
  
  return lines;
};
