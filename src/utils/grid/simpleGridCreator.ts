
/**
 * Simple Grid Creator
 * Provides reliable and simplified grid creation functions
 * @module utils/grid/simpleGridCreator
 */

import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createSimpleGrid } from './simpleGrid';
import { runGridDiagnostics } from './gridDiagnostics';
import { retryWithBackoff } from './gridCreationUtils';

/**
 * Create a reliable grid with retry mechanism
 * @param canvas Fabric canvas
 * @param gridLayerRef Reference to grid objects
 * @returns Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error('Cannot create reliable grid: Canvas not available');
    return [];
  }
  
  try {
    // Clear any existing grid first
    if (gridLayerRef.current.length > 0) {
      // Clear existing grid
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create a new grid with retry mechanism
    const createGridWithRetry = async (): Promise<FabricObject[]> => {
      try {
        return createSimpleGrid(canvas);
      } catch (error) {
        console.error('Error in grid creation, retrying:', error);
        return [];
      }
    };
    
    // Use the retryWithBackoff utility
    retryWithBackoff(createGridWithRetry, 3)
      .then(gridObjects => {
        if (gridObjects.length > 0) {
          gridLayerRef.current = gridObjects;
          canvas.requestRenderAll();
          
          // Run diagnostics to verify grid health
          const diagnostics = runGridDiagnostics(canvas, gridObjects);
          console.log('Grid diagnostics:', diagnostics);
        }
      })
      .catch(error => {
        console.error('Failed to create grid after retries:', error);
      });
    
    // Return the initial grid objects immediately
    // The retry mechanism will update gridLayerRef asynchronously if needed
    const initialGridObjects = createSimpleGrid(canvas);
    gridLayerRef.current = initialGridObjects;
    
    return initialGridObjects;
  } catch (error) {
    console.error('Error in createReliableGrid:', error);
    return [];
  }
};

/**
 * Ensure grid is visible on canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects
 * @returns Whether grid visibility was ensured
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || gridObjects.length === 0) return false;
  
  try {
    let visibilityChanged = false;
    
    // Check if any grid objects are hidden
    const hiddenObjects = gridObjects.filter(obj => !obj.visible);
    
    if (hiddenObjects.length > 0) {
      // Make all grid objects visible
      hiddenObjects.forEach(obj => {
        obj.visible = true;
        visibilityChanged = true;
      });
      
      // Force render if visibility changed
      if (visibilityChanged) {
        canvas.requestRenderAll();
      }
    }
    
    return visibilityChanged;
  } catch (error) {
    console.error('Error ensuring grid visibility:', error);
    return false;
  }
};
