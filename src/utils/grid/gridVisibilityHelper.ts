
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
        console.log('Added missing grid object to canvas');
      }
      
      // Ensure objects are visible
      if (!obj.visible) {
        obj.set('visible', true);
        fixesApplied = true;
        console.log('Made invisible grid object visible');
      }
      
      // Send grid to back
      canvas.sendObjectToBack(obj);
    });
    
    if (fixesApplied) {
      canvas.requestRenderAll();
      console.log(`Fixed visibility for ${gridObjects.length} grid objects`);
      // Add multiple force renders to ensure grid is visible
      setTimeout(() => {
        canvas.requestRenderAll();
        logger.info('Forcing canvas re-render to ensure grid visibility');
        
        // Double-check after a short delay
        setTimeout(() => {
          const stillMissing = gridObjects.filter(obj => !canvas.contains(obj));
          if (stillMissing.length > 0) {
            console.warn(`Still missing ${stillMissing.length} grid objects, forcing another fix`);
            stillMissing.forEach(obj => {
              canvas.add(obj);
              canvas.sendObjectToBack(obj);
            });
            canvas.requestRenderAll();
          }
        }, 100);
      }, 50);
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
  
  // Set up periodic check with higher frequency initially
  const initialIntervalId = setInterval(() => {
    const fixed = ensureGridVisibility(canvas, gridObjects);
    if (fixed) {
      logger.info('Automatically fixed grid visibility (initial check)');
    }
  }, 500); // Check more frequently at first
  
  // After initial period, switch to less frequent checks
  setTimeout(() => {
    clearInterval(initialIntervalId);
    
    const regularIntervalId = setInterval(() => {
      const fixed = ensureGridVisibility(canvas, gridObjects);
      if (fixed) {
        logger.info('Automatically fixed grid visibility');
      }
    }, 3000);
    
    // Return a cleanup function that clears both intervals
    return () => {
      clearInterval(regularIntervalId);
    };
  }, 5000);
  
  // Return a cleanup function for the initial interval
  return () => {
    clearInterval(initialIntervalId);
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
        // Make sure all grid objects are visible
        newGrid.forEach(obj => {
          obj.set('visible', true);
          canvas.sendObjectToBack(obj);
        });
        
        toast.success(`Grid fixed: Created ${newGrid.length} grid objects`);
        
        // Force multiple renders after grid creation
        canvas.requestRenderAll();
        setTimeout(() => {
          canvas.requestRenderAll();
          logger.info('Forced render after emergency grid fix');
          
          // One more render for good measure
          setTimeout(() => {
            canvas.requestRenderAll();
          }, 150);
        }, 50);
      } else {
        toast.error('Failed to create new grid');
      }
    } catch (error) {
      console.error('Error in emergency grid fix:', error);
      toast.error('Error fixing grid');
    }
  };
}

/**
 * Check if grid needs to be fixed and apply fixes
 * @param canvas The fabric canvas
 * @param gridObjects Array of grid objects
 * @returns Whether grid was fixed
 */
export function checkAndFixGrid(
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  try {
    // Check if grid objects are on canvas and visible
    const missingObjects = gridObjects.filter(obj => !canvas.contains(obj));
    const invisibleObjects = gridObjects.filter(obj => canvas.contains(obj) && !obj.visible);
    
    // Apply fixes if needed
    if (missingObjects.length > 0 || invisibleObjects.length > 0) {
      logger.info(`Found grid issues: ${missingObjects.length} missing, ${invisibleObjects.length} invisible`);
      
      // Add missing objects
      missingObjects.forEach(obj => {
        canvas.add(obj);
        canvas.sendObjectToBack(obj);
      });
      
      // Make invisible objects visible
      invisibleObjects.forEach(obj => {
        obj.set('visible', true);
      });
      
      // Force multiple renders
      canvas.requestRenderAll();
      setTimeout(() => canvas.requestRenderAll(), 100);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking and fixing grid:', error);
    return false;
  }
}

// Expose emergency grid fix function to window for debugging
if (typeof window !== 'undefined') {
  (window as any).fixCanvasGrid = function(canvasInstance?: FabricCanvas) {
    // Try to get the canvas from the window or use the provided instance
    const canvas = canvasInstance || (window as any).fabricCanvas;
    if (!canvas) {
      console.error('No canvas available for fixing grid');
      return;
    }
    
    try {
      // Get dimensions for emergency grid
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      
      // Remove any existing grid
      const existingGrid = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      existingGrid.forEach(obj => canvas.remove(obj));
      
      // Create grid lines
      const gridSize = 20;
      const gridObjects = [];
      
      // Create vertical grid lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new fabric.Line([i, 0, i, height], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible: true
        } as any);
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Create horizontal grid lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new fabric.Line([0, i, width, i], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible: true
        } as any);
        
        canvas.add(line);
        canvas.sendToBack(line);
        gridObjects.push(line);
      }
      
      // Force multiple renders
      canvas.requestRenderAll();
      setTimeout(() => canvas.requestRenderAll(), 50);
      setTimeout(() => canvas.requestRenderAll(), 150);
      
      console.log(`Emergency grid fix created ${gridObjects.length} grid objects`);
      return gridObjects;
      
    } catch (error) {
      console.error('Error in emergency grid fix:', error);
      return [];
    }
  };
}
