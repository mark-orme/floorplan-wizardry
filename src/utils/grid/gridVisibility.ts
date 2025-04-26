
/**
 * Grid visibility utilities
 * Functions to manage grid visibility
 * @module grid/gridVisibility
 */
import { Canvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

export interface GridVisibilityOptions {
  visible: boolean;
  redraw?: boolean;
  updateCanvas?: boolean;
}

export interface GridVisibilityMap {
  smallGrid: boolean;
  largeGrid: boolean;
  markers: boolean;
  labels: boolean;
}

/**
 * Set visibility for all grid objects
 * @param canvas - The canvas containing the grid
 * @param gridObjects - Array of grid objects
 * @param visible - Whether grid should be visible
 * @returns Success status
 */
export function setGridVisibility(
  canvas: Canvas,
  gridObjects: FabricObject[],
  visible: boolean
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }

  try {
    // Update visibility for all grid objects
    gridObjects.forEach((obj) => {
      obj.set('visible', visible);
    });

    // Render canvas to show changes
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error setting grid visibility:', error);
    return false;
  }
}

/**
 * Toggle grid visibility
 * @param canvas - The canvas containing the grid
 * @param gridObjects - Array of grid objects
 * @returns New visibility state
 */
export function toggleGridVisibility(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }

  // Determine current visibility (use first grid object as reference)
  const isVisible = gridObjects[0]?.visible || false;
  
  // Toggle to opposite visibility
  return setGridVisibility(canvas, gridObjects, !isVisible);
}

/**
 * Set visibility for different grid components
 * @param canvas - The canvas containing the grid
 * @param gridMap - Map of grid objects by type
 * @param visibilityMap - Map of visibility settings by type
 * @returns Success status
 */
export function setDetailedGridVisibility(
  canvas: Canvas,
  gridMap: Record<string, FabricObject[]>,
  visibilityMap: GridVisibilityMap
): boolean {
  if (!canvas || !gridMap) {
    return false;
  }

  try {
    // Set visibility for small grid lines
    if (gridMap.smallGrid) {
      gridMap.smallGrid.forEach(obj => {
        obj.set('visible', visibilityMap.smallGrid);
      });
    }

    // Set visibility for large grid lines
    if (gridMap.largeGrid) {
      gridMap.largeGrid.forEach(obj => {
        obj.set('visible', visibilityMap.largeGrid);
      });
    }

    // Set visibility for markers
    if (gridMap.markers) {
      gridMap.markers.forEach(obj => {
        obj.set('visible', visibilityMap.markers);
      });
    }

    // Set visibility for labels
    if (gridMap.labels) {
      gridMap.labels.forEach(obj => {
        obj.set('visible', visibilityMap.labels);
      });
    }

    // Render canvas to show changes
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error('Error setting detailed grid visibility:', error);
    return false;
  }
}
