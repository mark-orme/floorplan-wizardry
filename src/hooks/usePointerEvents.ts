
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { toFabricPoint } from '@/utils/fabricPointConverter';

interface UsePointerEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  enabled?: boolean;
}

export const usePointerEvents = ({ 
  canvasRef, 
  fabricCanvas, 
  enabled = true 
}: UsePointerEventsProps) => {
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number, y: number } | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Set up pointer event handlers
  useEffect(() => {
    if (!enabled || !fabricCanvas || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      setIsPointerDown(true);
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      lastPointRef.current = { x, y };

      // Start path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const fabricPoint = toFabricPoint({ x, y });
        fabricCanvas.freeDrawingBrush.onMouseDown(fabricPoint, {
          e,
          pointer: fabricPoint
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Draw point in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const fabricPoint = toFabricPoint(currentPoint);
        fabricCanvas.freeDrawingBrush.onMouseMove(fabricPoint, {
          e,
          pointer: fabricPoint
        });
      }

      lastPointRef.current = currentPoint;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      
      isDrawingRef.current = false;
      setIsPointerDown(false);
      lastPointRef.current = null;

      // End path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const fabricPoint = toFabricPoint({ x, y });
        fabricCanvas.freeDrawingBrush.onMouseUp({
          e,
          pointer: fabricPoint
        });
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      handlePointerUp(e);
    };

    // Add event listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerout', handlePointerOut);

    // Set touch-action to none to prevent scrolling
    canvas.style.touchAction = 'none';

    return () => {
      // FIXED: Only remove event listeners if canvas exists
      if (canvas) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointerout', handlePointerOut);
      }
    };
  }, [canvasRef, fabricCanvas, enabled]);

  return {
    isPointerDown
  };
};

export default usePointerEvents;
