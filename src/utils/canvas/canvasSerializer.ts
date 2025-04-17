
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export const serializeCanvasState = (canvas: FabricCanvas) => {
  try {
    const canvasJson = canvas.toJSON(['id', 'name', 'layerId', 'selectable']);
    const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    
    return {
      canvasJson,
      objects: objects.map(obj => ({
        id: (obj as any).id,
        type: obj.type,
        data: obj.toJSON(['id', 'name', 'layerId'])
      }))
    };
  } catch (error) {
    console.error('Error serializing canvas state:', error);
    return null;
  }
};

export const deserializeCanvasState = (canvas: FabricCanvas, state: any) => {
  try {
    if (!state) return false;
    
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
