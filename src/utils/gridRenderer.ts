
/**
 * Grid rendering utilities
 * Handles creation and management of grid lines and markers
 * @module gridRenderer
 */
import { Canvas, Line, Text, Object as FabricObject } from 'fabric';
import { GridDimensions, GridRenderResult } from '@/types/fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Create a grid on the canvas
 * @param {Canvas} canvas - Fabric.js canvas
 * @param {GridDimensions} dimensions - Grid dimensions
 * @returns {GridRenderResult} The created grid objects
 */
export function createGrid(canvas: Canvas, dimensions: GridDimensions): GridRenderResult {
  const { width, height, cellSize } = dimensions;
  
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  const markers: FabricObject[] = [];
  
  // Create small grid lines
  for (let i = 0; i <= width; i += cellSize) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      strokeDashArray: [1, 2],
      objectCaching: false
    });
    
    smallGridLines.push(line);
    canvas.add(line);
  }
  
  for (let i = 0; i <= height; i += cellSize) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      strokeDashArray: [1, 2],
      objectCaching: false
    });
    
    smallGridLines.push(line);
    canvas.add(line);
  }
  
  // Create large grid lines (every 5 small cells)
  const largeGridSize = cellSize * 5;
  
  for (let i = 0; i <= width; i += largeGridSize) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    
    largeGridLines.push(line);
    canvas.add(line);
    
    // Add marker text
    if (i > 0) {
      const text = new Text(String(i / GRID_CONSTANTS.PIXELS_PER_METER), {
        left: i + 5,
        top: 5,
        fontSize: 10,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        objectCaching: true
      });
      
      markers.push(text);
      canvas.add(text);
    }
  }
  
  for (let i = 0; i <= height; i += largeGridSize) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    
    largeGridLines.push(line);
    canvas.add(line);
    
    // Add marker text
    if (i > 0) {
      const text = new Text(String(i / GRID_CONSTANTS.PIXELS_PER_METER), {
        left: 5,
        top: i + 5,
        fontSize: 10,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        objectCaching: true
      });
      
      markers.push(text);
      canvas.add(text);
    }
  }
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers
  };
}
