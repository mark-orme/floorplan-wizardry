import { Canvas as FabricCanvas } from 'fabric';

/**
 * Captures the current state of a canvas as a JSON string
 * @param canvas Fabric canvas to capture
 * @returns JSON string representing the current state
 */
export const captureCanvasState = (canvas: FabricCanvas): string => {
  if (!canvas) return '';
  
  try {
    // Serialize canvas to JSON, excluding grid objects
    const json = canvas.toJSON(['objectType']);
    const jsonString = JSON.stringify(json);
    return jsonString;
  } catch (error) {
    console.error('Error capturing canvas state:', error);
    return '';
  }
};

/**
 * Applies a serialized state to a canvas
 * @param canvas Fabric canvas to apply state to
 * @param state JSON string state to apply
 */
export const applyCanvasState = (canvas: FabricCanvas, state: string): void => {
  if (!canvas || !state) return;
  
  try {
    // Clear canvas first (keeping grid objects)
    const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
    canvas.clear();
    
    // Load new state
    canvas.loadFromJSON(state, () => {
      // Restore grid objects
      gridObjects.forEach(obj => canvas.add(obj));
      
      // Send grid objects to back
      gridObjects.forEach(obj => canvas.sendToBack(obj));
      
      // Render canvas
      canvas.renderAll();
    });
  } catch (error) {
    console.error('Error applying canvas state:', error);
  }
};
