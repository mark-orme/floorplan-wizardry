
import { useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

export interface CanvasInteractionOptions {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvas?: React.MutableRefObject<FabricCanvas | null>; // Added for test compatibility
  tool?: DrawingMode;
  saveCurrentState?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export interface UseCanvasInteractionResult {
  isInteracting: boolean;
  startInteraction: () => void;
  endInteraction: () => void;
  deleteSelectedObjects: () => void;
  enablePointSelection: () => void;
  setupSelectionMode: () => void;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  canvas,
  tool = DrawingMode.SELECT,
  saveCurrentState,
  onInteractionStart,
  onInteractionEnd
}: CanvasInteractionOptions): UseCanvasInteractionResult => {
  // Use canvas or fabricCanvasRef, whichever is provided
  const canvasRef = canvas || fabricCanvasRef;
  const [isInteracting, setIsInteracting] = useState(false);

  const startInteraction = useCallback(() => {
    setIsInteracting(true);
    onInteractionStart?.();
  }, [onInteractionStart]);

  const endInteraction = useCallback(() => {
    setIsInteracting(false);
    onInteractionEnd?.();
  }, [onInteractionEnd]);

  const deleteSelectedObjects = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    // Save state before deletion
    if (saveCurrentState) {
      saveCurrentState();
    }

    // Remove all selected objects
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [canvasRef, saveCurrentState]);

  const enablePointSelection = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    canvas.selection = false; // Disable group selection
    canvas.forEachObject(obj => {
      obj.selectable = true;
      obj.evented = true;
    });
    canvas.requestRenderAll();
  }, [canvasRef]);

  const setupSelectionMode = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    if (tool === DrawingMode.SELECT) {
      canvas.isDrawingMode = false;
      enablePointSelection();
    } else {
      canvas.isDrawingMode = tool === DrawingMode.DRAW || tool === DrawingMode.PENCIL;
      canvas.selection = false;
      canvas.forEachObject(obj => {
        obj.selectable = false;
        obj.evented = false;
      });
    }
    canvas.requestRenderAll();
  }, [canvasRef, tool, enablePointSelection]);

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      const canvas = canvasRef?.current;
      if (canvas) {
        canvas.off();
      }
    };
  }, [canvasRef]);

  return {
    isInteracting,
    startInteraction,
    endInteraction,
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
