import { useCallback, useRef } from 'react';
import { FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

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

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: FabricObject) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject().renderAll();
      saveCurrentState();
    }
  }, [fabricCanvasRef, saveCurrentState]);

  const enablePointSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = true;
    canvas.forEachObject((obj: FabricObject) => {
      obj.selectable = true;
    });
  }, [fabricCanvasRef]);

  const setupSelectionMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.off('object:selected');
    canvas.off('object:modified');

    if (tool === DrawingMode.SELECT) {
      enablePointSelection();
      canvas.on('object:selected', handleObjectSelected);
      canvas.on('object:modified', handleObjectModified);
    } else {
      canvas.selection = false;
      canvas.forEachObject((obj: FabricObject) => {
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
