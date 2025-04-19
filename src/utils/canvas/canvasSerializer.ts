
/**
 * Canvas serialization utilities
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Serialize canvas state to JSON
 * @param canvas Fabric canvas instance
 * @returns Serialized canvas state
 */
export function serializeCanvasState(canvas: FabricCanvas): any {
  try {
    if (!canvas) return null;
    
    // Get canvas JSON
    const json = canvas.toJSON(['id', 'selectable', 'evented', 'type', 'metadata']);
    
    // Add additional canvas properties
    const state = {
      ...json,
      zoom: canvas.getZoom(),
      viewportTransform: canvas.viewportTransform,
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
    
    return state;
  } catch (error) {
    console.error('Error serializing canvas state:', error);
    return null;
  }
}

/**
 * Deserialize canvas state from JSON
 * @param canvas Fabric canvas instance
 * @param state Serialized canvas state
 * @returns Success status
 */
export function deserializeCanvasState(canvas: FabricCanvas, state: any): boolean {
  try {
    if (!canvas || !state) return false;
    
    // Clear the canvas
    canvas.clear();
    
    // Load objects from JSON
    canvas.loadFromJSON(state, () => {
      // Restore additional canvas properties
      if (state.zoom) {
        canvas.setZoom(state.zoom);
      }
      
      if (state.viewportTransform) {
        canvas.setViewportTransform(state.viewportTransform);
      }
      
      canvas.renderAll();
    });
    
    return true;
  } catch (error) {
    console.error('Error deserializing canvas state:', error);
    return false;
  }
}
