
/**
 * Grid rendering utilities
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Create a complete grid with both small and large grid lines
 * @param canvas The Fabric canvas
 * @returns Array of grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    console.error('Invalid canvas dimensions for grid creation');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal small grid lines
  for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Create vertical small grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Create horizontal large grid lines
  for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Create vertical large grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Create a basic emergency grid when full grid creation fails
 * @param canvas The Fabric canvas
 * @returns Array of grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    console.error('Invalid canvas dimensions for emergency grid creation');
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Create a minimal grid with larger spacing
  const spacing = 50;
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += spacing) {
    const line = new Line([0, i, width, i], {
      stroke: '#dddddd',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let i = 0; i <= width; i += spacing) {
    const line = new Line([i, 0, i, height], {
      stroke: '#dddddd',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true,
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Validate that the grid exists and is displaying correctly
 * @param canvas The Fabric canvas
 * @returns True if grid is valid
 */
export const validateGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  return gridObjects.length > 0;
};
