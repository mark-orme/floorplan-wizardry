
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  tool: DrawingMode;
  saveCurrentState: () => void;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseCanvasInteractionProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  
  const startInteraction = useCallback(() => {
    setIsInteracting(true);
  }, []);
  
  const endInteraction = useCallback(() => {
    if (isInteracting) {
      setIsInteracting(false);
      saveCurrentState();
    }
  }, [isInteracting, saveCurrentState]);
  
  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    canvas.discardActiveObject();
    
    activeObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.requestRenderAll();
    saveCurrentState();
  }, [fabricCanvasRef, saveCurrentState]);
  
  const enablePointSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    
    canvas.selection = true;
    
    // Make all objects selectable
    canvas.getObjects().forEach(obj => {
      // Skip grid objects
      if ((obj as any).gridObject) return;
      
      obj.selectable = true;
      (obj as any).evented = true;
    });
  }, [fabricCanvasRef]);
  
  const setupSelectionMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Set drawing mode based on the tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Enable selection for select mode
    if (tool === DrawingMode.SELECT) {
      enablePointSelection();
    } else {
      // Disable selection for drawing modes
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
    }
    
    // Set brush properties for drawing mode
    if (tool === DrawingMode.DRAW && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, tool, enablePointSelection]);
  
  return {
    isInteracting,
    startInteraction,
    endInteraction,
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
