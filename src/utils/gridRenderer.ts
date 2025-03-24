
/**
 * Grid rendering utilities
 * Handles rendering and organization of grid objects
 * @module gridRenderer
 */
import { Canvas } from "fabric";
import { createSmallGrid, createLargeGrid } from "./gridCreators";
import { createScaleMarkers } from "./gridUtils";

/**
 * Result of grid components rendering
 */
export interface GridComponentsResult {
  gridObjects: any[];
  smallGridLines: any[];
  largeGridLines: any[];
  markers: any[];
}

/**
 * Render all grid components to the canvas
 * @param canvas - The Fabric canvas
 * @param canvasWidth - Width of the canvas
 * @param canvasHeight - Height of the canvas
 * @returns Object containing created grid objects
 */
export const renderGridComponents = (
  canvas: Canvas,
  canvasWidth: number,
  canvasHeight: number
): GridComponentsResult => {
  const gridObjects: any[] = [];
  
  // Disable rendering during batch operations for performance
  canvas.renderOnAddRemove = false;
      
  // Batch add grid objects for better performance
  const gridBatch: any[] = [];
      
  // Create small grid lines (with extended dimensions for unlimited feel)
  const smallGridLines = createSmallGrid(canvas, canvasWidth, canvasHeight);
  smallGridLines.forEach(line => {
    gridBatch.push(line);
    gridObjects.push(line);
  });
      
  // Create large grid lines (with extended dimensions for unlimited feel)
  const largeGridLines = createLargeGrid(canvas, canvasWidth, canvasHeight);
  largeGridLines.forEach(line => {
    gridBatch.push(line);
    gridObjects.push(line);
  });

  // Add all grid objects at once
  canvas.add(...gridBatch);
  
  // Add scale marker (1m) - add it separately to make it appear on top
  const markers = createScaleMarkers(canvas, canvasWidth, canvasHeight);
  markers.forEach(marker => {
    canvas.add(marker);
    gridObjects.push(marker);
  });
  
  // Re-enable rendering and render all at once
  canvas.renderOnAddRemove = true;
  
  return { gridObjects, smallGridLines, largeGridLines, markers };
};

/**
 * Arrange grid objects in the correct z-order
 * @param canvas - The Fabric canvas
 * @param smallGridLines - Array of small grid lines
 * @param largeGridLines - Array of large grid lines 
 * @param markers - Array of scale markers
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  smallGridLines: any[],
  largeGridLines: any[],
  markers: any[]
): void => {
  // Send grid lines to the back, but keep markers on top
  smallGridLines.concat(largeGridLines).forEach(obj => {
    canvas.sendObjectToBack(obj);
  });
  
  // Keep markers on top of grid but below drawings
  markers.forEach(marker => {
    // Bring markers to front but not all the way
    const objects = canvas.getObjects();
    const drawingObjects = objects.filter(obj => 
      obj.type === 'polyline' || obj.type === 'path');
    
    if (drawingObjects.length > 0) {
      // Place markers below the lowest drawing object
      const targetIndex = canvas.getObjects().indexOf(drawingObjects[0]);
      // Use Canvas's chainable methods safely
      if (typeof canvas.moveTo === 'function') {
        canvas.moveTo(marker, targetIndex);
      } else {
        // Fallback if moveTo doesn't exist
        console.warn("Canvas.moveTo not available, using alternative layer arrangement");
        canvas.bringObjectToFront(marker);
        drawingObjects.forEach(drawing => {
          canvas.bringObjectToFront(drawing);
        });
      }
    }
  });
};
