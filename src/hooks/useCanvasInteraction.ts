import { useCallback, useEffect, MutableRefObject } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedCanvas } from '@/types/fabric-unified'; // Fixed import
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/canvas-types';

interface UseCanvasInteractionProps {
  canvasRef: MutableRefObject<ExtendedCanvas | null>;
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
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleObjectSelected = useCallback((opt: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectable) return;

    // Implementation goes here
    console.log('Object selected', opt.target);
    onSelectionChange && onSelectionChange(true);
  }, [canvasRef, selectable, onSelectionChange]);

  const handleObjectModified = useCallback((opt: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Implementation goes here
    console.log('Object modified', opt.target);
    onObjectModified && onObjectModified(opt);
  }, [canvasRef, onObjectModified]);

  const deleteSelectedObjects = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects ? canvas.getActiveObjects() : [];
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: ExtendedFabricObject) => {
        canvas.remove(obj);
      });
      if (canvas.discardActiveObject) {
        canvas.discardActiveObject();
      }
      canvas.renderAll();
    }
  }, [canvasRef]);

  const enablePointSelection = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.selection = true;
    canvas.forEachObject && canvas.forEachObject((obj: ExtendedFabricObject) => {
      obj.selectable = true;
    });
  }, [canvasRef]);

  const setupSelectionMode = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use type-safe event handlers with correct parameters
    canvas.off('object:selected', handleObjectSelected as any);
    canvas.off('object:modified', handleObjectModified as any);

    if (selectable) {
      enablePointSelection();
      canvas.on('object:selected', handleObjectSelected as any);
      canvas.on('object:modified', handleObjectModified as any);
    } else {
      canvas.selection = false;
      canvas.forEachObject && canvas.forEachObject((obj: ExtendedFabricObject) => {
        obj.selectable = false;
      });
    }
  }, [canvasRef, selectable, enablePointSelection, handleObjectSelected, handleObjectModified]);

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
