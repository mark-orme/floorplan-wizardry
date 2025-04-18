
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';

/**
 * Creates a basic emergency grid on canvas
 * This simpler approach is more reliable on mobile devices
 * @param canvas - Fabric canvas instance
 * @returns Array of created grid objects
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    console.error("Cannot create grid: Canvas is null");
    return [];
  }

  const gridObjects: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  try {
    // Use a simple grid pattern with fewer lines for better mobile performance
    const gridSize = 40; // Larger grid size for mobile
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Mark as grid object
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Mark as grid object
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Force a render to ensure grid is visible
    canvas.requestRenderAll();
    console.log(`Created emergency grid with ${gridObjects.length} lines`);
    
    // After a short delay, force another render to ensure grid is visible
    setTimeout(() => {
      canvas.requestRenderAll();
    }, 100);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating basic emergency grid:", error);
    return [];
  }
}

/**
 * Verify grid visibility and recreate if needed
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Existing grid objects
 * @returns Whether grid was fixed
 */
export function verifyAndFixGrid(canvas: FabricCanvas, gridObjects: FabricObject[]): boolean {
  if (!canvas) return false;
  
  // Check if grid objects exist on canvas
  const gridExists = gridObjects.some(obj => canvas.contains(obj));
  
  if (!gridExists) {
    console.log("Grid missing, recreating");
    createBasicEmergencyGrid(canvas);
    return true;
  }
  
  return false;
}

/**
 * Sets up a periodic check for grid visibility
 * @param canvas - Fabric canvas instance
 * @param intervalMs - Check interval in milliseconds
 * @returns Cleanup function
 */
export function setupGridVisibilityCheck(canvas: FabricCanvas, intervalMs = 5000): () => void {
  if (!canvas) return () => {};
  
  const intervalId = setInterval(() => {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    if (gridObjects.length === 0) {
      console.log("Grid missing, recreating during visibility check");
      createBasicEmergencyGrid(canvas);
    }
  }, intervalMs);
  
  return () => clearInterval(intervalId);
}

/**
 * Reset grid progress tracking
 * This is added to fix the import error
 */
export function resetGridProgress(): void {
  console.info('Grid progress reset');
  
  // Clear any local storage related to grid
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('grid_initialized');
    window.localStorage.removeItem('grid_creation_attempts');
  }
}
