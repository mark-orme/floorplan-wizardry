
/**
 * Emergency grid creation utilities
 * Provides fallback methods for grid creation when normal methods fail
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Line, Text } from "fabric";

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
  if (process.env.NODE_ENV === 'development') {
    console.log("Creating emergency basic grid - silently");
  }
  
  const emergencyGrid: any[] = [];
  
  try {
    const width = Math.max(canvas.width || 800, 1200);
    const height = Math.max(canvas.height || 600, 950);
    
    // Extend the grid beyond canvas boundaries - much larger extension
    const extensionFactor = 4.0; // Increased from 1.5 to 4.0
    const extendedWidth = width * extensionFactor;
    const extendedHeight = height * extensionFactor;
    
    // Start grid further outside the viewport for better panning
    const startX = -width * (extensionFactor - 1) / 2;
    const startY = -height * (extensionFactor - 1) / 2;
    const endX = width * extensionFactor / 2;
    const endY = height * extensionFactor / 2;
    
    // Create a more dense grid with smaller intervals
    const smallGridSpacing = 50; // 50px between small grid lines
    const largeGridSpacing = 100; // 100px between large grid lines
    
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
    
    canvas.requestRenderAll();
    
    // Update the grid layer ref if provided
    if (gridLayerRef) {
      if (!gridLayerRef.current) {
        gridLayerRef.current = [];
      }
      gridLayerRef.current = emergencyGrid;
    }
    
    return emergencyGrid;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating emergency grid:", error);
    }
    return [];
  }
};
