
/**
 * Grid Visibility Manager
 * Provides robust functionality to ensure grid visibility and maintenance
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { createGrid } from '@/utils/canvasGrid';

/**
 * Checks if grid exists and is properly visible
 * @param canvas Fabric canvas instance
 * @returns Grid status information
 */
export function checkGridStatus(canvas: FabricCanvas | null): { 
  exists: boolean;
  visible: boolean;
  count: number;
  visibleCount: number;
} {
  if (!canvas) {
    return { exists: false, visible: false, count: 0, visibleCount: 0 };
  }

  // Find grid objects
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  const visibleGridObjects = gridObjects.filter(obj => obj.visible === true);
  
  return {
    exists: gridObjects.length > 0,
    visible: visibleGridObjects.length > 0,
    count: gridObjects.length,
    visibleCount: visibleGridObjects.length
  };
}

/**
 * Ensures grid is visible and recreates if necessary
 * @param canvas Fabric canvas instance
 * @returns Information about the operation
 */
export function ensureGridIsPresent(canvas: FabricCanvas | null): {
  success: boolean;
  action: 'none' | 'fixed' | 'created';
  gridObjects: FabricObject[];
} {
  if (!canvas) {
    return { success: false, action: 'none', gridObjects: [] };
  }

  try {
    // Get current grid status
    const status = checkGridStatus(canvas);
    
    // If grid exists but is not fully visible, fix visibility
    if (status.exists && status.visibleCount < status.count) {
      logger.info('Grid exists but some objects are not visible, fixing visibility');
      
      // Find grid objects
      const gridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      // Make all grid objects visible
      gridObjects.forEach(obj => {
        obj.set('visible', true);
      });
      
      // Send all grid objects to back
      gridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      canvas.requestRenderAll();
      
      return { 
        success: true, 
        action: 'fixed', 
        gridObjects 
      };
    }
    
    // If grid doesn't exist or has too few objects, create new grid
    if (!status.exists || status.count < 10) {
      logger.info('Grid missing or insufficient, creating new grid');
      
      // Remove any existing partial grid
      const existingGrid = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      existingGrid.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Create new grid
      const gridObjects = createGrid(canvas);
      
      // Force render
      canvas.requestRenderAll();
      
      return { 
        success: true, 
        action: 'created', 
        gridObjects 
      };
    }
    
    // Grid is already present and visible
    return { 
      success: true, 
      action: 'none', 
      gridObjects: canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      ) 
    };
  } catch (error) {
    logger.error('Error ensuring grid presence:', error);
    return { success: false, action: 'none', gridObjects: [] };
  }
}

/**
 * Sets up automatic grid monitoring at regular intervals
 * @param canvas Fabric canvas instance
 * @param interval Check interval in milliseconds
 * @returns Cleanup function to stop monitoring
 */
export function setupGridMonitoring(
  canvas: FabricCanvas | null,
  interval = 5000
): () => void {
  if (!canvas) {
    return () => {};
  }
  
  // Set up monitoring interval
  const monitoringInterval = setInterval(() => {
    const status = checkGridStatus(canvas);
    
    // Only fix if grid doesn't exist or is not visible
    if (!status.exists || status.visibleCount === 0) {
      logger.info('Grid monitoring detected missing grid, fixing');
      const result = ensureGridIsPresent(canvas);
      
      if (result.action === 'created') {
        logger.info(`Created new grid with ${result.gridObjects.length} objects`);
      } else if (result.action === 'fixed') {
        logger.info(`Fixed visibility for ${result.gridObjects.length} grid objects`);
      }
    }
  }, interval);
  
  // Return cleanup function
  return () => {
    clearInterval(monitoringInterval);
  };
}

/**
 * Add a global helper function for emergency grid fixes
 * Available in console as window.fixGridVisibility()
 */
if (typeof window !== 'undefined') {
  (window as any).fixGridVisibility = function() {
    const canvas = (window as any).fabricCanvas;
    if (!canvas) {
      console.error('No canvas available');
      return { success: false };
    }
    
    console.log('Running emergency grid fix...');
    const result = ensureGridIsPresent(canvas);
    
    console.log('Grid fix result:', result);
    return result;
  };
}
