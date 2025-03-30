/**
 * Grid creation utilities
 * Functions for creating and managing grid elements
 * @module utils/grid/gridCreationUtils
 */
import { Canvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";
import React from "react";

/**
 * Create a complete grid on the canvas
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createCompleteGrid = (canvas: Canvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Cannot create grid: Canvas is invalid", canvas);
    return [];
  }
  
  try {
    // Create small grid lines (10px)
    const smallGridObjects = createSmallGrid(canvas);
    
    // Create large grid lines (100px)
    const largeGridObjects = createLargeGrid(canvas);
    
    // Create grid markers
    const markerObjects = createGridMarkers(canvas);
    
    // Combine all grid objects
    const allGridObjects = [
      ...smallGridObjects,
      ...largeGridObjects,
      ...markerObjects
    ];
    
    // Mark all objects as grid objects (for filtering)
    allGridObjects.forEach(obj => {
      (obj as any).isGrid = true;
      (obj as any).selectable = false;
      (obj as any).excludeFromExport = true;
    });
    
    // Add all objects to canvas
    allGridObjects.forEach(obj => {
      canvas.add(obj);
    });
    
    // Send grid objects to the back
    allGridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    return allGridObjects;
  } catch (error) {
    console.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create small grid lines (10px)
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Array of small grid lines
 */
export const createSmallGrid = (canvas: Canvas): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return gridObjects;
  }
  
  try {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const gridColor = GRID_CONSTANTS.SMALL_GRID_COLOR;
    const gridWidth = GRID_CONSTANTS.SMALL_GRID_WIDTH;
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'small';
      
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'small';
      
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating small grid:", error);
    return [];
  }
};

/**
 * Create large grid lines (100px)
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Array of large grid lines
 */
export const createLargeGrid = (canvas: Canvas): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return gridObjects;
  }
  
  try {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
    const gridColor = GRID_CONSTANTS.LARGE_GRID_COLOR;
    const gridWidth = GRID_CONSTANTS.LARGE_GRID_WIDTH;
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'large';
      
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'large';
      
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating large grid:", error);
    return [];
  }
};

/**
 * Create grid markers with distance labels
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Array of grid marker objects
 */
export const createGridMarkers = (canvas: Canvas): FabricObject[] => {
  const markerObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return markerObjects;
  }
  
  try {
    // Create markers at specific intervals
    // Implementation details here
    
    return markerObjects;
  } catch (error) {
    console.error("Error creating grid markers:", error);
    return [];
  }
};

/**
 * Create basic emergency grid when standard grid creation fails
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @returns {FabricObject[]} Array of emergency grid objects
 */
export const createBasicEmergencyGrid = (canvas: Canvas): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return gridObjects;
  }
  
  try {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Create simplified grid with larger intervals
    const gridSize = 50; // Larger grid size for emergency
    const gridColor = "#dddddd";
    const gridWidth = 0.5;
    
    // Create vertical lines (fewer)
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'emergency';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create horizontal lines (fewer)
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'emergency';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create grid layer for a specific visual style
 * For use in advanced grid rendering scenarios
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {string} layerType - Type of grid layer
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (
  canvas: Canvas,
  layerType: 'small' | 'large' | 'markers'
): FabricObject[] => {
  switch (layerType) {
    case 'small':
      return createSmallGrid(canvas);
    case 'large':
      return createLargeGrid(canvas);
    case 'markers':
      return createGridMarkers(canvas);
    default:
      return [];
  }
};

/**
 * Create a fallback grid for reliability
 * Different implementation than createBasicEmergencyGrid
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return gridObjects;
  }
  
  try {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Create simplified grid with medium intervals
    const gridSize = 25; // Medium grid size for fallback
    const gridColor = "#e5e5e5";
    const gridWidth = 0.5;
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new Line([i, 0, i, canvasHeight], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'fallback';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new Line([0, i, canvasWidth, i], {
        stroke: gridColor,
        strokeWidth: gridWidth,
        selectable: false,
        evented: false
      });
      
      (line as any).objectType = 'grid';
      (line as any).gridType = 'fallback';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Store grid objects in the provided ref
    if (gridLayerRef) {
      gridLayerRef.current = gridObjects;
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating fallback grid:", error);
    return [];
  }
};

/**
 * Create a specific grid layer for advanced rendering
 * Renamed to avoid duplicate declaration
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {string} layerType - Type of grid layer to create
 * @returns {FabricObject[]} Created grid objects
 */
export const createSpecificGridLayer = (
  canvas: Canvas,
  layerType: 'small' | 'large' | 'markers'
): FabricObject[] => {
  switch (layerType) {
    case 'small':
      return createSmallGrid(canvas);
    case 'large':
      return createLargeGrid(canvas);
    case 'markers':
      return createGridMarkers(canvas);
    default:
      return [];
  }
};
