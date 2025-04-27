
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';
import { SMALL_GRID_COLOR } from '@/constants/gridConstants';

/**
 * Creates a simple grid of lines on the canvas
 * @param canvas The Fabric.js canvas
 * @param gridSize The size of the grid cells
 * @param color The color of the grid lines
 * @returns Array of the created grid objects
 */
export function createSimpleGrid(
  canvas: FabricCanvas, 
  gridSize = 20, 
  color = SMALL_GRID_COLOR
): FabricObject[] {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const objects: ExtendedFabricObject[] = [];

  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const isLargeLine = x % (gridSize * 5) === 0;
    const line = createFabricLine([x, 0, x, height], {
      stroke: isLargeLine ? '#c0c0c0' : color,
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      isGrid: true,
      isLargeGrid: isLargeLine
    }) as ExtendedFabricObject;
    
    canvas.add(line);
    objects.push(line);
  }

  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    const isLargeLine = y % (gridSize * 5) === 0;
    const line = createFabricLine([0, y, width, y], {
      stroke: isLargeLine ? '#c0c0c0' : color,
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      isGrid: true,
      isLargeGrid: isLargeLine
    }) as ExtendedFabricObject;
    
    canvas.add(line);
    objects.push(line);
  }

  return objects;
}

/**
 * Ensures grid is visible
 * @param gridObjects Array of grid objects
 * @param visible Whether grid should be visible
 */
export function ensureGridVisible(
  gridObjects: FabricObject[],
  visible = true
): void {
  gridObjects.forEach(obj => {
    if (obj && typeof obj.set === 'function') {
      obj.set('visible', visible);
    }
  });
}
