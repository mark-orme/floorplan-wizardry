
import { Canvas as FabricCanvas } from 'fabric';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';

export const useSelectionManager = (fabricCanvas: FabricCanvas | null) => {
  // Create a deleteSelectedObjects function
  const deleteSelectedObjects = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    if (activeObject.type === 'activeSelection') {
      // Use proper type checking instead of direct type casting
      const activeSelection = activeObject;
      activeSelection.forEachObject((obj) => {
        fabricCanvas.remove(obj);
      });
      fabricCanvas.discardActiveObject();
    } else {
      fabricCanvas.remove(activeObject);
    }
    
    // Use optimized render instead of direct rendering
    requestOptimizedRender(fabricCanvas, 'delete');
  };

  return { deleteSelectedObjects };
};
