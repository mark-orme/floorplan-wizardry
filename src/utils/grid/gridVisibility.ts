
/**
 * Grid visibility utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';
import { createBasicEmergencyGrid } from './gridRenderers';

// Track the last time grid visibility was checked to prevent excessive checks
const lastCheckTime = {
  value: 0
};

// Track whether grid has been successfully created to avoid repeated attempts
const gridCreationState = {
  created: false,
  attempts: 0,
  maxAttempts: 5
};

/**
 * Ensure grid is visible on canvas
 * @param canvas - Fabric canvas
 * @param gridObjects - Optional array of grid objects to check
 * @returns Whether visibility fixes were applied
 */
export function ensureGridVisibility(
  canvas: FabricCanvas,
  gridObjects?: FabricObject[]
): boolean {
  // Throttle checks to once per 5 seconds maximum to reduce console spam
  const now = Date.now();
  if (now - lastCheckTime.value < 5000) {
    return false;
  }
  lastCheckTime.value = now;

  if (!canvas) {
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    let gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If no grid items found, create an emergency grid
    if (gridItems.length === 0) {
      if (gridCreationState.attempts >= gridCreationState.maxAttempts) {
        return false; // Stop trying after too many attempts
      }
      
      gridCreationState.attempts++;
      gridItems = createBasicEmergencyGrid(canvas);
      
      if (gridItems.length === 0) {
        return false;
      }
      
      gridCreationState.created = true;
    }
    
    // Check if any grid object is not visible
    let visibilityChanged = false;
    
    gridItems.forEach(obj => {
      // Fix visibility
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityChanged = true;
      }
      
      // Ensure grid objects are at the back
      try {
        canvas.sendObjectToBack(obj);
      } catch (err) {
        // If sendObjectToBack fails, it's likely the object is already at the back
      }
    });
    
    // Only render if changes were made
    if (visibilityChanged) {
      // Force render to ensure changes are applied
      canvas.renderAll();
    }
    
    return visibilityChanged;
  } catch (error) {
    // Silently handle errors to reduce console spam
    return false;
  }
}

/**
 * Set visibility of grid objects
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 * @param gridObjects - Optional array of grid objects
 * @returns Whether operation succeeded
 */
export function setGridVisibility(
  canvas: FabricCanvas,
  visible: boolean,
  gridObjects?: FabricObject[]
): boolean {
  if (!canvas) {
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    let gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridItems.length === 0) {
      // If no grid items found and we want to make grid visible, create an emergency grid
      if (visible) {
        gridItems = createBasicEmergencyGrid(canvas);
        
        if (gridItems.length === 0) {
          return false;
        }
      } else {
        return false;
      }
    }
    
    // Set visibility for all grid objects
    gridItems.forEach(obj => {
      obj.set('visible', visible);
    });
    
    // Force render to ensure changes are applied
    canvas.renderAll();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Force grid creation and visibility
 * This is a more aggressive approach that ensures a grid exists and is visible
 * @param canvas - Fabric canvas
 * @returns Whether operation succeeded
 */
export function forceGridCreationAndVisibility(
  canvas: FabricCanvas
): boolean {
  if (!canvas) {
    return false;
  }
  
  try {
    // Reset grid creation state
    gridCreationState.created = false;
    gridCreationState.attempts = 0;
    
    // Clear any existing grid objects that might be problematic
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (existingGrid.length > 0) {
      existingGrid.forEach(obj => {
        canvas.remove(obj);
      });
    }
    
    // Create new emergency grid
    const gridItems = createBasicEmergencyGrid(canvas);
    
    if (gridItems.length === 0) {
      return false;
    }
    
    // Ensure grid items are visible and at the back
    gridItems.forEach(obj => {
      obj.set('visible', true);
      canvas.sendObjectToBack(obj);
    });
    
    // Force render
    canvas.renderAll();
    
    // Mark as created
    gridCreationState.created = true;
    return true;
  } catch (error) {
    return false;
  }
}
