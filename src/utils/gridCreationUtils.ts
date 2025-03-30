
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid } from "@/utils/simpleGridCreator";

/**
 * Create a floor plan grid on the canvas
 * @param canvas - The Fabric canvas to create the grid on
 * @param existingGrid - Any existing grid objects
 * @returns Array of created grid objects
 */
export function createFloorPlanGrid(
  canvas: FabricCanvas,
  existingGrid: FabricObject[] = []
): FabricObject[] {
  try {
    console.log("Creating floor plan grid");
    return createSimpleGrid(canvas, existingGrid);
  } catch (error) {
    console.error("Error creating floor plan grid:", error);
    return [];
  }
}

/**
 * Create a basic emergency grid as a fallback when normal grid creation fails
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating emergency grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create basic lines for emergency grid
    const emergencySpacing = 50;
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += emergencySpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#cccccc',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += emergencySpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#cccccc',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Request a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a fallback grid with intermediate complexity
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @returns Created grid objects
 */
export const createFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating fallback grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create intermediate grid with wider spacing
    const gridSpacing = 50;
    
    // Create large grid lines
    for (let x = 0; x <= width; x += gridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += gridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#dddddd',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Request a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating fallback grid:", error);
    return [];
  }
};

/**
 * Create a complete grid with all elements
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @returns Created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    return createSimpleGrid(canvas, gridLayerRef.current);
  } catch (error) {
    console.error("Error creating complete grid:", error);
    return createFallbackGrid(canvas, gridLayerRef);
  }
};

/**
 * Create a specific grid layer (small, large, or markers)
 * @param canvas - The fabric canvas
 * @param layerType - Type of grid layer
 * @returns Created grid objects
 */
export const createGridLayer = (
  canvas: FabricCanvas,
  layerType: string
): FabricObject[] => {
  return []; // Simplified implementation
};

/**
 * Verify if grid exists and is valid
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @returns Whether grid exists and is valid
 */
export const verifyGridExists = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if at least some grid objects are on canvas
  let foundObjects = 0;
  
  for (const obj of gridLayerRef.current) {
    if (canvas.contains(obj)) {
      foundObjects++;
      if (foundObjects > 5) {
        return true;
      }
    }
  }
  
  return foundObjects > 0;
};

/**
 * Validate grid exists and is correctly attached to canvas
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @returns Whether grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return verifyGridExists(canvas, gridLayerRef);
};

/**
 * Ensure grid exists, creating if necessary
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @returns Grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return gridLayerRef.current;
  }
  
  return createCompleteGrid(canvas, gridLayerRef);
};

/**
 * Retry operation with exponential backoff
 * @param operation - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @returns Promise resolving to operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => T | Promise<T>,
  maxAttempts: number = 3
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Skip delay on last attempt
      if (attempt < maxAttempts) {
        const delay = Math.min(100 * Math.pow(2, attempt), 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Reorder grid objects for proper rendering
 * @param canvas - The Fabric canvas instance
 * @param gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendToBack(obj);
    }
  });
};

/**
 * Helper to force grid recreation
 * @param canvas - The canvas
 * @returns Has complete grid
 */
export const hasCompleteGrid = (
  canvas: FabricCanvas
): boolean => {
  return canvas && canvas.getObjects().some(obj => (obj as any).objectType === 'grid');
};

/**
 * Force grid to render
 * @param canvas - The canvas
 */
export const forceGridRender = (
  canvas: FabricCanvas
): void => {
  if (canvas) {
    canvas.requestRenderAll();
  }
};

import { Line } from "fabric";
