
/**
 * Emergency grid utilities for handling grid failure recovery
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "./logger";

// Typings for grid creation parameters
interface EmergencyGridOptions {
  width: number;
  height: number;
  smallGridSize: number;
  largeGridSize: number;
  smallGridColor: string;
  largeGridColor: string;
  smallGridOpacity: number;
  largeGridOpacity: number;
  showMarkers: boolean;
}

/**
 * Create a fallback grid when the primary grid creation fails
 * Uses a simplified approach to ensure at least basic grid appears
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {EmergencyGridOptions} options - Grid creation options
 * @returns {FabricObject[]} Created grid objects
 */
export const createEmergencyGrid = (
  canvas: FabricCanvas, 
  options: Partial<EmergencyGridOptions> = {}
): FabricObject[] => {
  if (!canvas) {
    logger.error("Emergency grid creation failed: Canvas is null");
    return [];
  }

  try {
    logger.warn("Using emergency grid creation as fallback");
    
    // Default options
    const {
      width = canvas.width || 1000,
      height = canvas.height || 800,
      smallGridSize = 20,
      largeGridSize = 100,
      smallGridColor = "rgba(200,200,200,0.3)",
      largeGridColor = "rgba(100,100,100,0.6)",
      smallGridOpacity = 0.3,
      largeGridOpacity = 0.6,
      showMarkers = true
    } = options;
    
    const gridObjects: FabricObject[] = [];
    
    // Create large grid lines (primary lines)
    for (let i = 0; i <= width; i += largeGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text markers at major grid lines
      if (showMarkers && i > 0) {
        const text = new Text(`${i / 100}m`, {
          left: i,
          top: 10,
          fontSize: 12,
          fill: largeGridColor,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        gridObjects.push(text);
        canvas.add(text);
      }
    }
    
    for (let i = 0; i <= height; i += largeGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        opacity: largeGridOpacity,
        strokeWidth: 1,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text markers at major grid lines
      if (showMarkers && i > 0) {
        const text = new Text(`${i / 100}m`, {
          left: 10,
          top: i,
          fontSize: 12,
          fill: largeGridColor,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        gridObjects.push(text);
        canvas.add(text);
      }
    }
    
    // Create small grid lines (less important, for fine measurements)
    // Only add a limited number for performance
    const maxSmallLines = 100; // Limit to prevent performance issues
    let smallLinesAdded = 0;
    
    for (let i = 0; i <= width && smallLinesAdded < maxSmallLines; i += smallGridSize) {
      // Skip if this is already a large grid line
      if (i % largeGridSize === 0) continue;
      
      const line = new Line([i, 0, i, height], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity,
        strokeWidth: 0.5,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      smallLinesAdded++;
    }
    
    for (let i = 0; i <= height && smallLinesAdded < maxSmallLines; i += smallGridSize) {
      // Skip if this is already a large grid line
      if (i % largeGridSize === 0) continue;
      
      const line = new Line([0, i, width, i], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        opacity: smallGridOpacity,
        strokeWidth: 0.5,
        objectCaching: false
      });
      gridObjects.push(line);
      canvas.add(line);
      smallLinesAdded++;
    }
    
    logger.info(`Emergency grid created with ${gridObjects.length} objects (${smallLinesAdded} small lines)`);
    
    // Force redraw
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Emergency grid creation failed with error:", error);
    return [];
  }
};
