
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
    const objects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    const json = {
      objects: objects.map(obj => obj.toJSON(['id', 'objectType'])),
      background: canvas.backgroundColor
    };
    
    return JSON.stringify(json);
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
    // Parse the state
    const parsedState = JSON.parse(state);
    
    // Store grid objects
    const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
    
    // Clear non-grid objects
    canvas.getObjects()
      .filter(obj => (obj as any).objectType !== 'grid')
      .forEach(obj => canvas.remove(obj));
    
    // Load objects from state
    if (parsedState.objects && Array.isArray(parsedState.objects)) {
      parsedState.objects.forEach(objData => {
        try {
          const klass = fabric.util.getKlass(objData.type);
          if (klass) {
            const object = fabric.util.enlivenObjectEnlivables(objData, {});
            klass.fromObject(objData, (obj: fabric.Object) => {
              canvas.add(obj);
              canvas.renderAll();
            });
          }
        } catch (e) {
          console.error('Error adding object:', e);
        }
      });
    }
    
    // Set background color if provided
    if (parsedState.background) {
      canvas.setBackgroundColor(parsedState.background, canvas.renderAll.bind(canvas));
    }
    
    // Make sure grid objects are on top
    gridObjects.forEach(obj => {
      canvas.bringToFront(obj);
    });
    
    // Render canvas
    canvas.renderAll();
  } catch (error) {
    console.error('Error applying canvas state:', error);
  }
};
