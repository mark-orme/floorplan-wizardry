
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";

/**
 * Create a simple grid on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create grid: Canvas is null or undefined");
    return [];
  }
  
  try {
    console.log("Creating simple grid");
    
    // Clean up any existing grid objects to prevent duplicates
    const existingGridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (existingGridObjects.length > 0) {
      console.log(`Removing ${existingGridObjects.length} existing grid objects`);
      existingGridObjects.forEach(obj => {
        canvas.remove(obj);
      });
    }
    
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      } as any);
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
      } as any);
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
        isGrid: true,
        isLargeGrid: true
      } as any);
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
        isGrid: true,
        isLargeGrid: true
      } as any);
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send grid to back so it's behind other objects
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
    console.log(`Grid created successfully with ${gridObjects.length} lines`);
    return gridObjects;
  } catch (error) {
    console.error('Error creating grid:', error);
    return [];
  }
};

/**
 * Ensure grid is visible on canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} Whether any fixes were applied
 */
export const ensureGridVisible = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas || !gridObjects.length) return false;
  
  let fixesApplied = false;
  
  // Check if each grid object is on canvas
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      fixesApplied = true;
    }
    
    // Make sure the grid is visible
    if (!obj.visible) {
      obj.set('visible', true);
      fixesApplied = true;
    }
  });
  
  if (fixesApplied) {
    // Send grid to back so it's behind other objects
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    canvas.requestRenderAll();
    console.log("Grid visibility fixed");
  }
  
  return fixesApplied;
};

/**
 * Emergency grid creation when normal grid fails
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  console.log("Creating emergency grid as fallback");
  const gridSize = 20;
  const gridColor = "#eeeeee";
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  // Create simple grid with just the basic lines
  for (let i = 0; i <= width; i += gridSize) {
    const line = new Line([i, 0, i, height], {
      stroke: gridColor,
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += gridSize) {
    const line = new Line([0, i, width, i], {
      stroke: gridColor,
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  canvas.requestRenderAll();
  console.log(`Emergency grid created with ${gridObjects.length} lines`);
  return gridObjects;
};
