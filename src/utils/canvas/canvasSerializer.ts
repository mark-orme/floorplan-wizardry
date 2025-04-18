
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export const serializeCanvasState = (canvas: FabricCanvas) => {
  try {
    const canvasJson = canvas.toJSON(['id', 'name', 'layerId', 'selectable']);
    const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    
    return {
      canvasJson,
      objects: objects.map(obj => ({
        id: (obj as any).id,
        type: obj.type || 'unknown',
        data: obj.toJSON(['id', 'name', 'layerId'])
      }))
    };
  } catch (error) {
    console.error('Error serializing canvas state:', error);
    // Return minimal valid structure to avoid type errors
    return {
      canvasJson: {},
      objects: []
    };
  }
};

export const deserializeCanvasState = (canvas: FabricCanvas, state: any) => {
  try {
    if (!state || !state.canvasJson) return false;
    
    // Clear existing objects except grid
    const nonGridObjects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    canvas.remove(...nonGridObjects);
    
    // Load canvas state
    canvas.loadFromJSON(state.canvasJson, () => {
      canvas.renderAll();
    });
    
    return true;
  } catch (error) {
    console.error('Error deserializing canvas state:', error);
    return false;
  }
};
