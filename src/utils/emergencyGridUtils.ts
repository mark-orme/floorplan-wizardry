
/**
 * Emergency grid creation utilities
 * Provides fallback methods for grid creation when normal methods fail
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Line, Text } from "fabric";
import logger from "./logger";

/**
 * Create a very basic emergency grid when all else fails
 * This is a simplified grid with minimal objects to ensure something is visible
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {FabricObject[]} Simple emergency grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<any[]>
): any[] => {
  logger.info("Creating emergency basic grid");
  
  const emergencyGrid: any[] = [];
  
  try {
    // Clear any existing grid objects first
    if (gridLayerRef?.current?.length) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Use actual canvas dimensions or fallback to reasonable defaults
    const width = Math.max(canvas.width || 800, 1200);
    const height = Math.max(canvas.height || 600, 950);
    
    // Extend the grid beyond canvas boundaries - much larger extension
    const extensionFactor = 4.0;
    const extendedWidth = width * extensionFactor;
    const extendedHeight = height * extensionFactor;
    
    // Start grid further outside the viewport for better panning
    const startX = -width * (extensionFactor - 1) / 2;
    const startY = -height * (extensionFactor - 1) / 2;
    const endX = width * extensionFactor / 2;
    const endY = height * extensionFactor / 2;
    
    // Create a more dense grid with appropriate spacing
    const smallGridSpacing = 100; // 100px between small grid lines
    const largeGridSpacing = 500; // 500px between large grid lines
    
    // Create small grid lines (light blue)
    for (let x = startX; x <= endX; x += smallGridSpacing) {
      const line = new Line([x, startY, x, endY], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        objectCaching: true
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    for (let y = startY; y <= endY; y += smallGridSpacing) {
      const line = new Line([startX, y, endX, y], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        objectCaching: true
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    // Create large grid lines (darker blue)
    for (let x = startX; x <= endX; x += largeGridSpacing) {
      const line = new Line([x, startY, x, endY], {
        stroke: '#4090CC',
        selectable: false,
        evented: false,
        strokeWidth: 1.2,
        objectCaching: true
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    for (let y = startY; y <= endY; y += largeGridSpacing) {
      const line = new Line([startX, y, endX, y], {
        stroke: '#4090CC',
        selectable: false,
        evented: false,
        strokeWidth: 1.2,
        objectCaching: true
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    // Force a render to ensure grid is visible
    canvas.requestRenderAll();
    
    // Update the grid layer ref if provided
    if (gridLayerRef) {
      gridLayerRef.current = emergencyGrid;
    }
    
    logger.info(`Created emergency grid with ${emergencyGrid.length} lines`);
    return emergencyGrid;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Perform a quick validation of the canvas before creating emergency grid
 * @param {FabricCanvas} canvas - The canvas to check
 * @returns {boolean} Whether the canvas is valid
 */
export const validateCanvasForEmergencyGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  // Basic validation of canvas properties
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    logger.warn("Invalid canvas dimensions for emergency grid");
    return false;
  }
  
  return true;
};
