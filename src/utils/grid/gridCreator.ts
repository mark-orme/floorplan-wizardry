
/**
 * Grid creator module
 * Creates grid lines for the canvas
 * @module grid/gridCreator
 */
import { Canvas, Line, Object as FabricObject } from "fabric";
import logger from "../logger";
import { DebugInfoState } from "@/types/debugTypes";

/**
 * Create grid layer with current canvas dimensions
 * Creates both small and large grid lines
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {{ width: number, height: number }} dimensions - Canvas dimensions
 * @param {React.Dispatch<React.SetStateAction<DebugInfoState>>} setDebugInfo - Function to update debug info
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createGridLayer = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  dimensions: { width: number, height: number },
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>
): FabricObject[] => {
  try {
    const width = canvas.width || dimensions.width;
    const height = canvas.height || dimensions.height;
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
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      gridCreated: true,
      gridObjectCount: gridObjects.length
    }));
    
    // Store the created grid objects in the ref
    gridLayerRef.current = gridObjects;
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid layer:", error);
    return [];
  }
};

/**
 * Create a basic fallback grid when standard grid creation fails
 * Much simpler grid with fewer lines to reduce performance impact
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {React.Dispatch<React.SetStateAction<DebugInfoState>>} setDebugInfo - Function to update debug info
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>
): FabricObject[] => {
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Use a larger spacing for fallback grid to reduce number of objects
    const gridSpacing = 50;
    const gridColor = '#e0e0e0';
    
    // Create only the large grid lines for better performance
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      gridCreated: true,
      gridObjectCount: gridObjects.length,
      usingFallbackGrid: true
    }));
    
    // Store the created grid objects in the ref
    gridLayerRef.current = gridObjects;
    
    logger.info(`Fallback grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating fallback grid:", error);
    return [];
  }
};
