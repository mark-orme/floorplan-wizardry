
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { toast } from "sonner";

/**
 * Very simple, reliable grid creator with no dependencies
 * Creates a basic grid pattern on the canvas
 */
export function createSimpleGrid(
  canvas: FabricCanvas, 
  gridObjects: FabricObject[] = []
): FabricObject[] {
  // Clear existing grid objects if any
  try {
    for (const obj of gridObjects) {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    }
  } catch (error) {
    console.error("Error clearing existing grid:", error);
  }
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  if (!width || !height) {
    console.error("Invalid canvas dimensions for grid creation", { width, height });
    return [];
  }
  
  console.log(`Creating simple grid on canvas ${width}x${height}`);
  
  const newGridObjects: FabricObject[] = [];
  const smallGridSpacing = 10;
  const largeGridSpacing = 50;
  
  try {
    // Create large grid lines (less frequent, darker)
    for (let i = 0; i <= width; i += largeGridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: '#d0d0d0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      newGridObjects.push(line);
      canvas.add(line);
    }
    
    for (let i = 0; i <= height; i += largeGridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: '#d0d0d0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      newGridObjects.push(line);
      canvas.add(line);
    }
    
    // Create small grid lines (more frequent, lighter)
    for (let i = 0; i <= width; i += smallGridSpacing) {
      if (i % largeGridSpacing === 0) continue; // Skip where large grid exists
      
      const line = new Line([i, 0, i, height], {
        stroke: '#f0f0f0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false, 
        objectCaching: false
      });
      newGridObjects.push(line);
      canvas.add(line);
    }
    
    for (let i = 0; i <= height; i += smallGridSpacing) {
      if (i % largeGridSpacing === 0) continue; // Skip where large grid exists
      
      const line = new Line([0, i, width, i], {
        stroke: '#f0f0f0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      newGridObjects.push(line);
      canvas.add(line);
    }
    
    // Force the canvas to render the grid
    canvas.renderAll();
    
    console.log(`Created grid with ${newGridObjects.length} lines`);
    return newGridObjects;
  } catch (error) {
    console.error("Error creating simple grid:", error);
    toast.error("Failed to create grid");
    return [];
  }
}

/**
 * Ensure grid is visible on canvas
 */
export function ensureGridVisible(
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean {
  if (!canvas || !gridObjects.length) return false;
  
  let fixed = false;
  
  // Count objects on canvas
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  
  // If no grid objects on canvas, try to re-add them
  if (objectsOnCanvas < gridObjects.length) {
    console.log(`Grid missing objects: ${objectsOnCanvas}/${gridObjects.length}`);
    
    // Add missing objects
    for (const obj of gridObjects) {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        fixed = true;
      }
    }
    
    if (fixed) {
      canvas.renderAll();
      console.log("Fixed missing grid objects");
    }
  }
  
  return fixed;
}

/**
 * Snap a point to the grid
 */
export function snapPointToGrid(
  x: number, 
  y: number, 
  gridSize: number = 10
): { x: number, y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
}
