
/**
 * Grid renderer module
 * Handles rendering of grid lines and markers on canvas
 * @module gridRenderer
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "./logger";
import { 
  SMALL_GRID_LINE_OPTIONS,
  LARGE_GRID_LINE_OPTIONS,
  MARKER_TEXT_OPTIONS,
  GRID_SCALE,
  PIXELS_PER_METER,
  GRID_SPACING,
  DISABLE_GRID_MARKERS
} from "./gridConstants";

/**
 * Result of grid rendering operation
 * @interface GridRenderResult
 */
export interface GridRenderResult {
  /** All grid objects created */
  gridObjects: FabricObject[];
  /** Small grid lines only */
  smallGridLines: FabricObject[];
  /** Large grid lines only */
  largeGridLines: FabricObject[];
  /** Grid markers (text labels) */
  markers: FabricObject[];
}

/**
 * Render grid components on canvas
 * Creates small grid, large grid, and text markers
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {GridRenderResult} Created grid objects
 */
export const renderGridComponents = (
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult => {
  // Initialize result arrays
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  const markers: FabricObject[] = [];
  
  try {
    // Create small grid lines (0.1m spacing)
    const smallGridSpacing = PIXELS_PER_METER * GRID_SCALE.SMALL_SPACING; // 10px = 0.1m
    
    // Create small grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, height], SMALL_GRID_LINE_OPTIONS);
      canvas.add(line);
      smallGridLines.push(line);
    }
    
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const line = new Line([0, y, width, y], SMALL_GRID_LINE_OPTIONS);
      canvas.add(line);
      smallGridLines.push(line);
    }
    
    // Create large grid lines (1m spacing)
    const largeGridSpacing = PIXELS_PER_METER * GRID_SCALE.LARGE_SPACING; // 100px = 1m
    
    // Create large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], LARGE_GRID_LINE_OPTIONS);
      canvas.add(line);
      largeGridLines.push(line);
    }
    
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], LARGE_GRID_LINE_OPTIONS);
      canvas.add(line);
      largeGridLines.push(line);
    }
    
    // Create text markers if enabled
    if (!DISABLE_GRID_MARKERS) {
      // Add text markers at specified intervals
      const markerInterval = PIXELS_PER_METER * GRID_SCALE.MARKER_INTERVAL; // Default: every 1m
      
      // Add X-axis markers (horizontal)
      for (let x = markerInterval; x < width; x += markerInterval) {
        const value = (x / PIXELS_PER_METER).toFixed(1);
        const text = new Text(value, {
          ...MARKER_TEXT_OPTIONS,
          left: x,
          top: 5
        });
        canvas.add(text);
        markers.push(text);
      }
      
      // Add Y-axis markers (vertical)
      for (let y = markerInterval; y < height; y += markerInterval) {
        const value = (y / PIXELS_PER_METER).toFixed(1);
        const text = new Text(value, {
          ...MARKER_TEXT_OPTIONS,
          left: 5,
          top: y
        });
        canvas.add(text);
        markers.push(text);
      }
    }
    
    // Combine all grid objects
    const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
    
    // Log creation information
    logger.debug(`Grid rendered with ${gridObjects.length} objects (${smallGridLines.length} small, ${largeGridLines.length} large, ${markers.length} markers)`);
    
    return {
      gridObjects,
      smallGridLines,
      largeGridLines,
      markers
    };
  } catch (error) {
    logger.error("Error rendering grid components:", error);
    console.error("Error rendering grid components:", error);
    
    // Return whatever we managed to create
    const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
    return {
      gridObjects,
      smallGridLines,
      largeGridLines,
      markers
    };
  }
};

/**
 * Arrange grid objects in correct z-order
 * Ensures proper layering of grid elements
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} smallGridLines - Small grid lines
 * @param {FabricObject[]} largeGridLines - Large grid lines
 * @param {FabricObject[]} markers - Text markers
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  smallGridLines: FabricObject[],
  largeGridLines: FabricObject[],
  markers: FabricObject[]
): void => {
  try {
    // Send small grid lines to the very back (bottom layer)
    smallGridLines.forEach(line => {
      canvas.sendObjectToBack(line);
    });
    
    // Send large grid lines behind everything but small grid
    largeGridLines.forEach(line => {
      // Place large lines above small lines but below other objects
      smallGridLines.forEach(smallLine => {
        canvas.bringObjectForward(line, smallLine);
      });
    });
    
    // Ensure markers are above grid lines
    markers.forEach(marker => {
      canvas.bringObjectToFront(marker);
    });
  } catch (error) {
    logger.error("Error arranging grid objects:", error);
    console.error("Error arranging grid objects:", error);
  }
};

