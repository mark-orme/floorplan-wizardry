
/**
 * Grid creation utility
 * @module utils/grid/createGridElements
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import logger from "@/utils/logger";

interface GridOptions {
  smallGridSpacing?: number;
  largeGridSpacing?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
}

const DEFAULT_OPTIONS: GridOptions = {
  smallGridSpacing: 20,
  largeGridSpacing: 100,
  smallGridColor: '#e5e5e5',
  largeGridColor: '#cccccc',
  smallGridWidth: 0.5,
  largeGridWidth: 1
};

/**
 * Create grid elements on canvas
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {GridOptions} options - Grid options
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridElements = (
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create grid: Invalid canvas dimensions");
    return [];
  }
  
  // Merge options with defaults
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.getWidth ? canvas.getWidth() : canvas.width;
    const height = canvas.getHeight ? canvas.getHeight() : canvas.height;
    
    // Create small grid lines
    for (let y = 0; y <= height; y += config.smallGridSpacing!) {
      // Skip lines that will be covered by large grid lines
      if (y % config.largeGridSpacing! === 0) continue;
      
      const line = new Line([0, y, width, y], {
        stroke: config.smallGridColor,
        strokeWidth: config.smallGridWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += config.smallGridSpacing!) {
      // Skip lines that will be covered by large grid lines
      if (x % config.largeGridSpacing! === 0) continue;
      
      const line = new Line([x, 0, x, height], {
        stroke: config.smallGridColor,
        strokeWidth: config.smallGridWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectType: 'grid',
        gridType: 'small'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let y = 0; y <= height; y += config.largeGridSpacing!) {
      const line = new Line([0, y, width, y], {
        stroke: config.largeGridColor,
        strokeWidth: config.largeGridWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += config.largeGridSpacing!) {
      const line = new Line([x, 0, x, height], {
        stroke: config.largeGridColor,
        strokeWidth: config.largeGridWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        objectType: 'grid',
        gridType: 'large'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Force render all
    canvas.requestRenderAll();
    
    logger.info(`Created ${gridObjects.length} grid elements`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid elements:", error);
    return [];
  }
};
