
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Create a reliable grid on the canvas
 * @param canvas Fabric canvas instance
 * @param gridLayerRef Reference to store grid objects
 * @returns Array of created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    // Clear any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Get canvas dimensions
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Update ref
    gridLayerRef.current = gridObjects;
    
    // Force render
    canvas.requestRenderAll();
    console.log(`Created ${gridObjects.length} grid objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Ensure grid visibility on canvas
 * @param canvas Fabric canvas instance
 * @param gridLayerRef Reference to grid objects
 * @returns Whether any fixes were applied
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    const gridObjects = gridLayerRef.current;
    if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
      // Create new grid if missing
      createReliableGrid(canvas, gridLayerRef);
      return true;
    }
    
    let fixesApplied = false;
    
    // Check if all grid objects are on canvas
    const missingObjects = gridObjects.filter(obj => !canvas.contains(obj));
    if (missingObjects.length > 0) {
      if (missingObjects.length === gridObjects.length) {
        // All grid objects are missing, recreate grid
        createReliableGrid(canvas, gridLayerRef);
      } else {
        // Add missing objects back to canvas
        missingObjects.forEach(obj => {
          canvas.add(obj);
        });
      }
      fixesApplied = true;
    }
    
    if (fixesApplied) {
      canvas.requestRenderAll();
    }
    
    return fixesApplied;
  } catch (error) {
    console.error("Error ensuring grid visibility:", error);
    return false;
  }
};
