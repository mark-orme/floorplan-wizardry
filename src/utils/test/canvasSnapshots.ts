
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Creates a canvas with standard dimensions for testing
 */
export function createTestCanvas() {
  const el = document.createElement('canvas');
  el.width = 800;
  el.height = 600;
  return new Canvas(el);
}

/**
 * Serializes and then deserializes a canvas to test restoration
 * @param originalCanvas The canvas to test
 * @returns A promise that resolves with the restored canvas
 */
export async function snapshotAndRestore(originalCanvas: Canvas): Promise<Canvas> {
  const json = originalCanvas.toJSON();
  
  const restoredCanvas = createTestCanvas();
  
  return new Promise<Canvas>((resolve) => {
    restoredCanvas.loadFromJSON(json, () => {
      restoredCanvas.renderAll();
      resolve(restoredCanvas);
    });
  });
}

/**
 * Compares two canvases to ensure they have the same objects
 * @param canvas1 First canvas
 * @param canvas2 Second canvas
 * @returns Boolean indicating if canvases match
 */
export function canvasesHaveSameObjects(canvas1: Canvas, canvas2: Canvas): boolean {
  const objects1 = canvas1.getObjects();
  const objects2 = canvas2.getObjects();
  
  if (objects1.length !== objects2.length) {
    return false;
  }
  
  // Check that all objects have the same IDs
  // (assumes objects are in the same order)
  for (let i = 0; i < objects1.length; i++) {
    if ((objects1[i] as any).id !== (objects2[i] as any).id) {
      return false;
    }
  }
  
  return true;
}

/**
 * Finds an object by ID in a canvas
 * @param canvas The canvas to search
 * @param id The ID to look for
 * @returns The found object or undefined
 */
export function findObjectById(canvas: Canvas, id: string): FabricObject | undefined {
  return canvas.getObjects().find(obj => (obj as any).id === id);
}
