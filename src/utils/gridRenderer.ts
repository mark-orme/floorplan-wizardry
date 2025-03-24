/**
 * Grid rendering utilities
 * Handles rendering and organization of grid objects
 * @module gridRenderer
 */
import { Canvas } from "fabric";
import { createSmallGrid, createLargeGrid } from "./gridCreators";
import { createScaleMarkers } from "./gridUtils";
import { canvasMoveTo } from "./fabric";

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
  if (process.env.NODE_ENV === 'development') {
    console.log(`Rendering grid components for canvas ${canvasWidth}x${canvasHeight}`);
  }
  
  const gridObjects: any[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Invalid canvas dimensions for grid rendering:", canvasWidth, canvasHeight);
    }
    return { gridObjects: [], smallGridLines: [], largeGridLines: [], markers: [] };
  }
  
  try {
    // Disable rendering during batch operations for performance
    canvas.renderOnAddRemove = false;
        
    // Batch add grid objects for better performance
    const gridBatch: any[] = [];
        
    // Create large grid lines first (so they appear behind small grid lines)
    const largeGridLines = createLargeGrid(canvas, canvasWidth, canvasHeight);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Created ${largeGridLines.length} large grid lines`);
    }
    
    largeGridLines.forEach(line => {
      gridBatch.push(line);
      gridObjects.push(line);
    });
        
    // Create small grid lines
    const smallGridLines = createSmallGrid(canvas, canvasWidth, canvasHeight);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Created ${smallGridLines.length} small grid lines`);
    }
    
    smallGridLines.forEach(line => {
      gridBatch.push(line);
      gridObjects.push(line);
    });

    // For debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Adding ${gridBatch.length} grid lines to canvas in batch`);
    }
    
    // Add all grid objects at once - using a safer approach with explicit error handling
    if (gridBatch.length > 0) {
      try {
        canvas.add(...gridBatch);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Successfully added ${gridBatch.length} grid lines to canvas`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error adding grid batch to canvas:", error);
        }
        
        // Fallback: add one by one
        let successCount = 0;
        gridBatch.forEach((object, index) => {
          try {
            canvas.add(object);
            successCount++;
            // Log only occasionally to avoid console spam
            if (process.env.NODE_ENV === 'development' && index % 50 === 0) {
              console.log(`Added grid line ${index}/${gridBatch.length}`);
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn("Error adding individual grid line:", error);
            }
          }
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Added ${successCount}/${gridBatch.length} grid lines individually after batch failure`);
        }
      }
    }
    
    // Add scale marker (1m) - add it separately to make it appear on top
    const markers = createScaleMarkers(canvas, canvasWidth, canvasHeight);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Created ${markers.length} scale markers`);
    }
    
    markers.forEach(marker => {
      try {
        canvas.add(marker);
        gridObjects.push(marker);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Error adding marker:", error);
        }
      }
    });
    
    // Re-enable rendering and render all at once
    canvas.renderOnAddRemove = true;
    
    // Force a render
    canvas.requestRenderAll();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Total grid objects created: ${gridObjects.length}`);
    }
    
    return { gridObjects, smallGridLines, largeGridLines, markers };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Critical error in renderGridComponents:", error);
    }
    return { gridObjects: [], smallGridLines: [], largeGridLines: [], markers: [] };
  }
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
  if (process.env.NODE_ENV === 'development') {
    console.log("Arranging grid objects in correct z-order");
  }
  
  try {
    // First send large grid lines to the back
    largeGridLines.forEach(object => {
      try {
        // Use sendObjectToBack instead of sendToBack
        canvas.sendObjectToBack(object);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Error arranging large grid line:", error);
        }
      }
    });
    
    // Then send small grid lines just above the large ones
    smallGridLines.forEach(object => {
      try {
        // Use bringObjectForward instead of bringForward
        canvas.bringObjectForward(object);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Error arranging small grid line:", error);
        }
      }
    });
    
    // Keep markers on top of grid but below drawings
    markers.forEach(marker => {
      try {
        // Use bringObjectToFront instead of bringToFront
        canvas.bringObjectToFront(marker);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Error arranging marker:", error);
        }
      }
    });
    
    // Final render
    canvas.requestRenderAll();
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Grid objects arranged successfully");
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error in arrangeGridObjects:", error);
    }
  }
};
