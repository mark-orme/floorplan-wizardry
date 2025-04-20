
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  saveCurrentState: () => void;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseCanvasInteractionProps) => {
  const [isSelecting, setIsSelecting] = useState(false);

  // Delete selected objects from canvas
  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    saveCurrentState();
  }, [fabricCanvasRef, saveCurrentState]);

  // Enable point selection mode
  const enablePointSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = true;
    setIsSelecting(true);
  }, [fabricCanvasRef]);

  // Setup selection mode on canvas
  const setupSelectionMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = tool === DrawingMode.SELECT;
    canvas.defaultCursor = tool === DrawingMode.SELECT ? 'default' : 'crosshair';
    canvas.hoverCursor = tool === DrawingMode.SELECT ? 'move' : 'crosshair';
  }, [fabricCanvasRef, tool]);

  return {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode,
    isSelecting
  };
};

export default useCanvasInteraction;
