
import { useCallback, useRef } from 'react';
import { Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { ExtendedFabricCanvas } from '@/types/fabric-unified';

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>;
  tool: DrawingMode;
  saveCurrentState: () => void;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseCanvasInteractionProps) => {
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleObjectSelected = useCallback((opt: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || tool !== DrawingMode.SELECT) return;

    // Implementation goes here
    console.log('Object selected', opt.target);
    saveCurrentState();
  }, [fabricCanvasRef, tool, saveCurrentState]);

  const handleObjectModified = useCallback((opt: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Implementation goes here
    console.log('Object modified', opt.target);
    saveCurrentState();
  }, [fabricCanvasRef, saveCurrentState]);

  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects ? canvas.getActiveObjects() : [];
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: FabricObject) => {
        canvas.remove(obj);
      });
      if (canvas.discardActiveObject) {
        canvas.discardActiveObject();
      }
      canvas.renderAll();
      saveCurrentState();
    }
  }, [fabricCanvasRef, saveCurrentState]);

  const enablePointSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = true;
    canvas.forEachObject && canvas.forEachObject((obj: FabricObject) => {
      obj.selectable = true;
    });
  }, [fabricCanvasRef]);

  const setupSelectionMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Use type-safe event handlers with correct parameters
    canvas.off('object:selected', handleObjectSelected as any);
    canvas.off('object:modified', handleObjectModified as any);

    if (tool === DrawingMode.SELECT) {
      enablePointSelection();
      canvas.on('object:selected', handleObjectSelected as any);
      canvas.on('object:modified', handleObjectModified as any);
    } else {
      canvas.selection = false;
      canvas.forEachObject && canvas.forEachObject((obj: FabricObject) => {
        obj.selectable = false;
      });
    }
  }, [fabricCanvasRef, tool, enablePointSelection, handleObjectSelected, handleObjectModified]);

  const startInteraction = useCallback((event: any) => {
    isDragging.current = true;
    lastPosition.current = { x: event.e.clientX, y: event.e.clientY };
  }, []);

  const endInteraction = useCallback(() => {
    isDragging.current = false;
  }, []);

  const isInteracting = isDragging.current;

  return {
    isInteracting,
    startInteraction,
    endInteraction,
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
