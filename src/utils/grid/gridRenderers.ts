
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/fabric-unified';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { forceGridCreationAndVisibility } from './gridVisibility';

/**
 * Create a complete grid with small and large lines
 * @param canvas The fabric canvas
 * @param visible Whether the grid should be visible
 * @param options Additional grid options
 */
export const createCompleteGrid = (
  canvas: ExtendedFabricCanvas | null,
  visible: boolean = true,
  options: {
    smallGridSize?: number;
    largeGridSize?: number;
    smallGridColor?: string;
    largeGridColor?: string;
    smallGridWidth?: number;
    largeGridWidth?: number;
  } = {}
): ExtendedFabricObject[] => {
  if (!canvas) return [];
  
  // Use options or defaults
  const smallGridSize = options.smallGridSize ?? GRID_CONSTANTS.SMALL_GRID_SIZE;
  const largeGridSize = options.largeGridSize ?? GRID_CONSTANTS.LARGE_GRID_SIZE;
  const smallGridColor = options.smallGridColor ?? GRID_CONSTANTS.SMALL_GRID_COLOR;
  const largeGridColor = options.largeGridColor ?? GRID_CONSTANTS.LARGE_GRID_COLOR;
  const smallGridWidth = options.smallGridWidth ?? GRID_CONSTANTS.SMALL_GRID_WIDTH;
  const largeGridWidth = options.largeGridWidth ?? GRID_CONSTANTS.LARGE_GRID_WIDTH;
  
  // Remove existing grid
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as ExtendedFabricObject).isGrid === true
  );
  
  existingGrid.forEach(obj => canvas.remove(obj));
  
  // If not visible, just return empty array
  if (!visible) {
    return [];
  }
  
  // Create grid objects
  const gridObjects: ExtendedFabricObject[] = [];
  const width = canvas.getWidth?.() || 1000;
  const height = canvas.getHeight?.() || 1000;
  
  // Create small grid lines
  for (let x = 0; x <= width; x += smallGridSize) {
    const isLarge = x % largeGridSize === 0;
    const line = new fabric.Line([x, 0, x, height], {
      stroke: isLarge ? largeGridColor : smallGridColor,
      strokeWidth: isLarge ? largeGridWidth : smallGridWidth,
      selectable: false,
      evented: false,
      excludeFromExport: true
    }) as ExtendedFabricObject;
    
    line.isGrid = true;
    line.isLargeGrid = isLarge;
    gridObjects.push(line);
  }
  
  for (let y = 0; y <= height; y += smallGridSize) {
    const isLarge = y % largeGridSize === 0;
    const line = new fabric.Line([0, y, width, y], {
      stroke: isLarge ? largeGridColor : smallGridColor,
      strokeWidth: isLarge ? largeGridWidth : smallGridWidth,
      selectable: false,
      evented: false,
      excludeFromExport: true
    }) as ExtendedFabricObject;
    
    line.isGrid = true;
    line.isLargeGrid = isLarge;
    gridObjects.push(line);
  }
  
  // Add all grid lines at once and send to back
  gridObjects.forEach(obj => {
    canvas.add(obj);
    canvas.sendToBack(obj);
  });
  
  canvas.renderAll();
  return gridObjects;
};
