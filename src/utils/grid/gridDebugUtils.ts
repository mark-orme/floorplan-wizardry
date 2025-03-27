
/**
 * Utilities for grid debugging
 * @module grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { toast } from "sonner";

/**
 * Highlights grid lines for debugging
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to highlight
 * @returns {boolean} Success indicator
 */
export const highlightGridLines = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas || !Array.isArray(gridObjects) || gridObjects.length === 0) {
    return false;
  }
  
  try {
    gridObjects.forEach(obj => {
      // Change grid line properties temporarily to highlight them
      if (obj.stroke) {
        const originalStroke = obj.stroke;
        obj.set({
          stroke: 'red',
          strokeWidth: 2,
          opacity: 1
        });
        
        // Revert after 2 seconds
        setTimeout(() => {
          obj.set({
            stroke: originalStroke,
            strokeWidth: 1,
            opacity: 0.5
          });
          canvas.requestRenderAll();
        }, 2000);
      }
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    console.error('Error highlighting grid lines:', error);
    return false;
  }
};

/**
 * Creates debug axes on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {FabricObject[]} Created axis objects
 */
export const createDebugAxes = (canvas: FabricCanvas, width: number, height: number): FabricObject[] => {
  if (!canvas) {
    return [];
  }
  
  try {
    const axes: FabricObject[] = [];
    
    // X-axis (horizontal)
    const xAxis = new Line([0, height/2, width, height/2], {
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
      evented: false
    });
    
    // Y-axis (vertical)
    const yAxis = new Line([width/2, 0, width/2, height], {
      stroke: 'green',
      strokeWidth: 2,
      selectable: false,
      evented: false
    });
    
    canvas.add(xAxis, yAxis);
    axes.push(xAxis, yAxis);
    
    // Send axes to back so they don't interfere with other elements
    axes.forEach(axis => {
      axis.sendToBack();
    });
    
    canvas.requestRenderAll();
    return axes;
  } catch (error) {
    console.error('Error creating debug axes:', error);
    return [];
  }
};

/**
 * Force creates a grid on the canvas for debugging
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} spacing - Grid spacing
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas, 
  width: number, 
  height: number, 
  spacing = 50
): FabricObject[] => {
  if (!canvas) {
    toast.error("Canvas not available for debug grid creation");
    return [];
  }
  
  try {
    const gridLines: FabricObject[] = [];
    const gridColor = "rgba(200, 200, 200, 0.5)";
    
    // Create vertical lines
    for (let x = 0; x <= width; x += spacing) {
      const line = new Line([x, 0, x, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      gridLines.push(line);
      canvas.add(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      const line = new Line([0, y, width, y], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      gridLines.push(line);
      canvas.add(line);
    }
    
    // Send all grid lines to back
    gridLines.forEach(line => {
      line.sendToBack();
    });
    
    canvas.requestRenderAll();
    toast.success(`Created debug grid with ${gridLines.length} lines`);
    return gridLines;
  } catch (error) {
    console.error('Error creating debug grid:', error);
    toast.error(`Failed to create debug grid: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

/**
 * Counts and returns information about grid objects
 * @param {FabricObject[]} gridObjects - Grid objects to count
 * @returns {object} Grid object count information
 */
export const countGridObjects = (gridObjects: FabricObject[] | null | undefined) => {
  if (!Array.isArray(gridObjects)) {
    return { total: 0, horizontal: 0, vertical: 0 };
  }
  
  let horizontal = 0;
  let vertical = 0;
  
  gridObjects.forEach(obj => {
    // For fabric Lines, we can check if y1 === y2 to identify horizontal lines
    if ('x1' in obj && 'y1' in obj && 'x2' in obj && 'y2' in obj) {
      if (obj.y1 === obj.y2) {
        horizontal++;
      } else if (obj.x1 === obj.x2) {
        vertical++;
      }
    }
  });
  
  return {
    total: gridObjects.length,
    horizontal,
    vertical
  };
};
