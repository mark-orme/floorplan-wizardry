
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createGroup, createPath, isGroup, isPath } from '@/components/canvas/fabric/FabricComponents';
import { toast } from 'sonner';

interface UseCanvasInteractionsProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export const useCanvasInteractions = ({ canvasRef }: UseCanvasInteractionsProps) => {
  const [isPanning, setIsPanning] = useState(false);
  const [lastPosX, setLastPosX] = useState(0);
  const [lastPosY, setLastPosY] = useState(0);

  const enablePan = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.defaultCursor = 'grab';
    canvas.hoverCursor = 'grab';
    setIsPanning(true);
  }, [canvasRef]);

  const disablePan = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    setIsPanning(false);
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: any) => {
      if (!isPanning || e.target) return;

      const pointer = canvas.getPointer(e.e);
      setLastPosX(pointer.x);
      setLastPosY(pointer.y);
      canvas.selection = false;

      // Add null checks for viewportTransform
      if (canvas.viewportTransform) {
        const vpt = canvas.viewportTransform;
        canvas.viewportTransform[4] = vpt ? vpt[4] : 0;
        canvas.viewportTransform[5] = vpt ? vpt[5] : 0;
      }

      canvas.renderAll();
    };

    const handleMouseMove = (e: any) => {
      if (!isPanning) return;
      if (!e.target && e.e.buttons === 1) {
        const pointer = canvas.getPointer(e.e);
        const deltaX = pointer.x - lastPosX;
        const deltaY = pointer.y - lastPosY;

        // Add null checks for viewportTransform
        if (canvas.viewportTransform) {
          canvas.viewportTransform[4] += deltaX;
          canvas.viewportTransform[5] += deltaY;
        }

        canvas.requestRenderAll();
        
        setLastPosX(pointer.x);
        setLastPosY(pointer.y);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (canvas.getActiveObject) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.remove?.(activeObject);
            canvas.requestRenderAll?.();
            toast.success('Object deleted');
          }
        }
      }

      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (canvas.getActiveObject) {
          const activeObject = canvas.getActiveObject();
          if (!activeObject) {
            const allObjects = canvas.getObjects();
            if (allObjects.length) {
              canvas.discardActiveObject?.();
              if (allObjects.length > 1) {
                const selection = new fabric.ActiveSelection(allObjects, { canvas });
                canvas.setActiveObject?.(selection);
              } else {
                canvas.setActiveObject?.(allObjects[0]);
              }
              canvas.requestRenderAll?.();
            }
          }
        }
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasRef, isPanning, lastPosX, lastPosY]);

  return {
    enablePan,
    disablePan,
    isPanning
  };
};
