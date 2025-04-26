/**
 * Grid Visibility Manager
 * Provides utilities for ensuring grid visibility and presence
 * @module utils/grid/gridVisibilityManager
 */
import { Canvas } from 'fabric';
import { GridLine } from './gridTypes';
import { createGrid, isGridObject } from './gridRenderers';

interface GridVisibilityResult {
  success: boolean;
  gridObjects: GridLine[];
  action: 'none' | 'created' | 'fixed';
  message?: string;
}

/**
 * Ensure grid is present on the canvas
 * @param canvas Fabric canvas
 * @returns Result of grid presence check
 */
export function ensureGridIsPresent(canvas: Canvas): GridVisibilityResult {
  if (!canvas) {
    return {
      success: false,
      gridObjects: [],
      action: 'none',
      message: 'Canvas is null'
    };
  }

  let gridObjects = canvas.getObjects().filter(obj => isGridObject(obj)) as GridLine[];
  
  // If grid exists, ensure visibility
  if (gridObjects.length > 0) {
    let fixedCount = 0;
    
    // Fix any hidden grid objects
    gridObjects.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        fixedCount++;
      }
    });
    
    if (fixedCount > 0) {
      canvas.requestRenderAll();
      
      return {
        success: true,
        gridObjects,
        action: 'fixed',
        message: `Fixed visibility for ${fixedCount} grid objects`
      };
    }
    
    // Grid exists and is visible
    return {
      success: true,
      gridObjects,
      action: 'none',
      message: 'Grid already exists'
    };
  }
  
  // Create grid if it doesn't exist
  const newGridObjects = createGrid(canvas);
  
  return {
    success: newGridObjects.length > 0,
    gridObjects: newGridObjects,
    action: 'created',
    message: `Created grid with ${newGridObjects.length} objects`
  };
}

/**
 * Check if grid is visible
 * @param canvas Fabric canvas
 * @returns Whether grid is visible
 */
export function isGridVisible(canvas: Canvas): boolean {
  if (!canvas) return false;
  
  const gridObjects = canvas.getObjects().filter(obj => isGridObject(obj));
  if (gridObjects.length === 0) return false;
  
  return gridObjects.some(obj => obj.visible);
}
