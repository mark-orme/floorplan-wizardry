
/**
 * Grid renderer module
 * Provides functions for rendering grid components on canvas
 * @module gridRenderer
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";

/**
 * Grid render result interface
 */
export interface GridRenderResult {
  /** All grid-related objects */
  gridObjects: FabricObject[];
  /** Small grid lines */
  smallGridLines: FabricObject[];
  /** Large grid lines */
  largeGridLines: FabricObject[];
  /** Grid markers (labels) */
  markers: FabricObject[];
}

/**
 * Render all grid components on the canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {GridRenderResult} Created grid objects
 */
export function renderGridComponents(
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult {
  // Initialize result containers
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  const markers: FabricObject[] = [];
  
  // Grid configuration
  const smallGridSpacing = 10;
  const largeGridSpacing = 50;
  const smallGridColor = "#E0E0E0";
  const largeGridColor = "#C0C0C0";
  const axisColor = "#A0A0A0";
  
  try {
    // Create small grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: smallGridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      smallGridLines.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: smallGridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      smallGridLines.push(line);
      canvas.add(line);
    }
    
    // Create large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: largeGridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      largeGridLines.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: largeGridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      largeGridLines.push(line);
      canvas.add(line);
    }
    
    // Add markers
    for (let x = largeGridSpacing; x < width; x += largeGridSpacing) {
      const text = new Text(String(x), {
        left: x,
        top: 5,
        fontSize: 8,
        fill: axisColor,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      markers.push(text);
      canvas.add(text);
    }
    
    for (let y = largeGridSpacing; y < height; y += largeGridSpacing) {
      const text = new Text(String(y), {
        left: 5,
        top: y,
        fontSize: 8,
        fill: axisColor,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      markers.push(text);
      canvas.add(text);
    }
    
  } catch (error) {
    console.error("Error rendering grid components:", error);
  }
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers
  };
}

/**
 * Arrange grid objects in correct z-order
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} smallGridLines - Small grid lines
 * @param {FabricObject[]} largeGridLines - Large grid lines
 * @param {FabricObject[]} markers - Grid markers
 */
export function arrangeGridObjects(
  canvas: Canvas,
  smallGridLines: FabricObject[],
  largeGridLines: FabricObject[],
  markers: FabricObject[]
): void {
  try {
    // Send small grid lines to back
    smallGridLines.forEach(line => {
      canvas.sendToBack(line);
    });
    
    // Bring large grid lines above small grid lines
    largeGridLines.forEach(line => {
      smallGridLines.forEach(smallLine => {
        canvas.bringForward(line);
      });
    });
    
    // Bring markers to front
    markers.forEach(marker => {
      canvas.bringToFront(marker);
    });
    
  } catch (error) {
    console.error("Error arranging grid objects:", error);
  }
}
