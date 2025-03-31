
/**
 * Simple and reliable grid creator utility
 * Focused on creating a grid that works consistently
 * @module utils/grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import logger from "@/utils/logger";

/**
 * Create a reliable grid on canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<any[]>} gridObjectsRef - Reference to store grid objects
 * @returns {any[]} Array of created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridObjectsRef: React.MutableRefObject<any[]>
): any[] => {
  try {
    // Safety check for canvas dimensions
    if (!canvas.width || !canvas.height) {
      logger.error("Cannot create grid: Canvas has no dimensions");
      return [];
    }
    
    // Clear any existing grid objects
    const existingGridObjects = gridObjectsRef.current;
    if (existingGridObjects.length > 0) {
      logger.info(`Clearing ${existingGridObjects.length} existing grid objects`);
      
      existingGridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      gridObjectsRef.current = [];
    }
    
    // Create grid
    const gridSize = 20;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const gridLines: any[] = [];
    
    // Calculate visible area
    const horizontalLines = Math.ceil(canvasHeight / gridSize);
    const verticalLines = Math.ceil(canvasWidth / gridSize);
    
    logger.info(`Creating grid with ${horizontalLines} horizontal and ${verticalLines} vertical lines`);
    
    // Create horizontal lines
    for (let i = 0; i <= horizontalLines; i++) {
      const y = i * gridSize;
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridLines.push(line);
      
      // Add major gridlines
      if (i % 5 === 0) {
        const majorLine = new Line([0, y, canvasWidth, y], {
          stroke: '#c0c0c0',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        
        canvas.add(majorLine);
        gridLines.push(majorLine);
      }
    }
    
    // Create vertical lines
    for (let i = 0; i <= verticalLines; i++) {
      const x = i * gridSize;
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridLines.push(line);
      
      // Add major gridlines
      if (i % 5 === 0) {
        const majorLine = new Line([x, 0, x, canvasHeight], {
          stroke: '#c0c0c0',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        
        canvas.add(majorLine);
        gridLines.push(majorLine);
      }
    }
    
    // Make sure grid is at the back
    gridLines.forEach(line => {
      canvas.sendToBack(line);
    });
    
    // Store grid objects in ref
    gridObjectsRef.current = gridLines;
    
    // Force render
    canvas.requestRenderAll();
    
    logger.info(`Created ${gridLines.length} grid lines`);
    return gridLines;
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    console.error("Error creating reliable grid:", error);
    return [];
  }
};
