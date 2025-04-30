
import { Canvas } from 'fabric';
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/fabric-unified';

/**
 * Ensure grid visibility
 * @param canvas The canvas instance
 * @param visible Whether grid should be visible
 * @returns Success status
 */
export const ensureGridVisibility = (
  canvas: ExtendedFabricCanvas | Canvas, 
  visible: boolean
): boolean => {
  if (!canvas) return false;

  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as ExtendedFabricObject).isGrid === true
    );
    
    // Set visibility
    gridObjects.forEach(obj => {
      obj.visible = visible;
    });
    
    // Request render
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    console.error('Error setting grid visibility:', error);
    return false;
  }
};

/**
 * Set grid visibility
 * @param canvas The canvas instance
 * @param visible Whether grid should be visible
 */
export const setGridVisibility = (
  canvas: ExtendedFabricCanvas | Canvas, 
  visible: boolean
) => {
  ensureGridVisibility(canvas, visible);
};

/**
 * Get grid objects from canvas
 * @param canvas The canvas instance
 * @returns Grid objects
 */
export const getGridObjects = (
  canvas: ExtendedFabricCanvas | Canvas
): ExtendedFabricObject[] => {
  if (!canvas) return [];
  
  return canvas.getObjects().filter(obj => 
    (obj as ExtendedFabricObject).isGrid === true
  ) as ExtendedFabricObject[];
};

/**
 * Force grid creation and visibility
 * @param canvas The canvas instance
 * @param visible Whether grid should be visible
 * @param createGridFn Function to create grid
 */
export const forceGridCreationAndVisibility = (
  canvas: ExtendedFabricCanvas | Canvas,
  visible: boolean,
  createGridFn?: () => void
) => {
  if (!canvas) return;
  
  // Get existing grid objects
  const gridObjects = getGridObjects(canvas);
  
  // If no grid objects and create function provided, create grid
  if (gridObjects.length === 0 && createGridFn) {
    createGridFn();
  }
  
  // Set visibility
  ensureGridVisibility(canvas, visible);
};
