
import { Canvas as FabricCanvas } from 'fabric';
import { GridLine } from './gridTypes';

/**
 * Set grid visibility
 * @param canvas The canvas containing the grid
 * @param gridObjects Array of grid objects
 * @param visible Whether the grid should be visible
 */
export function setGridVisibility(canvas: FabricCanvas, gridObjects: GridLine[], visible: boolean): void {
  if (!canvas || !gridObjects.length) return;
  
  try {
    gridObjects.forEach(obj => {
      if (obj) {
        obj.visible = visible;
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error('Error setting grid visibility:', error);
  }
}

/**
 * Bridge function for backward compatibility
 * @param canvas The canvas containing the grid
 * @param gridObjects Array of grid objects
 * @param visible Whether the grid should be visible
 */
export function ensureGridVisibility(canvas: FabricCanvas, gridObjects: GridLine[], visible: boolean): void {
  setGridVisibility(canvas, gridObjects, visible);
}
