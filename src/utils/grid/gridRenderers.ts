
/**
 * Grid rendering utilities
 * @module utils/grid/gridRenderers
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Grid options interface
 */
export interface GridOptions {
  /** Grid size in pixels */
  size?: number;
  /** Grid stroke color */
  stroke?: string;
  /** Grid stroke width */
  strokeWidth?: number;
  /** Whether to show major lines */
  showMajorLines?: boolean;
  /** Major line stroke color */
  majorStroke?: string;
  /** Major line stroke width */
  majorStrokeWidth?: number;
  /** Major line interval */
  majorInterval?: number;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Default grid options
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  size: 20,
  stroke: "#e0e0e0",
  strokeWidth: 1,
  showMajorLines: true,
  majorStroke: "#c0c0c0",
  majorStrokeWidth: 1,
  majorInterval: 5
};

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
 * Create a simple grid based on provided options
 * @param canvas The Fabric canvas
 * @param options Grid options
 * @returns Array of grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  const opts = { ...DEFAULT_GRID_OPTIONS, ...options };
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || !canvas.width || !canvas.height) {
    return gridObjects;
  }
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal grid lines
  for (let i = 0; i <= height; i += opts.size!) {
    const isMajor = opts.showMajorLines && i % (opts.size! * opts.majorInterval!) === 0;
    
    const line = new Line([0, i, width, i], {
      stroke: isMajor ? opts.majorStroke : opts.stroke,
      strokeWidth: isMajor ? opts.majorStrokeWidth : opts.strokeWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= width; i += opts.size!) {
    const isMajor = opts.showMajorLines && i % (opts.size! * opts.majorInterval!) === 0;
    
    const line = new Line([i, 0, i, height], {
      stroke: isMajor ? opts.majorStroke : opts.stroke,
      strokeWidth: isMajor ? opts.majorStrokeWidth : opts.strokeWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Send all grid objects to back
  gridObjects.forEach(obj => canvas.sendToBack(obj));
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Create a standard grid (alias for createCompleteGrid)
 * @param canvas The Fabric canvas
 * @returns Array of grid objects
 */
export const createGrid = createCompleteGrid;

/**
 * Ensure a grid exists on the canvas
 * @param canvas The Fabric canvas
 * @returns Array of grid objects
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid already exists
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (existingGrid.length > 0) {
    return existingGrid;
  }
  
  // Create new grid if none exists
  return createCompleteGrid(canvas);
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
