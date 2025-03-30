
/**
 * Grid rendering utilities
 * Contains functions for rendering different types of grids
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Creates a basic emergency grid when standard grid creation fails
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas not available");
    return [];
  }
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create a simpler grid with fewer lines for emergency
    const gridSpacing = 50; // Larger spacing for emergency grid
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a complete grid with small and large grid lines
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create enhanced grid with additional features
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createEnhancedGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  // Just use the complete grid for now, can be enhanced later
  return createCompleteGrid(canvas);
};
