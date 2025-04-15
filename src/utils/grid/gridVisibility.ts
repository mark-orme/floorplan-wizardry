
/**
 * Grid Visibility Utilities
 * Helper functions to ensure grid is created and visible
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { createGrid } from '@/utils/canvasGrid';

/**
 * Ensure grid visibility - creates grid if none exists or makes existing grid visible
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects or empty array if creation failed
 */
export const ensureGridVisibility = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.warn('Cannot ensure grid visibility: Canvas is null');
    return [];
  }

  // Check if grid exists
  const existingGridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );

  // If grid already exists, make sure it's visible
  if (existingGridObjects.length > 0) {
    logger.info(`Found ${existingGridObjects.length} existing grid objects, ensuring visibility`);
    
    existingGridObjects.forEach(obj => {
      obj.set('visible', true);
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
    return existingGridObjects;
  }

  // If no grid exists, create it
  logger.info('No grid found, creating new grid');
  try {
    return createGrid(canvas);
  } catch (error) {
    logger.error('Failed to create grid:', error);
    console.error('Failed to create grid:', error);
    toast.error('Failed to create grid');
    return [];
  }
};

/**
 * Set grid visibility
 * @param canvas Fabric canvas instance
 * @param visible Whether grid should be visible
 */
export const setGridVisibility = (
  canvas: FabricCanvas,
  visible: boolean
): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  
  canvas.requestRenderAll();
  logger.info(`Grid visibility set to ${visible}`);
};

/**
 * Force grid creation and visibility if it doesn't exist or isn't visible
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects or empty array if creation failed
 */
export const forceGridCreationAndVisibility = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.warn('Cannot create grid: Canvas is null');
    return [];
  }

  // Check if grid exists
  const existingGridObjects = canvas.getObjects().filter(
    obj => (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );

  // If grid already exists, make sure it's visible
  if (existingGridObjects.length > 0) {
    logger.info(`Found ${existingGridObjects.length} existing grid objects, ensuring visibility`);
    
    existingGridObjects.forEach(obj => {
      obj.set('visible', true);
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
    return existingGridObjects;
  }

  // If no grid exists, create it
  logger.info('No grid found, creating new grid');
  try {
    return createGrid(canvas);
  } catch (error) {
    logger.error('Failed to create grid:', error);
    console.error('Failed to create grid:', error);
    toast.error('Failed to create grid');
    return [];
  }
};

/**
 * Create a global utility for fixing grid issues via console
 */
if (typeof window !== 'undefined') {
  (window as any).fixGrid = function(canvas?: FabricCanvas) {
    try {
      const targetCanvas = canvas || (window as any).fabricCanvas;
      if (!targetCanvas) {
        console.error('No fabric canvas found');
        toast.error('No fabric canvas found');
        return [];
      }
      
      console.log('Fixing grid with emergency utility...');
      const gridObjects = forceGridCreationAndVisibility(targetCanvas);
      console.log(`Emergency grid fix: created/fixed ${gridObjects.length} grid objects`);
      toast.success(`Grid fixed with ${gridObjects.length} objects`);
      return gridObjects;
    } catch (error) {
      console.error('Error running grid fix utility:', error);
      toast.error('Error fixing grid');
      return [];
    }
  };
}
