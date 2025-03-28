
/**
 * Grid creator module
 * Handles the actual creation of grid elements
 * @module grid/creator
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";

/**
 * Create grid lines for the canvas
 * Directly creates small (0.1m) and large (1m) grid lines
 * 
 * @param {Canvas} canvas - The Fabric canvas instance 
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGridLines = (canvas: Canvas): FabricObject[] => {
  const width = canvas.width || 0;
  const height = canvas.height || 0;
  const gridObjects: FabricObject[] = [];
  
  // Parameters for grid
  const smallGridSpacing = 10; // 10px for small grid (0.1m)
  const largeGridSpacing = 100; // 100px for large grid (1m)
  const smallGridColor = '#f0f0f0';
  const largeGridColor = '#d0d0d0';
  
  // Create horizontal small grid lines
  for (let y = 0; y <= height; y += smallGridSpacing) {
    const line = new Line([0, y, width, y], {
      stroke: smallGridColor,
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create vertical small grid lines
  for (let x = 0; x <= width; x += smallGridSpacing) {
    const line = new Line([x, 0, x, height], {
      stroke: smallGridColor,
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create horizontal large grid lines
  for (let y = 0; y <= height; y += largeGridSpacing) {
    const line = new Line([0, y, width, y], {
      stroke: largeGridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create vertical large grid lines
  for (let x = 0; x <= width; x += largeGridSpacing) {
    const line = new Line([x, 0, x, height], {
      stroke: largeGridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  return gridObjects;
};

/**
 * Create a fallback grid with simplified styling
 * Used when the primary grid creation method fails
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {React.Dispatch<React.SetStateAction<any>>} setDebugInfo - Debug info setter
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo?: React.Dispatch<React.SetStateAction<any>>
): FabricObject[] => {
  try {
    if (process.env.NODE_ENV === 'development') {
      logger.info("Creating fallback grid");
    }
    
    // Create simplified grid with only large lines
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    const gridObjects: FabricObject[] = [];
    const gridSpacing = 50; // 50px for emergency grid
    
    // Create horizontal grid lines
    for (let y = 0; y <= height; y += gridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical grid lines
    for (let x = 0; x <= width; x += gridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Store created grid objects in the reference
    gridLayerRef.current = gridObjects;
    
    // Update debug info if available
    if (setDebugInfo) {
      setDebugInfo(prev => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridObjects.length,
        fallbackGridUsed: true
      }));
    }
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.error("Error creating fallback grid:", error);
    }
    return [];
  }
};

/**
 * Create grid layer with all components
 * Main grid creation function that handles error checking
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {React.Dispatch<React.SetStateAction<any>>} setDebugInfo - Debug info setter
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGridLayer = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo?: React.Dispatch<React.SetStateAction<any>>
): FabricObject[] => {
  try {
    // Attempt to create grid lines
    const gridObjects = createGridLines(canvas);
    
    // Check if grid was created successfully
    if (!gridObjects || gridObjects.length === 0) {
      throw new Error("Failed to create grid lines");
    }
    
    // Store created grid objects in the reference
    gridLayerRef.current = gridObjects;
    
    // Update debug info if available
    if (setDebugInfo) {
      setDebugInfo(prev => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridObjects.length
      }));
    }
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.error("Error creating grid layer:", error);
    }
    
    // Try fallback grid on error
    return createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
  }
};
