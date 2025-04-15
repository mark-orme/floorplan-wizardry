
/**
 * Grid visibility helper utility
 * Provides functions for ensuring grid is visible and property maintained
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Ensures grid objects are visible and properly positioned
 * @param canvas The fabric canvas instance
 * @param gridObjects Array of grid objects to manage
 * @returns Whether any fixes were applied
 */
export function ensureGridVisibility(
  canvas: FabricCanvas | null, 
  gridObjects: FabricObject[]
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    console.warn('Cannot ensure grid visibility: Invalid canvas or grid objects');
    return false;
  }

  let fixesApplied = false;
  
  try {
    // Check if each grid object is on canvas and visible
    gridObjects.forEach(obj => {
      // Add objects not on canvas
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        fixesApplied = true;
      }
      
      // Ensure objects are visible
      if (!obj.visible) {
        obj.set('visible', true);
        fixesApplied = true;
      }
      
      // Send grid to back
      canvas.sendObjectToBack(obj);
    });
    
    if (fixesApplied) {
      canvas.requestRenderAll();
      console.log(`Fixed visibility for ${gridObjects.length} grid objects`);
    }
    
    return fixesApplied;
  } catch (error) {
    console.error('Error ensuring grid visibility:', error);
    return false;
  }
}

/**
 * Sets up a periodic check to ensure grid remains visible
 * @param canvas The fabric canvas instance 
 * @param gridObjects Array of grid objects to manage
 * @returns Cleanup function to stop periodic checks
 */
export function setupGridVisibilityCheck(
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): () => void {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return () => {};
  }
  
  // Immediately ensure visibility
  ensureGridVisibility(canvas, gridObjects);
  
  // Set up periodic check
  const intervalId = setInterval(() => {
    const fixed = ensureGridVisibility(canvas, gridObjects);
    if (fixed) {
      logger.info('Automatically fixed grid visibility');
    }
  }, 3000);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Creates an emergency fix function for the grid
 * @param canvas The fabric canvas
 * @param gridGenerator Function to regenerate the grid
 */
export function createGridEmergencyFix(
  canvas: FabricCanvas | null,
  gridGenerator: () => FabricObject[]
): () => void {
  return () => {
    if (!canvas) {
      toast.error('Cannot fix grid: Canvas not available');
      return;
    }
    
    try {
      // Remove existing grid objects
      const existingGrid = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      if (existingGrid.length > 0) {
        console.log(`Removing ${existingGrid.length} existing grid objects`);
        existingGrid.forEach(obj => canvas.remove(obj));
      }
      
      // Create new grid
      const newGrid = gridGenerator();
      
      if (newGrid && newGrid.length > 0) {
        toast.success(`Grid fixed: Created ${newGrid.length} grid objects`);
      } else {
        toast.error('Failed to create new grid');
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error in emergency grid fix:', error);
      toast.error('Error fixing grid');
    }
  };
}
