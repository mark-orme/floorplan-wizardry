/**
 * Grid safeguards utility
 * Contains functions to ensure grid is always visible and properly created
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Verifies grid exists and is visible, recreates if needed
 * @param canvas - Fabric canvas instance
 * @param createGrid - Function to create grid if missing
 * @returns Whether grid exists and is visible
 */
export function verifyGridVisibility(
  canvas: FabricCanvas,
  createGrid?: () => FabricObject[]
): boolean {
  if (!canvas) return false;
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // Check if grid exists with sufficient objects
    if (gridObjects.length < 10) { // Default for MIN_GRID_OBJECTS
      logger.warn(`Grid missing or insufficient: ${gridObjects.length} objects found`);
      
      if (createGrid && true) { // Default for AUTO_RECREATE_ON_EMPTY
        logger.info("Auto-recreating grid");
        createGrid();
        return true;
      }
      
      return false;
    }
    
    // Check visibility of grid objects
    const visibleObjects = gridObjects.filter(obj => obj.visible === true);
    
    if (visibleObjects.length < gridObjects.length) {
      logger.warn(`Grid partially invisible: ${visibleObjects.length}/${gridObjects.length} objects visible`);
      
      // Make all grid objects visible
      gridObjects.forEach(obj => {
        obj.set('visible', true);
      });
      
      canvas.requestRenderAll();
    }
    
    return visibleObjects.length > 0;
  } catch (error) {
    logger.error("Error checking grid visibility:", error);
    return false;
  }
}

/**
 * Dev-only function to verify grid integrity
 * Logs warnings if grid is missing or corrupt
 */
export function logGridState(canvas: FabricCanvas): void {
  if (!canvas) {
    console.warn("[GRID CHECK] Canvas not available");
    return;
  }
  
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  const smallGridLines = gridObjects.filter(obj => 
    (obj as any).strokeWidth === GRID_CONSTANTS.SMALL_GRID_WIDTH
  );
  
  const largeGridLines = gridObjects.filter(obj => 
    (obj as any).strokeWidth === GRID_CONSTANTS.LARGE_GRID_WIDTH
  );
  
  console.log("[GRID STATE]", {
    totalObjects: allObjects.length,
    gridObjects: gridObjects.length,
    smallGridLines: smallGridLines.length,
    largeGridLines: largeGridLines.length,
    visible: gridObjects.filter(obj => obj.visible).length
  });
}

/**
 * Monitors grid state and fixes issues automatically
 * @param canvas - Fabric canvas instance
 * @param createGrid - Function to create grid
 */
export function setupGridMonitoring(
  canvas: FabricCanvas,
  createGrid: () => FabricObject[]
): () => void {
  // Initial verification
  verifyGridVisibility(canvas, createGrid);
  
  // Set up interval to periodically check grid
  const intervalId = setInterval(() => {
    if (!verifyGridVisibility(canvas, createGrid)) {
      toast.error("Grid visibility issue detected, attempting to fix");
      createGrid();
    }
  }, 10000); // Default for GRID_CHECK_INTERVAL
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

// Expose a global function for dev debugging
if (typeof window !== 'undefined') {
  (window as any).fixGrid = (canvas?: FabricCanvas) => {
    const targetCanvas = canvas || (window as any).fabricCanvas;
    if (!targetCanvas) {
      console.error("No canvas available for grid fix");
      return;
    }
    
    // Force remove all grid objects
    const gridObjects = targetCanvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    gridObjects.forEach(obj => {
      targetCanvas.remove(obj);
    });
    
    // Force recreate grid
    const { createCompleteGrid } = require('./grid/gridRenderers');
    const newGrid = createCompleteGrid(targetCanvas);
    
    console.log(`Grid recreated with ${newGrid.length} objects`);
    targetCanvas.requestRenderAll();
    
    return newGrid;
  };
}
