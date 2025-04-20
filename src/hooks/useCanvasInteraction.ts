import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { FabricEventNames } from '@/types/fabric-events';

export interface CanvasInteractionOptions {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  saveCurrentState: () => void;
}

export interface UseCanvasInteractionResult {
  deleteSelectedObjects: () => void;
  enablePointSelection: () => void;
  setupSelectionMode: () => void;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: CanvasInteractionOptions): UseCanvasInteractionResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const currentObject = useRef<FabricObject | null>(null);

  // Setup canvas event handlers
  const setupInteractions = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return () => {};

    const handleMouseDown = (e: any) => {
      if (tool === DrawingMode.DRAW) {
        setIsDrawing(true);
      }
    };

    const handleMouseMove = (e: any) => {
      if (isDrawing && tool === DrawingMode.DRAW) {
        // Drawing implementation
        const pointer = canvas.getPointer(e.e);
        if (currentObject.current) {
          // Update current object based on pointer position
        }
      }
    };

    const handleMouseUp = (e: any) => {
      if (isDrawing) {
        setIsDrawing(false);
        saveCurrentState();
      }
    };

    // Add event listeners
    canvas.on(FabricEventNames.MOUSE_DOWN, handleMouseDown);
    canvas.on(FabricEventNames.MOUSE_MOVE, handleMouseMove);
    canvas.on(FabricEventNames.MOUSE_UP, handleMouseUp);

    // Cleanup function
    return () => {
      canvas.off(FabricEventNames.MOUSE_DOWN, handleMouseDown);
      canvas.off(FabricEventNames.MOUSE_MOVE, handleMouseMove);
      canvas.off(FabricEventNames.MOUSE_UP, handleMouseUp);
    };
  }, [fabricCanvasRef, tool, isDrawing, saveCurrentState]);

  // Setup interactions on mount and when dependencies change
  useEffect(() => {
    const cleanup = setupInteractions();
    return cleanup;
  }, [setupInteractions]);

  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(obj => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      saveCurrentState();
    }
  }, [fabricCanvasRef, saveCurrentState]);

  // Enable point selection mode
  const enablePointSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.selection = false; // Using point selection mode
    canvas.getObjects().forEach(obj => {
      obj.selectable = true;
    });
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);

  // Setup selection mode based on current tool
  const setupSelectionMode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.SELECT) {
      canvas.selection = true;
      canvas.getObjects().forEach(obj => {
        obj.selectable = true;
      });
    } else {
      canvas.selection = false;
      canvas.discardActiveObject();
      canvas.getObjects().forEach(obj => {
        obj.selectable = false;
      });
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, tool]);

  return {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
