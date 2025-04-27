
import { Canvas as FabricCanvas } from 'fabric';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';

export const useSelectionManager = (fabricCanvas: FabricCanvas | null) => {
  // Create a deleteSelectedObjects function
  const deleteSelectedObjects = () => {
    if (!fabricCanvas) return;
    
    // Use getActiveObjects to get the active object(s)
    const activeObjects = fabricCanvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    // If there's only one active object
    if (activeObjects.length === 1) {
      fabricCanvas.remove(activeObjects[0]);
    } else {
      // Multiple objects are selected
      activeObjects.forEach((obj) => {
        fabricCanvas.remove(obj);
      });
      fabricCanvas.discardActiveObject();
    }
    
    // Use optimized render instead of direct rendering
    requestOptimizedRender(fabricCanvas, 'delete');
  };

  return { deleteSelectedObjects };
};
