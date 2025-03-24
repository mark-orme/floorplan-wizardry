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
  console.log(`Rendering grid components for canvas ${canvasWidth}x${canvasHeight}`);
  const gridObjects: any[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    console.error("Invalid canvas dimensions for grid rendering:", canvasWidth, canvasHeight);
    return { gridObjects: [], smallGridLines: [], largeGridLines: [], markers: [] };
  }
  
  // Disable rendering during batch operations for performance
  canvas.renderOnAddRemove = false;
      
  // Batch add grid objects for better performance
  const gridBatch: any[] = [];
      
  // Create small grid lines
  const smallGridLines = createSmallGrid(canvas, canvasWidth, canvasHeight);
  console.log(`Created ${smallGridLines.length} small grid lines`);
  smallGridLines.forEach(line => {
    gridBatch.push(line);
    gridObjects.push(line);
  });
      
  // Create large grid lines
  const largeGridLines = createLargeGrid(canvas, canvasWidth, canvasHeight);
  console.log(`Created ${largeGridLines.length} large grid lines`);
  largeGridLines.forEach(line => {
    gridBatch.push(line);
    gridObjects.push(line);
  });

  // For debugging
  console.log(`Adding ${gridBatch.length} grid lines to canvas`);
  
  // Add all grid objects at once - using a safer approach
  if (gridBatch.length > 0) {
    try {
      canvas.add(...gridBatch);
    } catch (err) {
      console.error("Error adding grid batch to canvas:", err);
      
      // Fallback: add one by one
      gridBatch.forEach(obj => {
        try {
          canvas.add(obj);
        } catch (e) {
          console.warn("Error adding individual grid line:", e);
        }
      });
    }
  }
  
  // Add scale marker (1m) - add it separately to make it appear on top
  const markers = createScaleMarkers(canvas, canvasWidth, canvasHeight);
  console.log(`Created ${markers.length} scale markers`);
  markers.forEach(marker => {
    try {
      canvas.add(marker);
      gridObjects.push(marker);
    } catch (err) {
      console.warn("Error adding marker:", err);
    }
  });
  
  // Re-enable rendering and render all at once
  canvas.renderOnAddRemove = true;
  canvas.requestRenderAll();
  
  console.log(`Total grid objects created: ${gridObjects.length}`);
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
    try {
      canvas.sendObjectToBack(obj);
    } catch (err) {
      console.warn("Error arranging grid line:", err);
    }
  });
  
  // Keep markers on top of grid but below drawings
  markers.forEach(marker => {
    try {
      // Simply bring markers to front, drawings will be added later
      canvas.bringObjectToFront(marker);
    } catch (err) {
      console.warn("Error arranging marker:", err);
    }
  });
  
  // Final render
  canvas.requestRenderAll();
  console.log("Grid objects arranged successfully");
};
