
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/fabric-unified';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Force grid creation and visibility
 * @param canvas The fabric canvas
 * @param visible Whether the grid should be visible
 * @param gridSize Grid size
 */
export const forceGridCreationAndVisibility = (
  canvas: ExtendedFabricCanvas | null, 
  visible: boolean = true,
  gridSize: number = GRID_CONSTANTS.SMALL_GRID_SIZE
): ExtendedFabricObject[] => {
  if (!canvas) return [];
  
  // Remove any existing grid lines
  const existingGridLines = canvas.getObjects().filter(obj => 
    (obj as ExtendedFabricObject).isGrid === true
  );
  
  existingGridLines.forEach(line => {
    canvas.remove(line);
  });
  
  // If not visible, just return an empty array
  if (!visible) {
    return [];
  }
  
  // Create grid lines
  const gridLines: ExtendedFabricObject[] = [];
  const width = canvas.getWidth?.() || 1000;
  const height = canvas.getHeight?.() || 1000;
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const isLargeLine = x % (gridSize * 5) === 0;
    const line = new fabric.Line([x, 0, x, height], {
      stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      excludeFromExport: true
    }) as ExtendedFabricObject;
    
    line.isGrid = true;
    line.isLargeGrid = isLargeLine;
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    const isLargeLine = y % (gridSize * 5) === 0;
    const line = new fabric.Line([0, y, width, y], {
      stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      excludeFromExport: true
    }) as ExtendedFabricObject;
    
    line.isGrid = true;
    line.isLargeGrid = isLargeLine;
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Send all grid lines to back
  gridLines.forEach(line => {
    canvas.sendToBack(line);
  });
  
  canvas.renderAll();
  return gridLines;
};
