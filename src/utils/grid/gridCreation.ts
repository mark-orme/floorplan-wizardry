
/**
 * Grid creation utilities
 * Provides functions for creating grid lines and markers
 * @module utils/grid/gridCreation
 */
import { Canvas, Line, Text, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

/**
 * Creates small-scale grid lines (typically 10px spacing)
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @param {Object} options - Options for the grid lines
 * @returns {FabricObject[]} Array of created small grid objects
 */
export const createSmallScaleGrid = (
  canvas: Canvas,
  options: { color: string; width: number; selectable: boolean; type: string }
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || typeof canvas.getWidth !== "function") {
    logger.error("Invalid canvas provided to createSmallScaleGrid");
    return [];
  }
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
  
  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    const line = new Line([i, 0, i, height], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      metadata: { type: "grid", gridType: "small" }
    });
    
    gridObjects.push(line);
    canvas.add(line);
    canvas.sendObjectToBack(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    const line = new Line([0, i, width, i], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      metadata: { type: "grid", gridType: "small" }
    });
    
    gridObjects.push(line);
    canvas.add(line);
    canvas.sendObjectToBack(line);
  }
  
  return gridObjects;
};

/**
 * Creates large-scale grid lines (typically 50px spacing)
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @param {Object} options - Options for the grid lines
 * @returns {FabricObject[]} Array of created large grid objects
 */
export const createLargeScaleGrid = (
  canvas: Canvas,
  options: { color: string; width: number; selectable: boolean; type: string }
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || typeof canvas.getWidth !== "function") {
    logger.error("Invalid canvas provided to createLargeScaleGrid");
    return [];
  }
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
  
  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    const line = new Line([i, 0, i, height], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      metadata: { type: "grid", gridType: "large" }
    });
    
    // Add labels for large grid lines (metric measurements)
    if (i > 0) {
      const text = new Text(`${(i / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(1)}m`, {
        left: i,
        top: 5,
        fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        objectCaching: false,
        metadata: { type: "grid", gridType: "marker" }
      });
      
      gridObjects.push(text);
      canvas.add(text);
    }
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    const line = new Line([0, i, width, i], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectCaching: false,
      hoverCursor: "default",
      excludeFromExport: true,
      metadata: { type: "grid", gridType: "large" }
    });
    
    // Add labels for large grid lines (metric measurements)
    if (i > 0) {
      const text = new Text(`${(i / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(1)}m`, {
        left: 5,
        top: i,
        fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false,
        objectCaching: false,
        metadata: { type: "grid", gridType: "marker" }
      });
      
      gridObjects.push(text);
      canvas.add(text);
    }
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  return gridObjects;
};

/**
 * Creates a complete grid with both small and large scale lines
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Array of all created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas
): FabricObject[] => {
  if (!canvas) {
    logger.error("Invalid canvas provided to createCompleteGrid");
    return [];
  }
  
  // Create small grid lines
  const smallGridObjects = createSmallScaleGrid(canvas, {
    color: GRID_CONSTANTS.SMALL_GRID_COLOR,
    width: GRID_CONSTANTS.SMALL_GRID_WIDTH,
    selectable: false,
    type: 'small'
  });
  
  // Create large grid lines
  const largeGridObjects = createLargeScaleGrid(canvas, {
    color: GRID_CONSTANTS.LARGE_GRID_COLOR,
    width: GRID_CONSTANTS.LARGE_GRID_WIDTH,
    selectable: false,
    type: 'large'
  });
  
  // Combine all grid objects
  const allGridObjects = [...smallGridObjects, ...largeGridObjects];
  
  // Request render to ensure grid is visible
  canvas.renderAll();
  
  return allGridObjects;
};
