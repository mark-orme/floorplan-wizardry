
import { useCallback, useEffect, MutableRefObject } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/canvas-types';

interface UseCanvasInteractionProps {
  canvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  onSelectionChange?: (selected: boolean) => void;
  onObjectModified?: (e: any) => void;
  onObjectRemoved?: (e: any) => void;
  onObjectAdded?: (e: any) => void;
  onCanvasClicked?: (e: any) => void;
  selectable?: boolean;
}

export const useCanvasInteraction = ({
  canvasRef,
  onSelectionChange,
  onObjectModified,
  onObjectRemoved,
  onObjectAdded,
  onCanvasClicked,
  selectable = true
}: UseCanvasInteractionProps) => {
  const handleSelectionCreated = useCallback((e: any) => {
    if (onSelectionChange) {
      onSelectionChange(true);
    }
  }, [onSelectionChange]);

  const handleSelectionCleared = useCallback((e: any) => {
    if (onSelectionChange) {
      onSelectionChange(false);
    }
  }, [onSelectionChange]);

  const handleObjectModified = useCallback((e: any) => {
    if (onObjectModified) {
      onObjectModified(e);
    }
  }, [onObjectModified]);

  const handleObjectRemoved = useCallback((e: any) => {
    if (onObjectRemoved) {
      onObjectRemoved(e);
    }
  }, [onObjectRemoved]);

  const handleObjectAdded = useCallback((e: any) => {
    if (onObjectAdded) {
      onObjectAdded(e);
    }
  }, [onObjectAdded]);

  const handleMouseDown = useCallback((e: any) => {
    if (onCanvasClicked && !e.target) {
      onCanvasClicked(e);
    }
  }, [onCanvasClicked]);

  const deleteSelectedObjects = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects?.() || [];
    
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        if (canvas.remove) {
          canvas.remove(obj);
        }
      });
      
      if (canvas.discardActiveObject) {
        canvas.discardActiveObject();
      }
      
      if (canvas.requestRenderAll) {
        canvas.requestRenderAll();
      }
    }
  }, [canvasRef]);

  const setObjectsSelectable = useCallback((selectable: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (canvas.forEachObject) {
      canvas.forEachObject((obj) => {
        obj.selectable = selectable;
        (obj as ExtendedFabricObject).evented = selectable;
      });
    }
    
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [canvasRef]);

  useEffect(() => {
    setObjectsSelectable(selectable);
  }, [selectable, setObjectsSelectable]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.on?.('selection:created', handleSelectionCreated);
    canvas.on?.('selection:cleared', handleSelectionCleared);
    canvas.on?.('object:modified', handleObjectModified);
    canvas.on?.('object:removed', handleObjectRemoved);
    canvas.on?.('object:added', handleObjectAdded);
    canvas.on?.('mouse:down', handleMouseDown);

    return () => {
      canvas.off?.('selection:created', handleSelectionCreated);
      canvas.off?.('selection:cleared', handleSelectionCleared);
      canvas.off?.('object:modified', handleObjectModified);
      canvas.off?.('object:removed', handleObjectRemoved);
      canvas.off?.('object:added', handleObjectAdded);
      canvas.off?.('mouse:down', handleMouseDown);
    };
  }, [
    canvasRef,
    handleSelectionCreated,
    handleSelectionCleared,
    handleObjectModified,
    handleObjectRemoved,
    handleObjectAdded,
    handleMouseDown
  ]);

  return {
    deleteSelectedObjects,
    setObjectsSelectable
  };
};
