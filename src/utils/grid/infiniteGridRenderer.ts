
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface InfiniteGridOptions {
  smallGridSize?: number;
  largeGridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
  viewportPadding?: number;
}

/**
 * Create an infinite grid that updates as the canvas is panned
 * @param canvas The Fabric canvas instance
 * @param options Grid configuration options
 * @returns Array of grid objects
 */
export const createInfiniteGrid = (
  canvas: FabricCanvas,
  options: InfiniteGridOptions = {}
): FabricObject[] => {
  // Default options
  const smallGridSize = options.smallGridSize || GRID_CONSTANTS.SMALL_GRID_SIZE;
  const largeGridSize = options.largeGridSize || GRID_CONSTANTS.LARGE_GRID_SIZE;
  const smallGridColor = options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR;
  const largeGridColor = options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR;
  const smallGridWidth = options.smallGridWidth || GRID_CONSTANTS.SMALL_GRID_WIDTH;
  const largeGridWidth = options.largeGridWidth || GRID_CONSTANTS.LARGE_GRID_WIDTH;
  const viewportPadding = options.viewportPadding || 100;
  
  // Remove any existing grid objects
  const existingGridObjects = canvas.getObjects().filter(
    obj => obj.objectType === 'grid' || (obj as any).isGrid === true
  );
  existingGridObjects.forEach(obj => canvas.remove(obj));
  
  // Grid objects array
  const gridObjects: FabricObject[] = [];
  
  // Get canvas viewport
  const vpt = canvas.viewportTransform;
  if (!vpt) return [];
  
  // Calculate visible area (with padding)
  const zoom = canvas.getZoom();
  const width = canvas.width || 1000;
  const height = canvas.height || 1000;
  
  const left = -vpt[4] / zoom - viewportPadding;
  const top = -vpt[5] / zoom - viewportPadding;
  const right = left + width / zoom + viewportPadding * 2;
  const bottom = top + height / zoom + viewportPadding * 2;
  
  // Adjust grid line boundaries to align with grid
  const startX = Math.floor(left / smallGridSize) * smallGridSize;
  const startY = Math.floor(top / smallGridSize) * smallGridSize;
  const endX = Math.ceil(right / smallGridSize) * smallGridSize;
  const endY = Math.ceil(bottom / smallGridSize) * smallGridSize;
  
  // Create grid lines
  
  // Small grid lines (horizontal)
  for (let y = startY; y <= endY; y += smallGridSize) {
    // Skip if this line should be a large grid line
    if (y % largeGridSize === 0) continue;
    
    const line = new Line([startX, y, endX, y], {
      stroke: smallGridColor,
      strokeWidth: smallGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Small grid lines (vertical)
  for (let x = startX; x <= endX; x += smallGridSize) {
    // Skip if this line should be a large grid line
    if (x % largeGridSize === 0) continue;
    
    const line = new Line([x, startY, x, endY], {
      stroke: smallGridColor,
      strokeWidth: smallGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Large grid lines (horizontal)
  for (let y = Math.floor(startY / largeGridSize) * largeGridSize; 
       y <= endY; 
       y += largeGridSize) {
    const line = new Line([startX, y, endX, y], {
      stroke: largeGridColor,
      strokeWidth: largeGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Large grid lines (vertical)
  for (let x = Math.floor(startX / largeGridSize) * largeGridSize; 
       x <= endX; 
       x += largeGridSize) {
    const line = new Line([x, startY, x, endY], {
      stroke: largeGridColor,
      strokeWidth: largeGridWidth,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Set up canvas event to update grid on viewport change
  canvas.on('mouse:up', () => {
    updateInfiniteGrid(canvas, options);
  });
  
  canvas.on('mouse:wheel', () => {
    updateInfiniteGrid(canvas, options);
  });
  
  return gridObjects;
};

/**
 * Update the infinite grid when the viewport changes
 * @param canvas The Fabric canvas instance
 * @param options Grid configuration options
 */
export const updateInfiniteGrid = (
  canvas: FabricCanvas,
  options: InfiniteGridOptions = {}
): void => {
  // Use debounce to avoid excessive updates
  if ((canvas as any)._gridUpdateTimeout) {
    clearTimeout((canvas as any)._gridUpdateTimeout);
  }
  
  (canvas as any)._gridUpdateTimeout = setTimeout(() => {
    createInfiniteGrid(canvas, options);
  }, 200);
};
