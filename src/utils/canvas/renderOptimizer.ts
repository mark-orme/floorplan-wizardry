
import { ExtendedFabricCanvas } from '@/types/fabric-unified';
import { Object as FabricObject } from 'fabric';

/**
 * Batch canvas operations for better performance
 * @param canvas The fabric canvas
 * @param operations Functions to execute in a batch
 */
export const batchCanvasOperations = (
  canvas: ExtendedFabricCanvas | null,
  operations: (() => void)[]
) => {
  if (!canvas) return;
  
  // Disable rendering during operations
  const originalRenderOnAddRemove = canvas.renderOnAddRemove;
  if (canvas.renderOnAddRemove !== undefined) {
    canvas.renderOnAddRemove = false;
  }

  try {
    // Execute all operations
    operations.forEach(operation => {
      operation();
    });
  } finally {
    // Restore original rendering setting
    if (canvas.renderOnAddRemove !== undefined) {
      canvas.renderOnAddRemove = originalRenderOnAddRemove;
    }
    
    // Render all changes at once
    canvas.requestRenderAll?.() || canvas.renderAll();
  }
};

/**
 * Add multiple objects to canvas in a batch
 */
export const addObjectsBatch = (canvas: ExtendedFabricCanvas | null, objects: FabricObject[]) => {
  batchCanvasOperations(canvas, [
    () => objects.forEach(obj => canvas?.add(obj))
  ]);
};

/**
 * Remove multiple objects from canvas in a batch
 */
export const removeObjectsBatch = (canvas: ExtendedFabricCanvas | null, objects: FabricObject[]) => {
  batchCanvasOperations(canvas, [
    () => objects.forEach(obj => canvas?.remove(obj))
  ]);
};
