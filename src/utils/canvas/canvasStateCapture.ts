
/**
 * Canvas state capture utilities
 * Functions for capturing and applying canvas states
 */
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

/**
 * Capture the current canvas state as a JSON string
 * @param canvas The Fabric canvas instance
 * @returns JSON string representation of canvas state or null if error
 */
export const captureCanvasState = (canvas: FabricCanvas): string | null => {
  if (!canvas) return null;
  
  try {
    // Get canvas as JSON
    const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps']));
    return json;
  } catch (error) {
    console.error('Error capturing canvas state:', error);
    return null;
  }
};

/**
 * Apply a state from history to the canvas
 * @param canvas The Fabric canvas instance
 * @param stateJson JSON string representation of canvas state
 * @returns Whether the application was successful
 */
export const applyCanvasState = (canvas: FabricCanvas, stateJson: string): boolean => {
  if (!canvas) return false;
  
  try {
    // Parse the JSON state
    const state = JSON.parse(stateJson);
    
    // Load state into canvas
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
    return true;
  } catch (error) {
    console.error('Error applying canvas state:', error);
    toast.error('Failed to apply canvas state');
    return false;
  }
};
