
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Serialize canvas state for floor plan storage
 */
export const serializeCanvasState = (canvas: FabricCanvas) => {
  // Only serialize non-grid objects
  const objects = canvas.getObjects()
    .filter(obj => !(obj as any).isGrid)
    .map(obj => ({
      ...obj.toJSON(['id', 'name', 'isGrid', 'objectType']),
      type: obj.type
    }));

  return {
    objects,
    version: '1.0',
    timestamp: new Date().toISOString()
  };
};

/**
 * Deserialize canvas state for floor plan restoration
 */
export const deserializeCanvasState = (
  canvas: FabricCanvas,
  state: ReturnType<typeof serializeCanvasState>
) => {
  // Clear existing non-grid objects
  const nonGridObjects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
  canvas.remove(...nonGridObjects);

  // Load serialized objects
  state.objects.forEach(objData => {
    canvas.loadFromJSON(objData, () => {
      canvas.requestRenderAll();
    });
  });
};
