
/**
 * Grid creation utilities
 * Simple but reliable grid creation functions
 * @module utils/gridCreationUtils
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Create a basic emergency grid
 * Simplified grid creation for emergency fallback
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create emergency grid: Canvas has invalid dimensions");
    return [];
  }
  
  logger.info("Creating basic emergency grid");
  
  try {
    const gridSize = 20;
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    logger.info(`Created ${gridObjects.length} emergency grid objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create enhanced grid with major/minor lines
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createEnhancedGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create enhanced grid: Canvas has invalid dimensions");
    return [];
  }
  
  logger.info("Creating enhanced grid");
  
  try {
    const minorGridSize = 20;
    const majorGridSize = minorGridSize * 5;
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Create minor horizontal lines
    for (let i = 0; i <= height; i += minorGridSize) {
      // Skip major grid lines (will be drawn separately)
      if (i % majorGridSize === 0) continue;
      
      const line = new Line([0, i, width, i], {
        stroke: '#e6e6e6',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create minor vertical lines
    for (let i = 0; i <= width; i += minorGridSize) {
      // Skip major grid lines (will be drawn separately)
      if (i % majorGridSize === 0) continue;
      
      const line = new Line([i, 0, i, height], {
        stroke: '#e6e6e6',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create major horizontal lines
    for (let i = 0; i <= height; i += majorGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#c0c0c0',
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create major vertical lines
    for (let i = 0; i <= width; i += majorGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#c0c0c0',
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    logger.info(`Created ${gridObjects.length} enhanced grid objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating enhanced grid:", error);
    console.error("Error creating enhanced grid:", error);
    
    // Fall back to emergency grid
    return createBasicEmergencyGrid(canvas);
  }
};
