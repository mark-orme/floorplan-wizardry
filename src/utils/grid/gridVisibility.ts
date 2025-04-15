
/**
 * Grid Visibility Utilities
 * Helper functions to ensure grid is created and visible
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Force grid creation and visibility if it doesn't exist or isn't visible
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects or empty array if creation failed
 */
export function forceGridCreationAndVisibility(canvas: FabricCanvas): FabricObject[] {
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
    return createBasicGrid(canvas);
  } catch (error) {
    logger.error('Failed to create grid:', error);
    console.error('Failed to create grid:', error);
    toast.error('Failed to create grid');
    return [];
  }
}

/**
 * Create a basic grid for the canvas
 * Simple implementation to ensure grid is always available
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects
 */
function createBasicGrid(canvas: FabricCanvas): FabricObject[] {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas.width || !canvas.height) {
    logger.error('Canvas dimensions are invalid, cannot create grid');
    return [];
  }
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal grid lines
  for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const lineProps = {
      left: 0,
      top: i,
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    };
    
    // @ts-ignore - Adding custom property
    const line = new fabric.Line([0, i, width, i], lineProps);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const lineProps = {
      left: i,
      top: 0,
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    };
    
    // @ts-ignore - Adding custom property
    const line = new fabric.Line([i, 0, i, height], lineProps);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create larger grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const lineProps = {
      left: i,
      top: 0,
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    };
    
    // @ts-ignore - Adding custom property
    const line = new fabric.Line([i, 0, i, height], lineProps);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const lineProps = {
      left: 0,
      top: i,
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid',
      isGrid: true
    };
    
    // @ts-ignore - Adding custom property
    const line = new fabric.Line([0, i, i, height], lineProps);
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Make sure grid is at the back
  gridObjects.forEach(obj => canvas.sendToBack(obj));
  
  // Ensure visibility
  canvas.requestRenderAll();
  
  logger.info(`Created ${gridObjects.length} grid objects`);
  return gridObjects;
}

/**
 * Create a simple util function to create grid via console
 * For emergency use when grid isn't visible
 */
if (typeof window !== 'undefined') {
  (window as any).fixGrid = function() {
    if ((window as any).fabricCanvas) {
      const canvas = (window as any).fabricCanvas;
      console.log('Fixing grid with emergency utility...');
      const gridObjects = forceGridCreationAndVisibility(canvas);
      console.log(`Emergency grid fix: created/fixed ${gridObjects.length} grid objects`);
      toast.success(`Grid fixed with ${gridObjects.length} objects`);
      return gridObjects;
    } else {
      console.error('No fabric canvas found on window');
      toast.error('No fabric canvas found');
      return [];
    }
  };
}
