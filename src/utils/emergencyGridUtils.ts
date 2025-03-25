
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
    console.log("Creating emergency basic grid");
  }
  
  const emergencyGrid: any[] = [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Create a simple grid with just a few lines
    for (let x = 0; x <= width; x += 100) {
      const line = new Line([x, 0, x, height], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: x % 500 === 0 ? 1.5 : 0.5
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    for (let y = 0; y <= height; y += 100) {
      const line = new Line([0, y, width, y], {
        stroke: '#CCDDEE',
        selectable: false,
        evented: false,
        strokeWidth: y % 500 === 0 ? 1.5 : 0.5
      });
      canvas.add(line);
      emergencyGrid.push(line);
    }
    
    // Add a scale marker
    const markerLine = new Line([width - 120, height - 30, width - 20, height - 30], {
      stroke: "#000000",
      strokeWidth: 3,
      selectable: false,
      evented: false
    });
    canvas.add(markerLine);
    emergencyGrid.push(markerLine);
    
    const markerText = new Text("1m", {
      left: width - 70,
      top: height - 45,
      fontSize: 16,
      fontWeight: 'bold',
      fill: "#000000",
      selectable: false,
      evented: false
    });
    canvas.add(markerText);
    emergencyGrid.push(markerText);
    
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
