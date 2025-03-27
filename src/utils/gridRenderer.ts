
/**
 * Grid rendering utilities
 * Renders grid lines and markers on the canvas
 * @module gridRenderer
 */
import { Canvas as FabricCanvas, Line, Text } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { GRID_COLORS } from "@/utils/gridConstants";
import { GRID_POSITIONING, GRID_OFFSET_FACTOR } from "@/utils/grid/gridPositioningConstants";

/**
 * Result of grid rendering operation
 * @export
 */
export interface GridRenderResult {
  /** Small grid lines */
  smallGridLines: Line[];
  /** Large grid lines */
  largeGridLines: Line[];
  /** Grid markers */
  markers: any[];
  /** All grid objects */
  gridObjects: any[];
}

/**
 * Constants for grid rendering
 */
const GRID_RENDER_CONSTANTS = {
  /** Small grid render opacity */
  SMALL_GRID_OPACITY: 0.4,
  
  /** Large grid render opacity */
  LARGE_GRID_OPACITY: 0.6,
  
  /** Marker render opacity */
  MARKER_OPACITY: 0.8,
  
  /** Maximum number of small grid lines to render */
  MAX_SMALL_GRID_LINES: 500,
  
  /** Maximum number of large grid lines to render */
  MAX_LARGE_GRID_LINES: 100,
  
  /** Default grid line width factor */
  LINE_WIDTH_FACTOR: 0.5
};

/**
 * Renders the grid on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {GridRenderResult} Created grid components
 */
export const renderGrid = (canvas: FabricCanvas): GridRenderResult => {
  if (!canvas) {
    console.warn("Cannot render grid: canvas is null");
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  if (!width || !height) {
    console.warn("Cannot render grid: invalid canvas dimensions", { width, height });
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }

  // Calculate extended dimensions with offset
  const extendedWidth = width * GRID_OFFSET_FACTOR;
  const extendedHeight = height * GRID_OFFSET_FACTOR;
  
  // Determine grid offsets
  const offsetX = (extendedWidth - width) / 2;
  const offsetY = (extendedHeight - height) / 2;

  const smallGridLines: Line[] = [];
  const largeGridLines: Line[] = [];
  const markers: Text[] = [];
  
  // Create small grid lines
  const smallGridOptions = {
    stroke: GRID_COLORS.SMALL_GRID,
    strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'gridLine',
    objectCaching: false,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.SMALL_GRID_OPACITY
  };

  // Calculate grid extents
  const minX = -offsetX;
  const maxX = width + offsetX;
  const minY = -offsetY;
  const maxY = height + offsetY;
  
  // Horizontal small grid lines with limit
  const horizontalSmallLines = Math.min(
    Math.ceil(extendedHeight / GRID_CONSTANTS.SMALL_GRID_SIZE), 
    GRID_RENDER_CONSTANTS.MAX_SMALL_GRID_LINES
  );
  
  for (let i = 0; i <= horizontalSmallLines; i++) {
    const y = i * GRID_CONSTANTS.SMALL_GRID_SIZE - offsetY;
    if (y < -GRID_POSITIONING.EDGE_MARGIN || y > height + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([minX, y, maxX, y], smallGridOptions);
    line.set({ objectType: 'gridLine' });
    line.sendToBack();
    smallGridLines.push(line);
  }
  
  // Vertical small grid lines with limit
  const verticalSmallLines = Math.min(
    Math.ceil(extendedWidth / GRID_CONSTANTS.SMALL_GRID_SIZE),
    GRID_RENDER_CONSTANTS.MAX_SMALL_GRID_LINES
  );
  
  for (let i = 0; i <= verticalSmallLines; i++) {
    const x = i * GRID_CONSTANTS.SMALL_GRID_SIZE - offsetX;
    if (x < -GRID_POSITIONING.EDGE_MARGIN || x > width + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([x, minY, x, maxY], smallGridOptions);
    line.set({ objectType: 'gridLine' });
    line.sendToBack();
    smallGridLines.push(line);
  }
  
  // Create large grid lines
  const largeGridOptions = {
    stroke: GRID_COLORS.LARGE_GRID,
    strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'gridLine',
    objectCaching: false,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.LARGE_GRID_OPACITY
  };
  
  // Horizontal large grid lines with limit
  const horizontalLargeLines = Math.min(
    Math.ceil(extendedHeight / GRID_CONSTANTS.LARGE_GRID_SIZE),
    GRID_RENDER_CONSTANTS.MAX_LARGE_GRID_LINES
  );
  
  for (let i = 0; i <= horizontalLargeLines; i++) {
    const y = i * GRID_CONSTANTS.LARGE_GRID_SIZE - offsetY;
    if (y < -GRID_POSITIONING.EDGE_MARGIN || y > height + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([minX, y, maxX, y], largeGridOptions);
    line.set({ objectType: 'gridLine' });
    line.sendToBack();
    largeGridLines.push(line);
  }
  
  // Vertical large grid lines with limit
  const verticalLargeLines = Math.min(
    Math.ceil(extendedWidth / GRID_CONSTANTS.LARGE_GRID_SIZE),
    GRID_RENDER_CONSTANTS.MAX_LARGE_GRID_LINES
  );
  
  for (let i = 0; i <= verticalLargeLines; i++) {
    const x = i * GRID_CONSTANTS.LARGE_GRID_SIZE - offsetX;
    if (x < -GRID_POSITIONING.EDGE_MARGIN || x > width + GRID_POSITIONING.EDGE_MARGIN) continue;
    
    const line = new Line([x, minY, x, maxY], largeGridOptions);
    line.set({ objectType: 'gridLine' });
    line.sendToBack();
    largeGridLines.push(line);
  }

  // Combine all objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  // Send all grid objects to back for proper layering
  gridObjects.forEach(obj => {
    canvas.add(obj);
    obj.sendToBack && obj.sendToBack();
  });
  
  // Ensure grid is at the bottom layer
  canvas.renderAll();
  
  return {
    smallGridLines,
    largeGridLines,
    markers,
    gridObjects
  };
};

/**
 * Arranges grid objects on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @param {Line[]} gridObjects - Grid objects to arrange
 */
export const arrangeGridObjects = (canvas: FabricCanvas, gridObjects: any[]): void => {
  if (!canvas || !gridObjects?.length) return;
  
  // Send all grid elements to back
  gridObjects.forEach(obj => {
    if (obj && typeof obj.bringToFront === 'function') {
      obj.bringToFront();
    }
  });
  
  // Ensure canvas is updated
  canvas.renderAll();
};
