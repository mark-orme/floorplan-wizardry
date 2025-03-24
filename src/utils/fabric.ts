
/**
 * Re-exports all Fabric.js utilities
 * @module fabric
 */
import { Canvas, Object as FabricObject } from "fabric";

// Export from fabricBrush
export { initializeDrawingBrush, addPressureSensitivity } from './fabricBrush';

// Export from fabricCanvas
export { 
  setCanvasDimensions,
  disposeCanvas,
  clearCanvasObjects
} from './fabricCanvas';

// Export from fabricInteraction
export {
  addPinchToZoom,
  snapToAngle,
  enablePanning
} from './fabricInteraction';

/**
 * Workaround for missing moveTo in Fabric.js v6+ type definitions
 * This provides a compatibility layer for the functionality
 * 
 * @param {Canvas} canvas The fabric.js canvas instance
 * @param {FabricObject} object The object to move
 * @param {number} index The index to move the object to
 * @returns {boolean} indicating success
 */
export const canvasMoveTo = (canvas: Canvas, object: FabricObject, index: number): boolean => {
  if (!canvas || !object) return false;
  
  try {
    // Try the native moveTo method first (will work if available)
    if (typeof (canvas as any).moveTo === 'function') {
      (canvas as any).moveTo(object, index);
      return true;
    }
    
    // Fallback to manual reordering if moveTo is not available
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(object);
    
    if (currentIndex === -1) return false; // Object not in canvas
    if (currentIndex === index) return true; // Already at target position
    
    // Remove from current position and insert at new position
    canvas.remove(object);
    
    // Get updated list of objects
    const updatedObjects = canvas.getObjects();
    
    // Calculate actual insert position based on current objects
    const insertIndex = Math.min(index, updatedObjects.length);
    
    // Reconstruct the objects array with the object at the new position
    const newObjects = [
      ...updatedObjects.slice(0, insertIndex),
      object,
      ...updatedObjects.slice(insertIndex)
    ];
    
    // Clear and re-add all objects in the new order
    canvas.clear();
    newObjects.forEach(obj => canvas.add(obj));
    
    // Use requestRenderAll instead of renderAll for Fabric.js v6 compatibility
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    console.error("Error in canvasMoveTo:", error);
    return false;
  }
};
